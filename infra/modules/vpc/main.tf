resource "aws_vpc" "oauth_server_vpc" {

  cidr_block       = var.vpc_cidr_block
  enable_dns_support = true
  enable_dns_hostnames = true

  tags = {
    Name = "OAuth Server VPC"
    "kubernetes.io/cluster/${var.app_name}-cluster" = "shared"
  }
}

# Create the private subnet
resource "aws_subnet" "oauth_server_private_subnet" {
  count = length(var.availability_zones)
  vpc_id            = aws_vpc.oauth_server_vpc.id
  cidr_block = element(var.private_subnet_cidr_blocks, count.index)
  availability_zone = element(var.availability_zones, count.index)

  tags = {
    Name = "OAuth Server Private Subnet"
    "kubernetes.io/cluster/${var.app_name}-cluster" = "shared"
    "kubernetes.io/role/internal-elb" = 1
  }
}

# Create the public subnet
resource "aws_subnet" "oauth_server_public_subnet" {
  count = length(var.availability_zones)
  vpc_id            = "${aws_vpc.oauth_server_vpc.id}"
  cidr_block = element(var.public_subnet_cidr_blocks, count.index)
  availability_zone = element(var.availability_zones, count.index)

  tags = {
    Name = "OAuth Server Private Subnet"
    "kubernetes.io/cluster/${var.app_name}-cluster" = "shared"
    "kubernetes.io/role/elb" = 1
  }

  map_public_ip_on_launch = true
}

resource "aws_internet_gateway" "oauth_server_igw" {
  vpc_id = "${aws_vpc.oauth_server_vpc.id}"

  tags = {
    Name = "OAuth Server Internet Gateway"
  }
}
resource "aws_route_table" "oauth_server_route_table" {
  vpc_id = "${aws_vpc.oauth_server_vpc.id}"

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = "${aws_internet_gateway.oauth_server_igw.id}"
  }

  tags = {
    Name = "OAuth Server Routing Table"
  }
}

resource "aws_route_table_association" "oauth_server_subnet_internet_access" {
  count = length(var.availability_zones)
  subnet_id      = "${aws_subnet.oauth_server_public_subnet[count.index].id}"
  route_table_id = "${aws_route_table.oauth_server_route_table.id}"
}

# Create Elastic IP
resource "aws_eip" "oauth_server_eip" {
  domain = "vpc"
}

resource "aws_nat_gateway" "oauth_server_nat_gateway" {
  allocation_id = aws_eip.oauth_server_eip.id
  subnet_id     = aws_subnet.oauth_server_public_subnet[0].id

  tags = {
    Name = "NAT Gateway for OAuth Server Kubernetes Cluster"
  }
}

resource "aws_route" "oauth_server_route" {
  route_table_id            = aws_vpc.oauth_server_vpc.default_route_table_id
  destination_cidr_block    = "0.0.0.0/0"
  nat_gateway_id = aws_nat_gateway.oauth_server_nat_gateway.id
}

# Security group for public subnet resources
resource "aws_security_group" "public_sg" {
  name   = "public-sg"
  vpc_id = aws_vpc.custom_vpc.id

  tags = {
    Name = "public-sg"
  }
}

# Security group traffic rules
## Ingress rule
resource "aws_security_group_rule" "sg_ingress_public_443" {
  security_group_id = aws_security_group.public_sg.id
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "sg_ingress_public_80" {
  security_group_id = aws_security_group.public_sg.id
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

## Egress rule
resource "aws_security_group_rule" "sg_egress_public" {
  security_group_id = aws_security_group.public_sg.id
  type              = "egress"
  from_port   = 0
  to_port     = 0
  protocol    = "-1"
  cidr_blocks = ["0.0.0.0/0"]
}

# Security group for data plane
resource "aws_security_group" "data_plane_sg" {
  name   = "k8s-data-plane-sg"
  vpc_id = aws_vpc.custom_vpc.id

  tags = {
    Name = "k8s-data-plane-sg"
  }
}

resource "aws_security_group_rule" "oauth_server_nodes" {
  description              = "Allow nodes to communicate with each other"
  security_group_id = aws_security_group.oauth_server_data_plane_sg.id
  type              = "ingress"
  from_port   = 0
  to_port     = 65535
  protocol    = "-1"
  cidr_blocks = flatten([var.private_subnet_cidr_blocks, var.public_subnet_cidr_blocks])
}

resource "aws_security_group_rule" "oauth_server_nodes_inbound" {
  description              = "Allow worker Kubelets and pods to receive communication from the cluster control plane"
  security_group_id = aws_security_group.oauth_server_data_plane_sg.id
  type              = "ingress"
  from_port   = 1025
  to_port     = 65535
  protocol    = "tcp"
  cidr_blocks = flatten([var.private_subnet_cidr_blocks])
}

## Egress rule
resource "aws_security_group_rule" "oauth_server_node_outbound" {
  security_group_id = aws_security_group.oauth_server_data_plane_sg.id
  type              = "egress"
  from_port   = 0
  to_port     = 0
  protocol    = "-1"
  cidr_blocks = ["0.0.0.0/0"]
}

# Security group for control plane
resource "aws_security_group" "oauth_server_control_plane_sg" {
  name   = "oauth-server-k8s-control-plane-sg"
  vpc_id = aws_vpc.oauth_server_vpc.id

  tags = {
    Name = "oauth-server-k8s-control-plane-sg"
  }
}

# Security group traffic rules
## Ingress rule
resource "aws_security_group_rule" "oauth_server_control_plane_inbound" {
  security_group_id = aws_security_group.oauth_server_control_plane_sg.id
  type              = "ingress"
  from_port   = 0
  to_port     = 65535
  protocol          = "tcp"
  cidr_blocks = flatten([var.private_subnet_cidr_blocks, var.public_subnet_cidr_blocks])
}

## Egress rule
resource "aws_security_group_rule" "oauth_server_control_plane_outbound" {
  security_group_id = aws_security_group.oauth_server_control_plane_sg.id
  type              = "egress"
  from_port   = 0
  to_port     = 65535
  protocol    = "-1"
  cidr_blocks = ["0.0.0.0/0"]
}