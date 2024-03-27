locals {
  timestamp_suffix = timestamp()
}

resource "null_resource" "website_package_build" {
  triggers = {
    always_run = "${timestamp()}"
  }

  provisioner "local-exec" {
    command = <<EOT
      SOURCE_DIR="${path.module}/../../../../packages/frontend"

      (cd $SOURCE_DIR && npm ci && npm run build && npm prune --production)
      (cp "$SOURCE_DIR/package.json" "$SOURCE_DIR/build")
      (cp "$SOURCE_DIR/package-lock.json" "$SOURCE_DIR/build")
      (cd "$SOURCE_DIR/build" && npm ci --production && npm prune --production)
      (cd "$SOURCE_DIR/build" && echo "REACT_APP_API_ENDPOINT=${var.auth_lambda_url}" >> .env)

    EOT
  }

}

data "archive_file" "archive_auth_website" {
  type        = "zip"
  source_dir  = "${path.module}/../../../../packages/frontend/build"
  output_path = "${path.module}/../../../../packages/frontend/auth-react_${local.timestamp_suffix}.zip"

  depends_on = [null_resource.website_package_build]
}

resource "random_pet" "auth_website_bucket_name" {
  prefix = "auth-website"
  length = 2
}

resource "aws_s3_bucket" "auth_website_bucket" {
  bucket        = random_pet.react_auth_bucket_name.id
  force_destroy = true
}


resource "aws_s3_object" "auth_website_code_s3_object" {
  bucket = aws_s3_bucket.auth_website_bucket.id
  key    = "auth-website.zip"
  source = data.archive_file.archive_auth_website.output_path
  etag   = filemd5(data.archive_file.archive_auth_website.output_path)
}

resource "aws_s3_bucket_policy" "auth_website_bucket_policy" {
  bucket = aws_s3_bucket.auth_website_bucket.id
  policy = <<EOF
  {
        "id": "react_auth_bucket_policy",
        "Version": "2024-03-27",
        "Statement": [
            {
                "$id": "react_auth_bucket_policy",
                "Action": [
                    "s3:getObject"
                ],
                "Effect": "Allow",
                "Resource": "arn:aws:s3:::${random_pet.auth_website_bucket_name.id}/*",
                "Principal": "*"
            }
        ]
  }
  EOF
}

resource "aws_s3_bucket_website_configuration" "auth_website_configuration" {
  bucket = aws_s3_bucket.auth_website_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }

}

resource "aws_s3_bucket_acl" "auth_website_bucket_acl" {
  bucket = aws_s3_bucket.auth_website_bucket.id
  acl    = "public-read"

}
