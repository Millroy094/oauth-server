variable "eks_cluster_name" {
  description = "The name of the EKS cluster"
  type        = string
}

variable "private_subnets" {
  type        = list(string)
  description = "List of private subnets."
}

variable "public_subnets" {
  type        = list(string)
  description = "List of public subnets."
}
