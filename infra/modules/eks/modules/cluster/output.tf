output "cluster_endpoint" {
  value = aws_eks_cluster.oauth_server_eks_cluster.endpoint
}

output "cluster_name" {
  value = aws_eks_cluster.oauth_server_eks_cluster.name
}

output "cluster_oidc_issuer" {
  value = aws_eks_cluster.oauth_server_eks_cluster.identity[0].oidc[0].issuer
}

output "custer_oidc_ca" {
  value = aws_eks_cluster.oauth_server_eks_cluster.certificate_authority[0].data
}