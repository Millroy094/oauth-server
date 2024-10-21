output "user_dynamodb_table_arn" {
  value = aws_dynamodb_table.user_dynamodb_table.arn
}

output "client_dynamodb_table_arn" {
  value = aws_dynamodb_table.client_dynamodb_table.arn
}

output "otp_dynamodb_table_arn" {
  value = aws_dynamodb_table.otp_dynamodb_table.arn
}

output "oidc_store_dynamodb_table_arn" {
  value = aws_dynamodb_table.oidc_store_dynamodb_table.arn
}
