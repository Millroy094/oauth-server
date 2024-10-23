variable "eks_cluster_name" {
  description = "The name of the EKS cluster"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs."
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs."
}
