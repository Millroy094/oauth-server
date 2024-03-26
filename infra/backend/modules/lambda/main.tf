locals {
  timestamp_suffix = timestamp()
}

# Use local-exec provisioner to zip TypeScript code and upload
resource "null_resource" "lambda_package_build" {
  triggers = {
    always_run = "${timestamp()}"
  }

  provisioner "local-exec" {
    command = <<EOT
      SOURCE_DIR="${path.module}/../../../../packages/backend"

      (cd $SOURCE_DIR && npm ci && npm run build && npm prune --production)
      (cp "$SOURCE_DIR/package.json" "$SOURCE_DIR/build")
      (cp "$SOURCE_DIR/package-lock.json" "$SOURCE_DIR/build")
      (cd "$SOURCE_DIR/build" && npm ci --production && npm prune --production) 

    EOT
  }

}

data "archive_file" "archive_auth_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../../../../packages/backend/build"
  output_path = "${path.module}/../../../../packages/backend/auth-lambda_${local.timestamp_suffix}.zip"

  depends_on = [null_resource.lambda_package_build]
}


resource "aws_cloudwatch_log_group" "lambda_logs" {
  name = "/aws/lambda/${aws_lambda_function.auth_lambda_function.function_name}"

  retention_in_days = 30
}

resource "aws_iam_role" "auth_lambda_exec" {
  name = "auth_lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "auth_lambda_policy" {
  role       = aws_iam_role.auth_lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}


resource "aws_lambda_function" "auth_lambda_function" {
  function_name = "auth"

  filename         = data.archive_file.archive_auth_lambda.output_path
  source_code_hash = data.archive_file.archive_auth_lambda.output_base64sha256

  runtime = "nodejs20.x"
  handler = "handler.handler"

  memory_size = 1024
  timeout     = 60

  role = aws_iam_role.auth_lambda_exec.arn

  depends_on = [null_resource.lambda_package_build]

  environment {
    variables = {
      keycloak_auth_server_url     = var.keycloak_auth_server_url
      keycloak_realm               = var.keycloak_realm
      keycloak_client_id           = var.keycloak_client_id
      keycloak_client_secret       = var.keycloak_client_secret
      keycloak_admin_client_id     = var.keycloak_admin_client_id
      keycloak_admin_client_secret = var.keycloak_admin_client_secret
    }
  }
}

