

output "react_auth_website_endpoint" {
  value = aws_cloudfront_distribution.auth_distribution.domain_name
}

