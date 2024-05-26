resource "aws_cloudfront_origin_access_identity" "auth_oai" {
  comment = "auth-website OAI"
}

resource "aws_cloudfront_distribution" "auth_distribution" {
  origin {
    domain_name = var.auth_bucket_regional_domain_name
    origin_id   = "auth-origin"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.auth_oai.cloudfront_access_identity_path
    }
  }

  enabled         = true
  is_ipv6_enabled = true

  default_root_object = "index.html"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  default_cache_behavior {

    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "auth-origin"

    default_ttl = 3600
    min_ttl     = 0
    max_ttl     = 86400
    compress    = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"

  }

  ordered_cache_behavior {
    path_pattern     = "./index.html"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "auth-origin"

    default_ttl = 3600
    min_ttl     = 0
    max_ttl     = 86400
    compress    = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }

      headers = ["Origin", "Authorization"]
    }

    viewer_protocol_policy = "redirect-to-https"
  }


}
