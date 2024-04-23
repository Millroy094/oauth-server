locals {
  timestamp_suffix = timestamp()
}
resource "null_resource" "auth_website_package_build" {

  triggers = {
    always_run = local.timestamp_suffix
  }
  provisioner "local-exec" {
    command = <<EOT
      ROOT_DIR="../"
      FRONTEND_DIR="$ROOT_DIR/packages/frontend"

      (cd $FRONTEND_DIR && echo "VITE_AUTH_API_ENDPOINT=${var.auth_lambda_url}" >> .env.production )

      (cd $ROOT_DIR && pnpm --filter @auth/frontend install && pnpm --filter @auth/frontend run build)

      aws s3 sync "$FRONTEND_DIR/dist" s3://${var.auth_website_s3_bucket_name} --delete --exact-timestamps

    EOT
  }

}
