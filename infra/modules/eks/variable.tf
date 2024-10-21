variable "vpc_id" {
  type = string
}

variable "tags" {
  type    = list(string)
  default = ["oauth", "oauth-server"]
}

variable "private_subnet_ids" {
}

variable "dynamodb_table_arns" {
  type = list(string)
}
