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


variable "project_id" {
  type = string
}


variable "region" {
  type    = string
  default = "europe-west6"
}


variable "environment" {
  type = string
}

variable "custom_domain" {
  type = string
}

locals {
  is_prod = var.environment == "prod" ? true : false
  # Add other services as needed
  services = local.is_prod ? [
    "artifactregistry.googleapis.com",
    "run.googleapis.com",
    "iamcredentials.googleapis.com",
    "vpcaccess.googleapis.com",
    "compute.googleapis.com"
    ] : [
    "artifactregistry.googleapis.com",
    "run.googleapis.com",
    "iamcredentials.googleapis.com"
  ]
}


provider "google" {
  project = var.project_id
  region  = var.region
}

#####
# GCP
#####

resource "google_project_service" "enabled_services" {
  for_each = toset(local.services)
  service  = each.key
}

# Create Service Account
resource "google_service_account" "service_account" {
  account_id = "madebyme-deployer-${var.environment}"
}

resource "google_project_iam_member" "member-role" {
  for_each = toset([
    "roles/run.admin",
    "roles/artifactregistry.admin",
    "roles/storage.admin",
    "roles/iam.serviceAccountTokenCreator",
    "roles/iam.serviceAccountUser",
    "roles/secretmanager.secretAccessor",
    "roles/compute.networkAdmin",
    "roles/compute.loadBalancerAdmin",
    "roles/compute.securityAdmin",
    "roles/vpcaccess.admin"

  ])
  role    = each.key
  member  = "serviceAccount:${google_service_account.service_account.email}"
  project = var.project_id
}

# Create new artifact registry
resource "google_artifact_registry_repository" "madebyme_artifacts" {
  location      = var.region
  repository_id = "madebyme-artifacts"
  format        = "docker"
}

# Create new storage bucket
resource "google_storage_bucket" "bucket" {
  name          = "madebyme-bucket-${var.environment}"
  location      = var.region
  storage_class = "STANDARD"

  uniform_bucket_level_access = true
  cors {
    origin          = local.is_prod ? ["https://${var.custom_domain}"] : ["*"]
    method          = ["GET", "HEAD", "PUT"]
    response_header = ["Content-Type", "Content-Disposition"]
    max_age_seconds = 3600
  }
}

# Allocate a static IP address for the Cloud Run service
resource "google_compute_address" "cloud_run_egress_ip" {
  name   = "cloud-run-egress-ip-be"
  count  = local.is_prod ? 1 : 0
  region = var.region
}

# Create SQL Second Generation Instance
resource "google_sql_database_instance" "postgres_instance" {
  name             = "madebyme-postgres-${var.environment}"
  database_version = "POSTGRES_17"
  region           = var.region

  settings {
    tier    = "db-f1-micro"
    edition = "ENTERPRISE"
    ip_configuration {
      ipv4_enabled = true
      # TODO: restrict this to specific IPs or VPC
      authorized_networks {
        name  = "internal"
        value = "0.0.0.0/0"
      }
    }
  }
}

resource "google_sql_database" "default" {
  name     = "madebyme-db-${var.environment}"
  instance = google_sql_database_instance.postgres_instance.name
}

variable "password_length" {
  default = 15
}

resource "google_sql_user" "default" {
  name     = "gcp-postgres-user-${var.environment}"
  instance = google_sql_database_instance.postgres_instance.name
  password = random_password.default.result
}

resource "random_password" "default" {
  length  = var.password_length
  special = false
}

#####
# OUTPUT
#####

locals {
  postgres_user     = google_sql_user.default.name
  postgres_password = google_sql_user.default.password
  postgres_db       = google_sql_database.default.name
  postgres_host     = google_sql_database_instance.postgres_instance.public_ip_address
  postgres_port     = 5432
}

output "project_id" {
  value = var.project_id
}

output "region" {
  value = var.region
}

output "service_account_email" {
  value = google_service_account.service_account.email
}

output "artifacts_repo_url" {
  value = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.madebyme_artifacts.repository_id}"
}

output "postgres_user" {
  value     = local.postgres_user
  sensitive = true
}

output "postgres_password" {
  value     = local.postgres_password
  sensitive = true
}

output "postgres_connection_string" {
  value     = "jdbc:postgresql://${local.postgres_host}:${local.postgres_port}/${local.postgres_db}"
  sensitive = true
}

output "allocated_ip_uri" {
  value = local.is_prod ? google_compute_address.cloud_run_egress_ip[0].self_link : ""
}
