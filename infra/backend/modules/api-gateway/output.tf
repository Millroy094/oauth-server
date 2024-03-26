output "endpoint_url" {
  value = "${aws_api_gateway_stage.auth_rest_api_gateway_stage.invoke_url}/${var.endpoint_path}"
}
