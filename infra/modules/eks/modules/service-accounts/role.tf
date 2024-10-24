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
          "${var.cluster_oidc_issuer}:sub" = "system:serviceaccount:${local.namespace}:${local.dynamodb_service_account_name}"
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
