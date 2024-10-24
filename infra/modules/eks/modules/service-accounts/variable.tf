variable "cluster_oidc_issuer" {
  type        = string
  description = "OAuth Server EKS Cluster OIDC ISSUER URL"
}

variable "cluster_endpoint" {
  type        = string
  description = "OAuth Server EKS Cluster OIDC ISSUER URL"
}

variable "cluster_name" {
  type        = string
  description = "EKS Cluster Name"
}

variable "cluster_ca" {
  type        = string
  description = "EKS Cluster certificate"
}
