resource "vercel_project" "armada_nu" {
  name    = var.vercel_project_name
  team_id = var.vercel_team_id

  framework    = "nextjs"
  node_version = "22.x"

  git_repository = {
    type              = "github"
    repo              = "armada-ths/armada.nu"
    production_branch = "main"
  }

  resource_config = {
    function_default_regions = ["arn1"] # eu-north-1 (Stockholm)
  }

  skew_protection = "12 hours"
}
