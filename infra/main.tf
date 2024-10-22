provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

module "vpc" {
  source = "./modules/vpc"
}

module "dynamodb" {
  source = "./modules/dynamo-db"
}

module "eks" {
  depends_on          = [module.vpc, module.dynamodb]
  source              = "./modules/eks"
  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  dynamodb_table_arns = [module.dynamodb.client_dynamodb_table_arn, module.dynamodb.user_dynamodb_table_arn, module.dynamodb.otp_dynamodb_table_arn, module.dynamodb.oidc_store_dynamodb_table_arn]
}
