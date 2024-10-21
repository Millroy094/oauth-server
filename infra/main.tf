provider "aws" {
  region     = var.aws_region
  access_key = var.access_key
  secret_key = var.secret_key
}

module "vpc" {
  source = "./modules/vpc"
}

module "dynamodb" {
  source = "./modules/dynamo-db"
}

module "eks" {
  source              = "./modules/eks"
  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  dynamodb_table_arns = module.dynamodb.*
}
