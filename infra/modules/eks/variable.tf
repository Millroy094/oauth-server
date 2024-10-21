variable "vpc_id" {
  type = string
}

variable "tags" {
   type = "map" 
    default = { 
        app: "oauth-server",
  } 
}

variable "private_subnet_ids" {
}

variable "dynamodb_table_arns" {
  type = list(string)
}
