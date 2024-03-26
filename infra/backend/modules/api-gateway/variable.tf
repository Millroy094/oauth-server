variable "aws_account_id" {}
variable "aws_region" {}
variable "endpoint_path" {
  default = "login"
}
variable "auth_lambda_invoke_arn" {}
variable "auth_lambda_function_name" {}
