output "vpc_id" {
  value = aws_vpc.oauth_server_vpc.id
}

output "public_subnets" {
  value = aws_subnet.oauth_server_public_subnet
}

output "private_subnets" {
  value = aws_subnet.oauth_server_private_subnet
}
