variable "vpc_id" {
  type = string
}

variable "private_subnet_ids" {
}

variable "dynamodb_table_arns" {
  type = list(string)
}
