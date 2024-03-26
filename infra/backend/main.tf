provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

module "lambda" {
  source                       = "./modules/lambda"
  keycloak_auth_server_url     = var.keycloak_auth_server_url
  keycloak_realm               = var.keycloak_realm
  keycloak_client_id           = var.keycloak_client_id
  keycloak_client_secret       = var.keycloak_client_secret
  keycloak_admin_client_id     = var.keycloak_admin_client_id
  keycloak_admin_client_secret = var.keycloak_admin_client_secret
}

module "apigateway" {
  source                    = "./modules/api-gateway"
  aws_region                = var.aws_region
  aws_account_id            = var.aws_account_id
  auth_lambda_invoke_arn    = module.lambda.auth_lambda_function_invoke_arn
  auth_lambda_function_name = module.lambda.auth_lambda_function_name
}
