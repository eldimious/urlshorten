################################################################################
# General AWS Configuration
################################################################################
variable "aws_profile" {
  description = "The AWS profile name"
  default     = "default"
}

variable "aws_region" {
  description = "The AWS region things are created in"
  default     = "eu-west-2"
}

################################################################################
# Network Configuration
################################################################################
variable "vpc_name" {
  description = "The name of the VPC. Other names will result from this."
  default     = "urlshorten-vpc"
}

variable "create_vpc" {
  description = "Flag to define if we have to create vpc"
  type        = bool
  default     = true
}

variable "create_igw" {
  description = "Flag to define if we have to create IG"
  type        = bool
  default     = true
}

variable "single_nat_gateway" {
  description = "Flag to define if we need only one NAT GW"
  type        = bool
  default     = false
}

variable "enable_nat_gateway" {
  description = "Flag to define enable NAT GW"
  type        = bool
  default     = true
}

variable "cidr_block" {
  description = "Network IP range"
  default     = "192.168.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones you want. Example: eu-west-2a and eu-west-2b"
  default     = ["eu-west-2a", "eu-west-2b"]
}

variable "public_subnet_cidrs" {
  description = "List of public cidrs, for every availability zone you want you need one. Example: 10.0.0.0/24 and 10.0.1.0/24"
  default     = ["192.168.0.0/19", "192.168.32.0/19"]
}

variable "private_subnet_cidrs" {
  description = "List of private cidrs, for every availability zone you want you need one. Example: 10.0.0.0/24 and 10.0.1.0/24"
  default     = ["192.168.128.0/19", "192.168.160.0/19"]
}

variable "enable_dns_support" {
  description = "DNS support"
  default     = true
}

variable "enable_dns_hostnames" {
  description = "DNS hostnames"
  default     = true
}

################################################################################
# ALB
################################################################################
variable "create_alb" {
  description = "Flag to define if we have to create ALB"
  type        = bool
  default     = true
}

################################################################################
# Project metadata
################################################################################
variable "project" {
  description = "Project name"
  default     = "urlshorten_ecs"
}

variable "environment" {
  description = "Indicate the environment"
  default     = "dev"
}

################################################################################
# ECS Configuration
################################################################################
variable "ecs_task_execution_role_name" {
  description = "ECS task execution role name"
  default     = "ecsTaskExecutionRole"
}

variable "az_count" {
  description = "Number of AZs to cover in a given region"
  default     = "2"
}

variable "fargate_cpu" {
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units)"
  default     = "512"
}

variable "fargate_memory" {
  description = "Fargate instance memory to provision (in MiB)"
  default     = "1024"
}

variable "health_check_grace_period_seconds" {
  description = ""
  default     = 180
}

variable "network_mode" {
  description = "Set network mode of esc tasks"
  default     = "awsvpc"
}

################################################################################
# API urlshorten Service Configuration
################################################################################
variable "urlshorten_api_tg" {
  description = "Defines service tg"
  default     = "urlshorten-api-tg"
}

variable "urlshorten_api_tg_paths" {
  default = ["/shorten", "/shorten/*"]
}

variable "urlshorten_api_name" {
  description = "Defines service name"
  default     = "urlshorten_api"
}

variable "urlshorten_api_image" {
  description = "Defines service image"
  default     = "eldimious/urlshorten:latest"
}

variable "urlshorten_api_aws_logs_group" {
  description = "Defines logs group"
  default     = "/ecs/urlshorten_api"
}

variable "urlshorten_api_task_family" {
  description = "Defines logs group"
  default     = "urlshorten_api_task"
}

variable "urlshorten_api_port" {
  description = "Port exposed by the urlshorten image"
  default     = 3000
}

variable "urlshorten_api_desired_count" {
  description = "Number of urlshorten docker containers to run"
  default     = 1
}

variable "urlshorten_api_max_count" {
  description = "Max number of urlshorten docker containers to run"
  default     = 4
}

variable "urlshorten_api_health_check_path" {
  default = "/shorten/health-check"
}

variable "urlshorten_api_network_mode" {
  default = "awsvpc"
}

variable "urlshorten_api_task_compatibilities" {
  default = ["FARGATE"]
}

variable "urlshorten_api_launch_type" {
  default = "FARGATE"
}

################################################################################
# ALB Configuration
################################################################################
variable "internal_elb" {
  description = "Make ALB private? (Compute nodes are always private under ALB)"
  default     = false
}

################################################################################
# Discovery Service Configuration
################################################################################
variable "discovery_ttl" {
  description = "Time to live"
  default     = 10
}

variable "discovery_routing_policy" {
  description = "Defines routing policy"
  default     = "MULTIVALUE"
}

################################################################################
# Database Configuration
################################################################################
# urlshorten DB
variable "urlshorten_database_username" {
  description = "The username for the urlshorten DB master"
  type        = string
  sensitive   = true
}

variable "urlshorten_database_password" {
  description = "The password for the urlshorten DB master"
  type        = string
  sensitive   = true
}

variable "urlshorten_database_identifier" {
  description = "urlshorten DB name"
  type        = string
}

variable "urlshorten_monitoring_role_name" {
  description = "urlshorten monitoring role name"
  type        = string
  default     = "UrlshortenDatabaseMonitoringRole"
}