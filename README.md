# Crafthub

## Front end installation

Install Node.js and npm:

```bash
# installs nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# download and install Node.js (you may need to restart the terminal)
nvm install 23
```

Install the required packages:

```bash
npm install
```

### Launch the front end demo page

Run the following command:

```bash
npm run dev
```

The front end will be available at `http://localhost:3000/`

<img width="1468" height="1053" alt="image" src="https://github.com/user-attachments/assets/b1a0bd82-a797-4c3d-9b1c-a43673db456e" />

# Infrastructure, deployment and CI/CD

The infrastructure is managed with 2 steps, deploying services in [GCP with Terraform](https://registry.terraform.io/providers/hashicorp/google/latest/docs):

- `setup`: it creates all the services required for the system. It needs to be run just once.
- `deploy`: final step to deploy the system. It can be done manually or automatically (via GitHub workflows) as part of the CI/CD process.

## Service `setup`

To guarantee the right segmentation of the services, we use two different projects in GCP:

- `madebyme-dev`: for development and testing
- `madebyme-prod`: for production.

> ❗ Select the right environment via `ENVIRONMENT` variables to setup the right services.

Install GCP CLI `gcloud` with [this guide](https://cloud.google.com/sdk/docs/install#deb) and login with:

```bash
# Select dev or prod environment to setup the services
export ENVIRONMENT=dev # or prod
export REGION=europe-west6
export TF_STATE_BUCKET=madebyme-tf-state-$ENVIRONMENT
export PROJECT_ID=madebyme-project-$ENVIRONMENT

gcloud auth login
gcloud config set project $PROJECT_ID
gcloud auth application-default login
gcloud auth application-default set-quota-project $PROJECT_ID
gcloud auth print-access-token | docker login \
      -u oauth2accesstoken --password-stdin "https://${REGION}-docker.pkg.dev"
```

❗❗❗ IMPORTANT ❗❗❗ The first login is used for the CLI and the second one for applications that are configured to use ADC. These two can be different so double check that they are pointing to the same account AND project.
You can check the current project with `gcloud config get-value project` and `cat ~/.config/gcloud/application_default_credentials.json`.

### Terraform remote state

Terraform employs a remote state to manage the deployments effectively across teams. In this case, the remote state (i.e., [Terraform GCP backend](https://developer.hashicorp.com/terraform/language/backend/gcs)) is stored in Google Cloud Storage.

To do so, it's necessary to create (just once) the bucket (with object versioning) to store the remote state:

```bash
gcloud storage buckets create \
      "gs://${TF_STATE_BUCKET}" --location=${REGION}
gcloud storage buckets update \
      "gs://${TF_STATE_BUCKET}" --versioning
```

### Run the Terraform `setup`

Now, run Terraform setup stage with:
to create:

- Service account `madebyme-deployer-<ENVIRONMENT>`
- Artifact Registry `madebyme-artifacts`
- GCP Storage buckets `madebyme-bucket-test` and `madebyme-bucket-<ENVIRONMENT>`
- Google SQL database instance `madebyme-postgres-<ENVIRONMENT>`, the database `madebyme-db-<ENVIRONMENT>` and the user `gcp-postgres-user-<ENVIRONMENT>`.

```bash
terraform -chdir=terraform/setup init -reconfigure \
            -backend-config="bucket=madebyme-tf-state-${ENVIRONMENT}" \
            -backend-config="prefix=setup"
terraform -chdir=terraform/setup apply -var="project_id=$PROJECT_ID" \
          -var="environment=$ENVIRONMENT"
export ARTIFACTS_REPO_URL=$(terraform -chdir=terraform/setup output -raw artifacts_repo_url)
export SERVICE_ACCOUNT_EMAIL=$(terraform -chdir=terraform/setup output -raw service_account_email)
export DATABASE_URL=$(terraform -chdir=terraform/setup output -raw postgres_connection_string)
export DB_USER=$(terraform -chdir=terraform/setup output -raw postgres_user)
export DB_PASS=$(terraform -chdir=terraform/setup output -raw postgres_password)
```

To get the `GCP_KEY`, run the following command and read the json file:

```bash
gcloud iam service-accounts keys create madebyme-$ENVIRONMENT-key.json \
    --iam-account=${SERVICE_ACCOUNT_EMAIL}
```

the json content to be used as GitHub secret `GCP_KEY` must be flattened:

```bash
jq -c . madebyme-$ENVIRONMENT-key.json > madebyme-$ENVIRONMENT-key-flat.json
```

Save them to GitHub secrets for the respective environments as in this table:

| Env Variable   | dev                                  | prod                                  |
| -------------- | ------------------------------------ | ------------------------------------- |
| GCP_KEY(\*)    | madebyme-dev-key-flat.json (content) | madebyme-prod-key-flat.json (content) |
| GCP_PROJECT_ID | madebyme-project-dev                 | madebyme-project-prod                 |
| DATABASE_URL   | \*\*\*                               | \*\*\*                                |
| DB_USER        | \*\*\*                               | \*\*\*                                |
| DB_PASS        | \*\*\*                               | \*\*\*                                |
| JWT_SECRET     | \*\*\*                               | \*\*\*                                |
| CUSTOM_DOMAIN  |                                      | madebyme.hu                           |

## Service `deploy`

The services are containerized with `docker`, stored in the Artifact Registry and, on pushes in branch `master` or when a new release is created, are deployed via Cloud Run in the environment `dev` and `prod` respectively.

### Manual deployment

Build and push the images for the BE:

```bash
export GIT_COMMIT_HASH=$(git rev-parse --short HEAD)
docker build --push \
  --secret id=google_credentials,src=madebyme-$ENVIRONMENT-key.json \
  -f be.Dockerfile \
  -t ${ARTIFACTS_REPO_URL}/be:${GIT_COMMIT_HASH} .
```

Build and push the images for the FE:

```bash
export GIT_COMMIT_HASH=$(git rev-parse --short HEAD)
docker build --push \
  --secret id=google_credentials,src=madebyme-$ENVIRONMENT-key.json \
  -f fe.Dockerfile \
  -t ${ARTIFACTS_REPO_URL}/fe:${GIT_COMMIT_HASH} .
```

Deploy the images in Cloud Run:

> ❗ Select the right environment via `ENVIRONMENT` variables to deploy the right services.

```bash
export ENVIRONMENT=dev # choose accordingly

terraform -chdir=terraform/deploy init -reconfigure \
  -backend-config="bucket=madebyme-tf-state-${ENVIRONMENT}" \
  -backend-config="prefix=deploy"

# Select the right workspace: dev or prod
terraform -chdir=terraform/deploy workspace select -or-create ${ENVIRONMENT}

terraform -chdir=terraform/deploy apply \
  -var="git_sha=${GIT_COMMIT_HASH}" \
  -var="DATABASE_URL=${DATABASE_URL}" \
  -var="DB_USER=${DB_USER}" \
  -var="DB_PASS=${DB_PASS}" \
  -var="JWT_SECRET=${JWT_SECRET}"
```

Note: you'll be prompted to provide a `CUSTOM_DOMAIN`. For `dev`, skip it by pressing `Enter`. For `prod`, provide the domain you want to use (e.g., `madebyme.example.com`).

### CI/CD deployment

The steps above are executed automatically by the GitHub workflows:

- `dev-deploy.yml`: triggered on pushes to branch `master`, it deploys in the `dev` environment.
- `prod-deploy.yaml`: triggered on new releases, it deploys in the `prod` environment.
