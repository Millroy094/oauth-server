resource "aws_dynamodb_table" "user_dynamodb_table" {
  name           = "User"
  hash_key       = "userId"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  attribute {
    name = "userId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "client_dynamodb_table" {
  name           = "Client"
  hash_key       = "id"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "client_dynamodb_table" {
  name           = "Client"
  hash_key       = "id"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  attribute {
    name = "id"
    type = "S"
  }
}


resource "aws_dynamodb_table" "oidc_store_dynamodb_table" {
  name           = "OIDCStore"
  hash_key       = "id"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "otp_dynamodb_table" {
  name           = "OTP"
  hash_key       = "id"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  attribute {
    name = "id"
    type = "S"
  }
}
