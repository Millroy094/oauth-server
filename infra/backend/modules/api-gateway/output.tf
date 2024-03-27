output "endpoint_url" {
  value = aws_apigatewayv2_stage.auth_api_gw_dev_stage.invoke_url
}
