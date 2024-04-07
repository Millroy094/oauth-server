locals {
  timestamp_suffix = timestamp()
}

resource "null_resource" "auth_lambda_package_build" {
  triggers = {
    always_run = local.timestamp_suffix
  }
  provisioner "local-exec" {
    command = <<EOT
      SOURCE_DIR="${path.root}"
      BACKEND_SOURCE_DIR="$SOURCE_DIR/packages/backend"

      cd $SOURCE_DIR 
      pnpm --filter $BACKEND_SOURCE_DIR install
      pnpm --filter $BACKEND_SOURCE_DIR run build

      cp "$BACKEND_SOURCE_DIR/package.json" "$BACKEND_SOURCE_DIR/build"
      cp "$BACKEND_SOURCE_DIR/package-lock.json" "$BACKEND_SOURCE_DIR/build"

      cd "$BACKEND_SOURCE_DIR/build"
      npm ci --production

    EOT
  }

}

data "archive_file" "archive_auth_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../../../../packages/backend/build"
  output_path = "${path.module}/../../../../packages/backend/auth-lambda_${local.timestamp_suffix}.zip"
}

resource "random_pet" "lambda_bucket_name" {
  prefix = "lambda"
  length = 2
}

resource "aws_s3_bucket" "lambda_bucket" {
  bucket        = random_pet.lambda_bucket_name.id
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "lambda_bucket" {
  bucket = aws_s3_bucket.lambda_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_object" "auth_lambda_code_s3_object" {
  bucket = aws_s3_bucket.lambda_bucket.id
  key    = "auth-lambda.zip"
  source = data.archive_file.archive_auth_lambda.output_path
  etag   = filemd5(data.archive_file.archive_auth_lambda.output_path)
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

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.auth_lambda_code_s3_object.key

  source_code_hash = data.archive_file.archive_auth_lambda.output_base64sha256

  runtime = "nodejs20.x"
  handler = "handler.handler"

  memory_size = 1024
  timeout     = 60

  role = aws_iam_role.auth_lambda_exec.arn
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

