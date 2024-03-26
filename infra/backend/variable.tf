variable "aws_account_id" {
  type        = string
  description = "The AWS development account id"
  nullable    = false
}
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
  default     = "us-west-2"
}

variable "availability_zones" {
  type        = list(string)
  description = "The AWS availability zones for regions"
  default     = ["us-west-2a", "us-west-2b"]
}

variable "keycloak_auth_server_url" {
  type        = string
  description = "Keycloak Auth URL"
  default     = ""
}

variable "keycloak_realm" {
  type        = string
  description = "Keycloak Realm"
  default     = ""
}

variable "keycloak_client_id" {
  type        = string
  description = "Keycloak Client ID"
  default     = ""
}

variable "keycloak_client_secret" {
  type        = string
  description = "Keycloak Client Secret"
  default     = ""
}

variable "keycloak_admin_client_id" {
  type        = string
  description = "Keycloak Admin Client ID"
  default     = ""
}

variable "keycloak_admin_client_secret" {
  type        = string
  description = "Keycloak Admin Client Secret"
  default     = ""
}
