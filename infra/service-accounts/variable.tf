variable "aws_access_key" {
  type        = string
  description = "The AWS development account access key"
  nullable    = false
}

variable "aws_secret_key" {
  type        = string
  description = "The AWS development account secret key"
  nullable    = false
}

variable "aws_region" {
  type        = string
  description = "The AWS development account region"
  default     = "eu-west-2"
}

variable "cluster_name" {
  type        = string
  description = "Name of the EKS Cluster"
  default     = "oauth-server-cluster"
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