locals {
  timestamp_suffix = timestamp()
}
data "archive_file" "archive_auth_website" {
  type        = "zip"
  source_dir  = "${path.module}/../../packages/frontend/dist"
  output_path = "${path.module}/../../packages/frontend/auth-react_${local.timestamp_suffix}.zip"
}

resource "random_pet" "auth_website_bucket_name" {
  prefix = "auth-website"
  length = 2
}

resource "aws_s3_bucket" "auth_website_bucket" {
  bucket        = random_pet.auth_website_bucket_name.id
  force_destroy = true

  acl = "public-read"
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

# resource "aws_s3_object" "auth_website_code_s3_object" {
#   bucket = aws_s3_bucket.auth_website_bucket.id
#   key    = "auth-website.zip"
#   source = data.archive_file.archive_auth_website.output_path
#   etag   = filemd5(data.archive_file.archive_auth_website.output_path)
# }
