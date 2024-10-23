module "oauth_server_eks_cluster" {
  source           = "./modules/cluster"
  eks_cluster_name = var.eks_cluster_name
  private_subnets  = var.private_subnets
  public_subnets   = var.public_subnets
}

module "oauth_server_eks_node_groups" {
  source           = "./modules/node-groups"
  eks_cluster_name = var.eks_cluster_name
  private_subnets  = var.private_subnets

  depends_on = [module.oauth_server_eks_cluster]
}
