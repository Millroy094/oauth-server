data "tls_certificate" "eks" {
  url        = var.cluster_oidc_issuer
  depends_on = [aws_eks_cluster.oauth_server_eks_cluster]
}

resource "aws_iam_openid_connect_provider" "oauth_server_eks_oidc_provider" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.eks.certificates[0].sha1_fingerprint]
  url             = var.cluster_oidc_issuer
}

resource "kubernetes_service_account" "oauth_server_dynamodb_service_account" {
  metadata {
    name      = local.dynamodb_service_account_name
    namespace = local.namespace
    annotations = {
      "eks.amazonaws.com/role-arn" = module.iam_eks_role.iam_role_arn
    }
  }

  depends_on = [aws_iam_role_policy_attachment.attach_dynamodb_policy]
}
