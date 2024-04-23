

output "react_auth_website_endpoint" {
  value = aws_cloudfront_distribution.auth_distribution.domain_name
}
output "auth_website_s3_bucket_name" {
  value = aws_s3_bucket.auth_website_bucket.bucket
}
