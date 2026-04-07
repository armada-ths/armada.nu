terraform {
  required_version = ">= 1.7.0"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 4.0"
    }
  }
}

provider "vercel" {
  # api_token is read from VERCEL_API_TOKEN environment variable.
  # Set it as a sensitive environment variable in the HCP Terraform workspace.
  team = var.vercel_team_id
}
