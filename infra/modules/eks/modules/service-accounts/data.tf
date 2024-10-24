data "tls_certificate" "eks" {
  url = var.cluster_oidc_issuer
}
data "aws_eks_cluster_auth" "oauth_server_eks_cluster_auth" {
  name = var.cluster_name
}
