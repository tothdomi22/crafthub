terraform {
  required_version = ">= 1.10"
  required_providers {
    google = {
      source = "hashicorp/google"
    }
    random = {
      source = "hashicorp/random"
    }
  }

  backend "gcs" {}
}


data "terraform_remote_state" "setup" {
  backend = "gcs"
  config = {
    bucket = "madebyme-tf-state-${terraform.workspace}"
    prefix = "setup"
  }
}


locals {
  project_id       = data.terraform_remote_state.setup.outputs.project_id
  region           = data.terraform_remote_state.setup.outputs.region
  artifacts_repo   = data.terraform_remote_state.setup.outputs.artifacts_repo_url
  service_account  = data.terraform_remote_state.setup.outputs.service_account_email
  allocated_ip_uri = data.terraform_remote_state.setup.outputs.allocated_ip_uri
}


provider "google" {
  project = local.project_id
  region  = local.region
}

variable "git_sha" {
  type = string
}

variable "JWT_SECRET" {
  type = string
}

variable "POSTGRES_URL" {
  type = string
}

variable "CUSTOM_DOMAIN" {
  description = "Custom domain for the Load Balancer."
  type        = string
}

locals {
  is_prod_deployment = var.CUSTOM_DOMAIN == "" ? false : true
  limit_ingress      = local.is_prod_deployment ? "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER" : "INGRESS_TRAFFIC_ALL"
}

# Create the Cloud Run deployment for the backend
resource "google_cloud_run_v2_service" "backend" {
  name                = "be"
  location            = local.region
  client              = "terraform"
  deletion_protection = false

  template {
    service_account = local.service_account
    containers {
      image = "${local.artifacts_repo}/be:${var.git_sha}"

      resources {
        limits = {
          memory = "2Gi"
        }
      }

      env {
        name  = "REGION"
        value = local.region
      }
      env {
        name  = "GCP_PROJECT_ID"
        value = local.project_id
      }
      env {
        name  = "POSTGRES_URL"
        value = var.POSTGRES_URL
      }
      env {
        name  = "JWT_SECRET"
        value = var.JWT_SECRET
      }
      ports {
        container_port = 8080
      }
      startup_probe {
        initial_delay_seconds = 10
        timeout_seconds       = 1
        period_seconds        = 5
        failure_threshold     = 5
        http_get {
          path = "/health/alive"
        }
      }
      liveness_probe {
        http_get {
          path = "/health/alive"
        }
      }
    }
    dynamic "vpc_access" {
      for_each = local.is_prod_deployment ? [1] : []
      content {
        connector = google_vpc_access_connector.cloud_run_connector[0].id
        egress    = "ALL_TRAFFIC"
      }
    }
    scaling {
      min_instance_count = local.is_prod_deployment ? 1 : 0
      max_instance_count = local.is_prod_deployment ? 100 : 1
    }
  }
}

