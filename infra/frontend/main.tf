module "website" {
  source                      = "./website"
  auth_lambda_url             = var.auth_lambda_url
  depends_on                  = [var.backend]
}

module "cloudfront" {
  source = "./cloudfront"
  auth_bucket_regional_domain_name = module.website.auth_bucket_regional_domain_name
    depends_on                  = [module.website]

}