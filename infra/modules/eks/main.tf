  resource "aws_security_group" "eks" {
    name        = "${var.env_name} eks cluster"
    description = "Allow traffic"
    vpc_id      = var.vpc_id

    ingress {
      description      = "World"
      from_port        = 0
      to_port          = 0
      protocol         = "-1"
      cidr_blocks      = ["0.0.0.0/0"]
      ipv6_cidr_blocks = ["::/0"]
    }

    egress {
      from_port        = 0
      to_port          = 0
      protocol         = "-1"
      cidr_blocks      = ["0.0.0.0/0"]
      ipv6_cidr_blocks = ["::/0"]
    }

    tags = merge({
      Name = "EKS ${var.env_name}",
      "kubernetes.io/cluster/${local.eks_name}": "owned"
    }, var.tags)
  }

  module "eks" {
    source = "terraform-aws-modules/eks/aws"
    version = "18.19.0"

    cluster_name                    = var.eks_name
    cluster_version                 = "1.21"
    cluster_endpoint_private_access = true
    cluster_endpoint_public_access  = true
    cluster_additional_security_group_ids = [aws_security_group.eks.id]

    vpc_id     = var.vpc_id
    subnet_ids = var.private_subnet_ids

    eks_managed_node_group_defaults = {
      ami_type               = "AL2_x86_64"
      disk_size              = 50
      instance_types         = ["t3.medium", "t3.large"]
      vpc_security_group_ids = [aws_security_group.eks.id]
    }

    eks_managed_node_groups = {
      green = {
        min_size     = 1
        max_size     = 10
        desired_size = 3

        instance_types = ["t3.medium"]
        capacity_type  = "SPOT"
        labels = var.tags 
        taints = {
        }
        tags = var.tags
      }
    }

    tags = var.tags
  }

  module "lb_role" {
  source    = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"

  role_name = "${var.env_name}_eks_lb"
  attach_load_balancer_controller_policy = true

  oidc_providers = {
    main = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["kube-system:aws-load-balancer-controller"]
    }
  }
}

provider "kubernetes" {
  host                   = var.cluster_endpoint
  cluster_ca_certificate = base64decode(var.cluster_ca_cert)
  exec {
    api_version = "client.authentication.k8s.io/v1alpha1"
    args        = ["eks", "get-token", "--cluster-name", var.cluster_name]
    command     = "aws"
  }
}

provider "helm" {
  kubernetes {
    host                   = var.cluster_endpoint
    cluster_ca_certificate = base64decode(var.cluster_ca_cert)
    exec {
      api_version = "client.authentication.k8s.io/v1alpha1"
      args        = ["eks", "get-token", "--cluster-name", var.cluster_name]
      command     = "aws"
    }
  }
}

resource "kubernetes_service_account" "service-account" {
  metadata {
    name = "aws-load-balancer-controller"
    namespace = "kube-system"
    labels = {
        "app.kubernetes.io/name"= "aws-load-balancer-controller"
        "app.kubernetes.io/component"= "controller"
    }
    annotations = {
      "eks.amazonaws.com/role-arn" = module.lb_role.arn
      "eks.amazonaws.com/sts-regional-endpoints" = "true"
    }
  }
}

resource "helm_release" "lb" {
  name       = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  namespace  = "kube-system"
  depends_on = [
    kubernetes_service_account.service-account
  ]

  set {
    name  = "region"
    value = "eu-west-2"
  }

  set {
    name  = "vpcId"
    value = var.vpc_id
  }

  set {
    name  = "image.repository"
    value = "602401143452.dkr.ecr.eu-west-2.amazonaws.com/amazon/aws-load-balancer-controller"
  }

  set {
    name  = "serviceAccount.create"
    value = "false"
  }

  set {
    name  = "serviceAccount.name"
    value = "aws-load-balancer-controller"
  }

  set {
    name  = "clusterName"
    value = var.eks_name
  }
}