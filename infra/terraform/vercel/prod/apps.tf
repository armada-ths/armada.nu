locals {
  standalone_apps = {
    photos = "armada-photos"
    order  = "armada-order"
  }
  # Values are configured directly in Vercel before the first deployment.
  standalone_env = {
    photos_corepack           = { app = "photos", key = "ENABLE_EXPERIMENTAL_COREPACK", target = ["production", "preview", "development"], sensitive = false }
    order_corepack            = { app = "order", key = "ENABLE_EXPERIMENTAL_COREPACK", target = ["production", "preview", "development"], sensitive = false }
    photos_api_production     = { app = "photos", key = "NEXT_PUBLIC_API_URL", target = ["production"], sensitive = false }
    photos_api_preview        = { app = "photos", key = "NEXT_PUBLIC_API_URL", target = ["preview", "development"], sensitive = false }
    photos_captcha_production = { app = "photos", key = "NEXT_PUBLIC_RECAPTCHA_SITE_KEY", target = ["production"], sensitive = false }
    photos_captcha_preview    = { app = "photos", key = "NEXT_PUBLIC_RECAPTCHA_SITE_KEY", target = ["preview"], sensitive = false }
    order_api_production      = { app = "order", key = "NEXT_PUBLIC_API_URL", target = ["production"], sensitive = false }
    order_api_preview         = { app = "order", key = "NEXT_PUBLIC_API_URL", target = ["preview", "development"], sensitive = false }
    order_token_production    = { app = "order", key = "EXPO_ACCESS_TOKEN", target = ["production"], sensitive = true }
    order_token_preview       = { app = "order", key = "EXPO_ACCESS_TOKEN", target = ["preview"], sensitive = true }
    order_hook_production     = { app = "order", key = "SLACK_ORDER_HOOK_URL", target = ["production"], sensitive = true }
    order_hook_preview        = { app = "order", key = "SLACK_ORDER_TEST_HOOK_URL", target = ["preview"], sensitive = true }
  }
}

resource "vercel_project" "standalone" {
  for_each                                          = local.standalone_apps
  name                                              = each.value
  team_id                                           = var.vercel_team_id
  framework                                         = "nextjs"
  node_version                                      = "24.x"
  root_directory                                    = "apps/${each.key}"
  enable_affected_projects_deployments              = true
  automatically_expose_system_environment_variables = true
  git_repository = {
    type              = "github"
    repo              = "armada-ths/armada.nu"
    production_branch = "main"
  }
  resource_config                  = { function_default_regions = ["arn1"] }
  vercel_authentication            = { deployment_type = "standard_protection_new" }
  skew_protection                  = "12 hours"
  protection_bypass_for_automation = true
}

resource "vercel_project_environment_variable" "standalone" {
  for_each   = local.standalone_env
  project_id = vercel_project.standalone[each.value.app].id
  team_id    = var.vercel_team_id
  key        = each.value.key
  value      = ""
  target     = each.value.target
  sensitive  = each.value.sensitive
  lifecycle { ignore_changes = [value] }
}

output "standalone_project_ids" {
  value = { for app, project in vercel_project.standalone : app => project.id }
}
