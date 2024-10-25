module "oauth_server_eks_cluster" {
  source             = "./modules/cluster"
  aws_account_id     = var.aws_account_id
  eks_cluster_name   = var.eks_cluster_name
  private_subnet_ids = var.private_subnet_ids
  public_subnet_ids  = var.public_subnet_ids
}

module "oauth_server_eks_node_groups" {
  source             = "./modules/node-groups"
  eks_cluster_name   = var.eks_cluster_name
  private_subnet_ids = var.private_subnet_ids

  depends_on = [module.oauth_server_eks_cluster]
}

module "oauth_server_cluster_service_accounts" {
  source = "./modules/service-accounts"
  cluster_name = module.oauth_server_eks_cluster.cluster_name
  cluster_endpoint = module.oauth_server_eks_cluster.cluster_endpoint
  cluster_oidc_issuer = module.oauth_server_eks_cluster.cluster_oidc_issuer
  cluster_oidc_ca = module.oauth_server_eks_cluster.custer_oidc_ca

  depends_on = [ module.oauth_server_eks_cluster ]
}
