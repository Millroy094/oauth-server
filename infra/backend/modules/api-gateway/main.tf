resource "aws_api_gateway_rest_api" "auth_rest_api" {
  name = "auth-api"
}

resource "aws_api_gateway_resource" "auth_rest_api_resource" {
  rest_api_id = aws_api_gateway_rest_api.auth_rest_api.id
  parent_id   = aws_api_gateway_rest_api.auth_rest_api.root_resource_id
  path_part   = var.endpoint_path
}

resource "aws_api_gateway_method" "auth_rest_api_method" {
  rest_api_id   = aws_api_gateway_rest_api.auth_rest_api.id
  resource_id   = aws_api_gateway_resource.auth_rest_api_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "auth_rest_api_integration" {
  rest_api_id             = aws_api_gateway_rest_api.auth_rest_api.id
  resource_id             = aws_api_gateway_resource.auth_rest_api_resource.id
  http_method             = aws_api_gateway_method.auth_rest_api_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.auth_lambda_invoke_arn
}

resource "aws_lambda_permission" "apigw_lambda_permission" {
  statement_id  = "AllowExcecumentFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.auth_lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:${aws_api_gateway_rest_api.auth_rest_api.id}/*/${aws_api_gateway_method.auth_rest_api_method.http_method}${aws_api_gateway_resource.auth_rest_api_resource.path}"
}

resource "aws_api_gateway_deployment" "auth_api_gateway_deployment" {
  rest_api_id = aws_api_gateway_rest_api.auth_rest_api.id
  # triggers = {
  #   redeployment = sha1(jsondecode((aws_api_gateway_rest_api.auth_rest_api.body)))
  # }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [aws_api_gateway_method.auth_rest_api_method, aws_api_gateway_integration.auth_rest_api_integration]
}

resource "aws_api_gateway_stage" "auth_rest_api_gateway_stage" {
  deployment_id = aws_api_gateway_deployment.auth_api_gateway_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.auth_rest_api.id
  stage_name    = "dev"
}
