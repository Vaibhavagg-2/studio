variable "gcp_project" {
  description = "GCP Project ID"
  type        = string
}

variable "gcp_region" {
  description = "GCP region to deploy resources"
  type        = string
  default     = "us-central1"
}

# You might need a zone as well depending on the resources
# variable "gcp_zone" {
#   description = "GCP zone to deploy resources"
#   type        = string
#   default     = "us-central1-c"
# }

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
}

variable "project_name" {
  description = "Name of the project"
  type        = string
}

# Add more variables as needed for your specific infrastructure 