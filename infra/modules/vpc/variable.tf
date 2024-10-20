variable "availability_zones" {
  type        = list(string)
  description = "The AWS availability zones for regions"
  default     = ["eu-west-2a", "eu-west-2b",  "eu-west-2c"]
}
