

data "tls_certificate" "oauth_server_tls_certificate" {
  url        = var.cluster_oidc_issuer
}

data "aws_eks_cluster_auth" "oauth_server_eks_cluster_auth" {
  name       = var.cluster_name
}

resource "aws_iam_openid_connect_provider" "oauth_server_eks_oidc_provider" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.oauth_server_tls_certificate.certificates[0].sha1_fingerprint]
  url             = var.cluster_oidc_issuer
}

resource "aws_iam_role" "oauth_server_eks_dynamodb_role" {
  name = "oauth-server-eks-dynamodb-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = aws_iam_openid_connect_provider.oauth_server_eks_oidc_provider.arn
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "${var.cluster_oidc_issuer}:sub" = "system:serviceaccount:${var.cluster_namespace}:${var.dynamodb_service_account_name}"
        }
      }
    }]
  })

  depends_on = [aws_iam_openid_connect_provider.oauth_server_eks_oidc_provider]
}

resource "aws_iam_policy" "oauth_server_dynamodb_access_policy" {
  name = "oauth-server-eks-dynamodb-access-policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action   = ["dynamodb:*"]
      Effect   = "Allow"
      Resource = "*"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "attach_dynamodb_policy" {
  role       = aws_iam_role.oauth_server_eks_dynamodb_role.name
  policy_arn = aws_iam_policy.oauth_server_dynamodb_access_policy.arn
}


provider "kubernetes" {
  host                   = var.cluster_endpoint
  cluster_ca_certificate = base64decode(var.cluster_oidc_ca)
  token                  = data.aws_eks_cluster_auth.oauth_server_eks_cluster_auth.token
}

resource "kubernetes_service_account" "oauth_server_dynamodb_service_account" {
  metadata {
    name      = var.dynamodb_service_account_name
    namespace = var.cluster_namespace
    annotations = {
      "eks.amazonaws.com/role-arn" = aws_iam_role.oauth_server_eks_dynamodb_role.arn
    }
  }

  depends_on = [aws_iam_role_policy_attachment.attach_dynamodb_policy, data.aws_eks_cluster_auth.oauth_server_eks_cluster_auth]
}
