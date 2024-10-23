provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

module "vpc" {
  source           = "./modules/vpc"
  eks_cluster_name = "${var.app_name}-cluster"
}

module "dynamodb" {
  source = "./modules/dynamo-db"
}

module "eks" {
  source           = "./modules/eks"
  eks_cluster_name = "${var.app_name}-cluster"
  public_subnets   = module.vpc.public_subnets
  private_subnets  = module.vpc.private_subnets
}
