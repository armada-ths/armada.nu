locals {
  apps = {
    web = {
      name                                              = var.vercel_project_name
      automatically_expose_system_environment_variables = null
      vercel_authentication                             = null
    }
    photos = {
      name                                              = "armada-photos"
      automatically_expose_system_environment_variables = true
      vercel_authentication                             = { deployment_type = "standard_protection_new" }
    }
    order = {
      name                                              = "armada-order"
      automatically_expose_system_environment_variables = true
      vercel_authentication                             = { deployment_type = "standard_protection_new" }
    }
  }
}

resource "vercel_project" "apps" {
  for_each                                          = local.apps
  name                                              = each.value.name
  team_id                                           = var.vercel_team_id
  framework                                         = "nextjs"
  node_version                                      = "24.x"
  root_directory                                    = "apps/${each.key}"
  enable_affected_projects_deployments              = true
  automatically_expose_system_environment_variables = each.value.automatically_expose_system_environment_variables
  vercel_authentication                             = each.value.vercel_authentication

  git_repository = {
    type              = "github"
    repo              = "armada-ths/armada.nu"
    production_branch = "main"
  }
  resource_config = { function_default_regions = ["arn1"] }
  skew_protection = "12 hours"
  # Automation bypass tokens remain managed in Vercel, not this resource.
  # v5 no longer supports inline bypass settings; preserve the existing tokens.
}
