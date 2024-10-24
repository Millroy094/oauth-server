data "tls_certificate" "eks" {
  url = var.cluster_oidc_issuer
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
      "eks.amazonaws.com/role-arn" = aws_iam_role.oauth_server_eks_dynamodb_role.arn
    }
  }

  depends_on = [aws_iam_role_policy_attachment.attach_dynamodb_policy]
}
