resource "aws_iam_role" "oauth_server_eks_cluster_role" {
  name = "${var.eks_cluster_name}-role"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "eks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "oauth_server_eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.oauth_server_eks_cluster_role.name
}


resource "aws_iam_role" "oauth_server_eks_cluster_access_entry_admin_role" {
  name = "${var.eks_cluster_name}-access-entry-role"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "eks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY
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
          "${aws_eks_cluster.oauth_server_eks_cluster.identity[0].oidc[0].issuer}:sub" = "system:serviceaccount:${local.namespace}:${local.dynamodb_service_account_name}"
        }
      }
    }]
  })

  depends_on = [aws_eks_cluster.oauth_server_eks_cluster, aws_iam_openid_connect_provider.oauth_server_eks_oidc_provider]
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
