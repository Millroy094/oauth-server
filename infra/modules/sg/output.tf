output "oauth_server_alb_sg" {
  value = aws_security_group.oauth_server_alb_sg
}

output "oauth_server_eks_sg" {
  value = aws_security_group.oauth_server_eks_sg
}
