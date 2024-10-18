resource "aws_vpc" "oauth_server_vpc" {
  enable_dns_support               = true
  enable_dns_hostnames             = true
  assign_generated_ipv6_cidr_block = true

  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "OAuth Server VPC"
  }
}

resource "aws_internet_gateway" "oauth_server_gateway" {
  vpc_id = aws_vpc.oauth_server_vpc.id

  tags = {
    Name = "OAuth server internet gateway"
  }
}

resource "aws_route_table" "public_oauth_server_routing" {
  vpc_id = aws_vpc.oauth_server_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.oauth_server_gateway.id
  }

  tags = {
    Name = "Public OAuth Server Net rules"
  }
}

resource "aws_subnet" "oauth_server_alb_subnet" {
  count                           = 2
  vpc_id                          = aws_vpc.oauth_server_vpc.id
  availability_zone               = var.availability_zones[count.index]
  cidr_block                      = cidrsubnet(aws_vpc.oauth_server_vpc.cidr_block, 4, count.index)
  ipv6_cidr_block                 = cidrsubnet(aws_vpc.oauth_server_vpc.ipv6_cidr_block, 8, count.index)
  map_public_ip_on_launch         = true
  assign_ipv6_address_on_creation = true

  tags = {
    Name = "OAuth Server load balancer Subnet ${count.index}"
  }
}

resource "aws_subnet" "oauth_server_eks_subnet" {
  count                           = 2
  vpc_id                          = aws_vpc.oauth_server_vpc.id
  availability_zone               = var.availability_zones[count.index]
  cidr_block                      = cidrsubnet(aws_vpc.oauth_server_vpc.cidr_block, 4, 4 + count.index)
  ipv6_cidr_block                 = cidrsubnet(aws_vpc.oauth_server_vpc.ipv6_cidr_block, 8, 4 + count.index)
  map_public_ip_on_launch         = true
  assign_ipv6_address_on_creation = true

  tags = {
    Name = "OAuth Server EKS Subnet"
  }
}

resource "aws_route_table_association" "oauth_server_alb_subnet_association" {
  count          = 2
  subnet_id      = element(aws_subnet.oauth_server_alb_subnet.*.id, count.index)
  route_table_id = aws_route_table.public_oauth_server_routing.id
}


resource "aws_route_table_association" "oauth_server_eks_subnet_association" {
  count          = 2
  subnet_id      = element(aws_subnet.oauth_server_eks_subnet.*.id, count.index)
  route_table_id = aws_route_table.public_oauth_server_routing.id
}
