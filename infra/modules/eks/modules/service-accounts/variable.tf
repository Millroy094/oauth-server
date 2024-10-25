
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

variable "dynamodb_service_account_name" {
  type = string
  description = "Dynamo DB Policy Service Account Name"
  default = "oauth-server-dynamob-service-account"
}

variable "cluster_namespace" {
  type = string
  description = "Cluster namespace"
  default = "default"
}