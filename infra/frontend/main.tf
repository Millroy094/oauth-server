module "website" {
  source          = "./website"
  auth_lambda_url = var.auth_lambda_url
  depends_on      = [var.backend]
}

module "cloudfront" {
  source              = "./cloudfront"
  auth_website_bucket = module.website.auth_website_bucket
}
