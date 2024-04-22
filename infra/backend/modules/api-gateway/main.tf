resource "aws_apigatewayv2_api" "auth_api_gw" {
  name          = "auth-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["POST"]
    allow_headers = ["*"]
    max_age = 300
  }
}

resource "aws_cloudwatch_log_group" "auth_api_gw_log_group" {
  name = "/aws/api-gw/${aws_apigatewayv2_api.auth_api_gw.name}"

  retention_in_days = 30
}

resource "aws_apigatewayv2_stage" "auth_api_gw_dev_stage" {
  api_id = aws_apigatewayv2_api.auth_api_gw.id

  name        = "dev"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.auth_api_gw_log_group.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}

resource "aws_apigatewayv2_integration" "auth_api_gw_handler" {
  api_id = aws_apigatewayv2_api.auth_api_gw.id

  integration_type = "AWS_PROXY"
  integration_uri  = var.auth_lambda_invoke_arn
}

resource "aws_apigatewayv2_route" "auth_login_route" {
  api_id    = aws_apigatewayv2_api.auth_api_gw.id
  route_key = "POST /login"

  target = "integrations/${aws_apigatewayv2_integration.auth_api_gw_handler.id}"
}

resource "aws_apigatewayv2_route" "auth_register_route" {
  api_id    = aws_apigatewayv2_api.auth_api_gw.id
  route_key = "POST /register"

  target = "integrations/${aws_apigatewayv2_integration.auth_api_gw_handler.id}"
}

resource "aws_lambda_permission" "auth_api_gw_lambda_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.auth_lambda_function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.auth_api_gw.execution_arn}/*/*"
}
