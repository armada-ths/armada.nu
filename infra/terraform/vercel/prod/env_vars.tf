# Each resource tracks one Vercel environment variable.
# Import blocks bring existing variables under Terraform management.
# Import ID format: {team_id}/{project_id}/{env_var_id}
#
# Values are intentionally NOT managed by Terraform. They are set and rotated
# directly in the Vercel dashboard (or via the Vercel CLI). The `value = ""`
# placeholder satisfies the provider schema, and `lifecycle { ignore_changes =
# [value] }` ensures Terraform never overwrites a value set in Vercel.
#
# Terraform DOES enforce: key name, target environments, branch scope, and
# sensitive flag.
# Any drift on those attributes will appear in `terraform plan`.

locals {
  app_env = {
    web_next_public_api_url_staging_branch                        = { app = "web", key = "NEXT_PUBLIC_API_URL", target = ["preview"], sensitive = false, git_branch = "staging" }
    web_next_public_api_url_production                            = { app = "web", key = "NEXT_PUBLIC_API_URL", target = ["production"], sensitive = false }
    web_next_public_api_url_preview_development                   = { app = "web", key = "NEXT_PUBLIC_API_URL", target = ["preview", "development"], sensitive = false }
    web_next_public_recaptcha_site_key_production                 = { app = "web", key = "NEXT_PUBLIC_RECAPTCHA_SITE_KEY", target = ["production"], sensitive = false }
    web_next_public_recaptcha_site_key_preview                    = { app = "web", key = "NEXT_PUBLIC_RECAPTCHA_SITE_KEY", target = ["preview"], sensitive = false }
    web_expo_access_token                                         = { app = "web", key = "EXPO_ACCESS_TOKEN", target = ["production", "preview"], sensitive = true }
    web_slack_order_hook_url                                      = { app = "web", key = "SLACK_ORDER_HOOK_URL", target = ["production", "preview"], sensitive = true }
    web_slack_sales_hook_url_production                           = { app = "web", key = "SLACK_SALES_HOOK_URL", target = ["production"], sensitive = true }
    web_slack_sales_hook_url_preview_development                  = { app = "web", key = "SLACK_SALES_HOOK_URL", target = ["preview"], sensitive = true }
    web_enable_experimental_corepack                              = { app = "web", key = "ENABLE_EXPERIMENTAL_COREPACK", target = ["production", "preview", "development"], sensitive = false }
    web_flags_secret                                              = { app = "web", key = "FLAGS_SECRET", target = ["production", "preview"], sensitive = true }
    web_flags_secret_development                                  = { app = "web", key = "FLAGS_SECRET", target = ["development"], sensitive = false }
    web_recaptcha_project_id_production                           = { app = "web", key = "RECAPTCHA_PROJECT_ID", target = ["production", "preview"], sensitive = false }
    web_recaptcha_secret_key_production                           = { app = "web", key = "RECAPTCHA_SECRET_KEY", target = ["production"], sensitive = true }
    web_recaptcha_secret_key_preview                              = { app = "web", key = "RECAPTCHA_SECRET_KEY", target = ["preview"], sensitive = true }
    web_eventro_recruitment_email_campaign_id_production          = { app = "web", key = "NEXT_PUBLIC_EVENTRO_RECRUITMENT_EMAIL_CAMPAIGN_ID", target = ["production"], sensitive = false }
    web_eventro_recruitment_email_campaign_id_staging_branch      = { app = "web", key = "NEXT_PUBLIC_EVENTRO_RECRUITMENT_EMAIL_CAMPAIGN_ID", target = ["preview"], sensitive = false, git_branch = "staging" }
    web_eventro_recruitment_email_campaign_id_preview_development = { app = "web", key = "NEXT_PUBLIC_EVENTRO_RECRUITMENT_EMAIL_CAMPAIGN_ID", target = ["preview", "development"], sensitive = false }
    web_revalidation_secret                                       = { app = "web", key = "REVALIDATION_SECRET", target = ["production", "preview"], sensitive = true }
    photos_corepack                                               = { app = "photos", key = "ENABLE_EXPERIMENTAL_COREPACK", target = ["production", "preview", "development"], sensitive = false }
    order_corepack                                                = { app = "order", key = "ENABLE_EXPERIMENTAL_COREPACK", target = ["production", "preview", "development"], sensitive = false }
    photos_api_production                                         = { app = "photos", key = "NEXT_PUBLIC_API_URL", target = ["production"], sensitive = false }
    photos_api_preview                                            = { app = "photos", key = "NEXT_PUBLIC_API_URL", target = ["preview", "development"], sensitive = false }
    photos_captcha_production                                     = { app = "photos", key = "NEXT_PUBLIC_RECAPTCHA_SITE_KEY", target = ["production"], sensitive = false }
    photos_captcha_preview                                        = { app = "photos", key = "NEXT_PUBLIC_RECAPTCHA_SITE_KEY", target = ["preview"], sensitive = false }
    order_api_production                                          = { app = "order", key = "NEXT_PUBLIC_API_URL", target = ["production"], sensitive = false }
    order_api_preview                                             = { app = "order", key = "NEXT_PUBLIC_API_URL", target = ["preview", "development"], sensitive = false }
    order_token_production                                        = { app = "order", key = "EXPO_ACCESS_TOKEN", target = ["production"], sensitive = true }
    order_token_preview                                           = { app = "order", key = "EXPO_ACCESS_TOKEN", target = ["preview"], sensitive = true }
    order_hook_production                                         = { app = "order", key = "SLACK_ORDER_HOOK_URL", target = ["production"], sensitive = true }
    order_hook_preview                                            = { app = "order", key = "SLACK_ORDER_TEST_HOOK_URL", target = ["preview"], sensitive = true }
  }
}

resource "vercel_project_environment_variable" "apps" {
  for_each   = local.app_env
  project_id = vercel_project.apps[each.value.app].id
  team_id    = var.vercel_team_id
  key        = each.value.key
  value      = "" # Managed in Vercel dashboard.
  target     = each.value.target
  sensitive  = each.value.sensitive
  git_branch = try(each.value.git_branch, null)

  lifecycle {
    ignore_changes = [value]
  }
}
