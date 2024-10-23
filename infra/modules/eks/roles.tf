resource "aws_iam_role" "oauth_server_eks_nodes_role" {
  name                 = "${var.eks_cluster_name}-worker"
  assume_role_policy = data.aws_iam_policy_document.assume_workers.json
}

data "aws_iam_policy_document" "assume_workers" {
  statement {
    effect = "Allow"

    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "oauth_server_eks_worker_node_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.oauth_server_eks_nodes_role.name
}

resource "aws_iam_role_policy_attachment" "oauth_server_eks_cni_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.oauth_server_eks_nodes_role.name
}

resource "aws_iam_role_policy_attachment" "oauth_server_ec2_read_only" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.oauth_server_eks_nodes_role.name
}