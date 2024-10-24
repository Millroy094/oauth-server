module "oauth_server_eks_cluster" {
  source             = "./modules/cluster"
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
