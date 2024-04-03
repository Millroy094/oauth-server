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
  bucket     = aws_s3_bucket.auth_website_bucket.id
  acl        = "public-read"
  depends_on = [aws_s3_bucket_public_access_block.auth_website_bucket_public_access_block, aws_s3_bucket_ownership_controls.auth_website_ownership_controls]
}

resource "aws_cloudfront_distribution" "auth_distribution" {
  origin {
    domain_name = aws_s3_bucket.auth_website_bucket.website_domain
    origin_id   = "S3Origin"

    s3_origin_config {
      origin_access_identity = "" # Leave this empty if you don't want to use an OAI
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "CA", "GB"]
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  default_cache_behavior {

    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "auth-origin"
    viewer_protocol_policy = "redirect-to-https"

    # Cache settings
    default_ttl = 3600
    min_ttl     = 0
    max_ttl     = 86400
  }

  enabled             = true
  default_root_object = "index.html"
}
