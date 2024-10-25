
variable "cluster_name" {
  type = string
  description = "Cluster name"
}

variable "cluster_oidc_issuer" {
  type = string
  description = "Cluster OIDC Issuer URL"
}

variable "cluster_endpoint" {
  type = string
  description = "Cluster endpoint"
}

variable "cluster_oidc_ca" {
  type = string
  description = "Cluster oidc certificate"
}

