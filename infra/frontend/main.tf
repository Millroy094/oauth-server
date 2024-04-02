resource "random_pet" "auth_website_bucket_name" {
  prefix = "auth-website"
  length = 2
}

resource "aws_s3_bucket" "auth_website_bucket" {
  bucket = random_pet.auth_website_bucket_name.id

  acl = "public-read"
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}
resource "aws_s3_object" "auth_website_code_s3_object" {
  bucket = aws_s3_bucket.auth_website_bucket.id
  key    = "auth-website"
  source = "${path.module}/../../packages/frontend/dist"
}
