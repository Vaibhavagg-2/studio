terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0" # You might want to check for the latest stable version
    }
  }
  required_version = ">= 1.2.0"
}

provider "google" {
  project = var.gcp_project
  region  = var.gcp_region
  # You might need zone as well depending on the resources
  # zone    = var.gcp_zone
}

# Example resource (you can modify based on your needs)
resource "google_storage_bucket" "frontend_assets" {
  name          = "${var.project_name}-assets-${var.environment}"
  location      = var.gcp_region # Or a specific multi-region like "US"
  force_destroy = false # Set to true to allow deleting non-empty buckets during destroy

  # Uniform bucket-level access is recommended
  uniform_bucket_level_access = true

  tags = {
    environment = var.environment
    project     = var.project_name
    managed_by  = "terraform"
  }
} 