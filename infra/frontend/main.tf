resource "random_pet" "auth_website_bucket_name" {
  prefix = "auth-website"
  length = 2
}

resource "aws_s3_bucket" "auth_website_bucket" {
  bucket        = random_pet.auth_website_bucket_name.id
  force_destroy = true
}
resource "aws_s3_object" "auth_website_code_s3_object_index" {
  bucket = aws_s3_bucket.auth_website_bucket.id
  key    = "auth-website-index"
  source = "${path.module}/../../packages/frontend/index.html"
}

resource "aws_s3_object" "auth_website_code_s3_object_logo" {
  bucket = aws_s3_bucket.auth_website_bucket.id
  key    = "auth-website-logo"
  source = "${path.module}/../../packages/frontend/mtech.svg"
}
resource "aws_s3_object" "auth_website_code_s3_object_assets" {
  bucket = aws_s3_bucket.auth_website_bucket.id
  key    = "auth-website-assets"
  source = "${path.module}/../../packages/frontend/assets"
}

resource "aws_s3_bucket_acl" "auth_website_bucket_acl" {
  bucket = aws_s3_bucket.auth_website_bucket.id
  acl    = "public-read"
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
