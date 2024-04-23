module "cloudfront" {
  source = "./cloudfront"
}

module "website" {
  source                      = "./website"
  auth_lambda_url             = var.auth_lambda_url
  auth_website_s3_bucket_name = module.cloudfront.auth_website_s3_bucket_name
  depends_on                  = [module.cloudfront, var.backend]
}