resource "google_cloud_run_v2_service_iam_member" "noauth_be" {
  location = google_cloud_run_v2_service.backend.location
  name     = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Resources to use a static IP for the backend service in production
resource "google_compute_network" "vpc" {
  name                    = "cloud-run-vpc"
  count                   = local.is_prod_deployment ? 1 : 0
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "subnet" {
  name          = "cloud-run-subnet"
  count         = local.is_prod_deployment ? 1 : 0
  region        = local.region
  ip_cidr_range = "10.8.0.0/24"
  network       = google_compute_network.vpc[count.index].id
}

resource "google_compute_router" "nat_router" {
  name    = "cloud-run-nat-router"
  count   = local.is_prod_deployment ? 1 : 0
  network = google_compute_network.vpc[count.index].name
  region  = local.region
}

resource "google_compute_router_nat" "cloud_run_nat" {
  name                               = "cloud-run-nat"
  count                              = local.is_prod_deployment ? 1 : 0
  router                             = google_compute_router.nat_router[count.index].name
  region                             = local.region
  nat_ip_allocate_option             = "MANUAL_ONLY"
  nat_ips                            = [local.allocated_ip_uri]
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}

resource "google_vpc_access_connector" "cloud_run_connector" {
  name          = "cloud-run-vpc-connector"
  count         = local.is_prod_deployment ? 1 : 0
  region        = local.region
  network       = google_compute_network.vpc[count.index].name
  ip_cidr_range = "10.9.0.0/28"
  max_instances = 3
  min_instances = 2
}

# Create the Cloud Run deployment for the frontend
resource "google_cloud_run_v2_service" "frontend" {
  name                = "fe"
  location            = local.region
  client              = "terraform"
  deletion_protection = false
  ingress             = local.limit_ingress

  template {
    service_account = local.service_account
    containers {
      image = "${local.artifacts_repo}/fe:${var.git_sha}"
      ports {
        container_port = 3000
      }
      env {
        name  = "API_BASE_URL"
        value = google_cloud_run_v2_service.backend.urls[0]
      }
      startup_probe {
        initial_delay_seconds = 10
        timeout_seconds       = 1
        period_seconds        = 5
        failure_threshold     = 5
        http_get {
          path = "/"
        }
      }
      liveness_probe {
        http_get {
          path = "/"
        }
      }
    }
    scaling {
      min_instance_count = local.is_prod_deployment ? 1 : 0
      max_instance_count = local.is_prod_deployment ? 100 : 1
    }
  }
}

resource "google_cloud_run_v2_service_iam_member" "noauth_fe" {
  location = google_cloud_run_v2_service.frontend.location
  name     = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Reserved static IP for the Load Balancer
resource "google_compute_global_address" "default" {
  count   = local.is_prod_deployment ? 1 : 0
  project = local.project_id
  name    = "glb-ip"
}

# Serverless NEG for Frontend
resource "google_compute_region_network_endpoint_group" "frontend_neg" {
  name                  = "cloudrun-neg-fe"
  count                 = local.is_prod_deployment ? 1 : 0
  network_endpoint_type = "SERVERLESS"
  region                = local.region
  cloud_run {
    service = google_cloud_run_v2_service.frontend.name
  }
}

# Backend Service
resource "google_compute_backend_service" "frontend_service" {
  name                  = "fe-backend-service"
  count                 = local.is_prod_deployment ? 1 : 0
  protocol              = "HTTP"
  load_balancing_scheme = "EXTERNAL"
  port_name             = "http"

  backend {
    group = google_compute_region_network_endpoint_group.frontend_neg[count.index].id
  }
}

# URL Map
resource "google_compute_url_map" "frontend_url_map" {
  name            = "fe-url-map"
  count           = local.is_prod_deployment ? 1 : 0
  default_service = google_compute_backend_service.frontend_service[count.index].id
}

# Managed SSL Certificate
resource "google_compute_managed_ssl_certificate" "frontend_cert" {
  name  = "fe-ssl-cert-v2"
  count = local.is_prod_deployment ? 1 : 0
  managed {
    domains = [var.CUSTOM_DOMAIN,
      "www.${var.CUSTOM_DOMAIN}",
      # Add other subdomains
    ]
  }
  lifecycle {
    create_before_destroy = true
  }
}

# Target HTTPS Proxy
resource "google_compute_target_https_proxy" "frontend_https_proxy" {
  name             = "fe-https-proxy"
  count            = local.is_prod_deployment ? 1 : 0
  url_map          = google_compute_url_map.frontend_url_map[count.index].id
  ssl_certificates = [google_compute_managed_ssl_certificate.frontend_cert[count.index].id]
}

# Global Forwarding Rule
resource "google_compute_global_forwarding_rule" "frontend_https_forwarding_rule" {
  name                  = "fe-https-forwarding-rule"
  count                 = local.is_prod_deployment ? 1 : 0
  ip_address            = google_compute_global_address.default[count.index].address
  port_range            = "443"
  target                = google_compute_target_https_proxy.frontend_https_proxy[count.index].id
  load_balancing_scheme = "EXTERNAL"
}

resource "google_compute_url_map" "redirect_to_https" {
  name  = "fe-redirect-to-https"
  count = local.is_prod_deployment ? 1 : 0

  default_url_redirect {
    https_redirect = true
    strip_query    = false
  }
}

resource "google_compute_target_http_proxy" "frontend_http_proxy" {
  name    = "fe-http-proxy"
  count   = local.is_prod_deployment ? 1 : 0
  url_map = google_compute_url_map.redirect_to_https[count.index].id
}

resource "google_compute_global_forwarding_rule" "frontend_http_forwarding_rule" {
  name                  = "fe-http-forwarding-rule"
  count                 = local.is_prod_deployment ? 1 : 0
  ip_address            = google_compute_global_address.default[count.index].address
  port_range            = "80"
  target                = google_compute_target_http_proxy.frontend_http_proxy[count.index].id
  load_balancing_scheme = "EXTERNAL"
}

output "frontend_address" {
  value = local.is_prod_deployment ? google_compute_global_address.default[0].address : google_cloud_run_v2_service.frontend.urls[0]
}
