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
