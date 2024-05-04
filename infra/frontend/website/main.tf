
resource "random_pet" "auth_website_bucket_name" {
  prefix = "auth-website"
  length = 2
}

resource "aws_s3_bucket" "auth_website_bucket" {
  bucket        = random_pet.auth_website_bucket_name.id
  force_destroy = true
}

resource "aws_s3_bucket_website_configuration" "auth_website_code_s3_configuration" {
  bucket = aws_s3_bucket.auth_website_bucket.id
  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_policy" "auth_website_bucket_policy" {

  depends_on = [aws_s3_bucket_acl.auth_website_bucket_acl]

  bucket = aws_s3_bucket.auth_website_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "PublicReadGetObject"
      Effect    = "Allow"
      Principal = "*"
      Action    = "s3:GetObject",
      Resource  = "${aws_s3_bucket.auth_website_bucket.arn}/*",
    }]
  })
}

resource "aws_s3_bucket_public_access_block" "auth_website_bucket_public_access_block" {
  bucket                  = aws_s3_bucket.auth_website_bucket.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_ownership_controls" "auth_website_ownership_controls" {
  bucket = aws_s3_bucket.auth_website_bucket.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "auth_website_bucket_acl" {

  depends_on = [aws_s3_bucket_ownership_controls.auth_website_ownership_controls, aws_s3_bucket_public_access_block.auth_website_bucket_public_access_block]

  bucket = aws_s3_bucket.auth_website_bucket.id
  acl    = "public-read"
}

locals {
  timestamp_suffix = timestamp()
}
resource "null_resource" "auth_website_package_build" {

  depends_on = [ aws_s3_bucket.auth_website_bucket ]

  triggers = {
    always_run = local.timestamp_suffix
  }
  provisioner "local-exec" {
    command = <<EOT
      ROOT_DIR="../"
      FRONTEND_DIR="$ROOT_DIR/packages/frontend"

      (cd $FRONTEND_DIR && echo "VITE_AUTH_API_ENDPOINT=${var.auth_lambda_url}" >> .env.production )

      (cd $ROOT_DIR && pnpm --filter @auth/frontend install && pnpm --filter @auth/frontend run build)

      aws s3 sync "$FRONTEND_DIR/dist" s3://${aws_s3_bucket.auth_website_bucket.bucket} --delete --exact-timestamps

    EOT
  }

}
