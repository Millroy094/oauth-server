output "vpc_id" {
  value = module.vpc.default_vpc_id
}

output "private_subnet_ids" {
  value = module.vpc.private_subnets
}
