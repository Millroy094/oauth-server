output "oauth_server_vpc" {
  value = aws_vpc.oauth_server_vpc
}

output "oauth_server_alb_subnet" {
  value = aws_subnet.oauth_server_alb_subnet
}

output "oauth_server_eks_subnet" {
  value = aws_subnet.oauth_server_eks_subnet
}
