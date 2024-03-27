output "react_auth_website_domain" {
  value = aws_s3_bucket.auth_website_bucket.website_domain
}

output "react_auth_website_endpoint" {
  value = aws_s3_bucket.auth_website_bucket.website_endpoint
}
