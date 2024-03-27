provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

module "backend" {
  source                       = "./backend"
  keycloak_auth_server_url     = var.keycloak_auth_server_url
  keycloak_realm               = var.keycloak_realm
  keycloak_admin_client_id     = var.keycloak_admin_client_id
  keycloak_admin_client_secret = var.keycloak_admin_client_secret
  keycloak_client_id           = var.keycloak_client_id
  keycloak_client_secret       = var.keycloak_client_secret
}

module "frontend" {
  source          = "./frontend"
  auth_lambda_url = module.backend.endpoint_url
  depends_on      = [module.backend]
}
