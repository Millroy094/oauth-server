output "auth_lambda_function_invoke_arn" {
  description = "Invoke ARN for of the Auth Lambda function."
  value       = aws_lambda_function.auth_lambda_function.invoke_arn
}

output "auth_lambda_function_name" {
  description = "Name for of the Auth Lambda function."
  value       = aws_lambda_function.auth_lambda_function.function_name
}
