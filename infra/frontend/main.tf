locals {
  timestamp_suffix = timestamp()
}

resource "null_resource" "website_package_build" {
  triggers = {
    always_run = "${timestamp()}"
  }

  provisioner "local-exec" {
    command = <<EOT
      SOURCE_DIR="${path.module}/../../packages/frontend"
      cd $SOURCE_DIR && echo "REACT_APP_API_ENDPOINT=${var.auth_lambda_url}" >> .env && npm i && npm run build
    EOT
  }

}

data "archive_file" "archive_auth_website" {
  type        = "zip"
  source_dir  = "${path.module}/../../packages/frontend/dist"
  output_path = "${path.module}/../../packages/frontend/auth-react_${local.timestamp_suffix}.zip"

  depends_on = [null_resource.website_package_build]
}

resource "random_pet" "auth_website_bucket_name" {
  prefix = "auth-website"
  length = 2
}

resource "aws_s3_bucket" "auth_website_bucket" {
  bucket        = random_pet.auth_website_bucket_name.id
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
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Action": [
                    "s3:GetObject",
                    "s3:PutBucketPolicy"
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

# resource "aws_s3_bucket_acl" "auth_website_bucket_acl" {
#   bucket = aws_s3_bucket.auth_website_bucket.id
#   acl    = "public-read"
# }


resource "aws_s3_bucket_public_access_block" "lambda_bucket" {
  bucket = aws_s3_bucket.auth_website_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
