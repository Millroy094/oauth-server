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
  key    = "index.html"
  source = "${path.module}/../../packages/frontend/dist/index.html"
}

resource "aws_s3_object" "auth_website_code_s3_object_logo" {
  bucket = aws_s3_bucket.auth_website_bucket.id
  key    = "mtech.svg"
  source = "${path.module}/../../packages/frontend/dist/mtech.svg"
}
resource "aws_s3_object" "auth_website_code_s3_object_asset" {
  bucket = aws_s3_bucket.auth_website_bucket.id

  for_each = fileset("${path.module}/../../packages/frontend/dist/assets/", "**/*.*")
  key      = "assets/${each.value}"
  source   = "${path.module}/../../packages/frontend/dist/assets/${each.value}"
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

resource "aws_s3_bucket_policy" "auth_website_bucket_policy" {
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

resource "aws_s3_bucket_policy" "auth_website_bucket_policyv2" {
  bucket = aws_s3_bucket.auth_website_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "s3Permission"
      Effect    = "Allow"
      Principal = "*"
      Action    = "s3:*",
      Resource  = "${aws_s3_bucket.auth_website_bucket.arn}",
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

resource "aws_s3_bucket_ownership_controls" "mybucket" {
  bucket = aws_s3_bucket.auth_website_bucket.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}