provider "aws" {
  region     = var.aws_region
  access_key = var.access_key
  secret_key = var.secret_key
}

module "vpc" {
  source = "./modules/vpc"
}

module "sg" {
  source           = "./modules/sg"
  oauth_server_vpc = module.vpc.oauth_server_vpc
}

module "eks" {
  source                  = "./modules/eks"
  oauth_server_eks_subnet = module.vpc.oauth_server_eks_subnet
}
