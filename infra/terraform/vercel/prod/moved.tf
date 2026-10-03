# Preserve existing resource identities when consolidating the for_each maps.

moved {
  from = vercel_project.armada_nu
  to   = vercel_project.apps["web"]
}

moved {
  from = vercel_project.standalone
  to   = vercel_project.apps
}

moved {
  from = vercel_project_environment_variable.standalone
  to   = vercel_project_environment_variable.apps
}

moved {
  from = vercel_project_environment_variable.next_public_api_url_staging_branch
  to   = vercel_project_environment_variable.apps["web_next_public_api_url_staging_branch"]
}

moved {
  from = vercel_project_environment_variable.next_public_api_url_production
  to   = vercel_project_environment_variable.apps["web_next_public_api_url_production"]
}

moved {
  from = vercel_project_environment_variable.next_public_api_url_preview_development
  to   = vercel_project_environment_variable.apps["web_next_public_api_url_preview_development"]
}

moved {
  from = vercel_project_environment_variable.next_public_recaptcha_site_key_production
  to   = vercel_project_environment_variable.apps["web_next_public_recaptcha_site_key_production"]
}

moved {
  from = vercel_project_environment_variable.next_public_recaptcha_site_key_preview
  to   = vercel_project_environment_variable.apps["web_next_public_recaptcha_site_key_preview"]
}

moved {
  from = vercel_project_environment_variable.expo_access_token
  to   = vercel_project_environment_variable.apps["web_expo_access_token"]
}

moved {
  from = vercel_project_environment_variable.slack_order_hook_url
  to   = vercel_project_environment_variable.apps["web_slack_order_hook_url"]
}

moved {
  from = vercel_project_environment_variable.slack_sales_hook_url_production
  to   = vercel_project_environment_variable.apps["web_slack_sales_hook_url_production"]
}

moved {
  from = vercel_project_environment_variable.slack_sales_hook_url_preview_development
  to   = vercel_project_environment_variable.apps["web_slack_sales_hook_url_preview_development"]
}

moved {
  from = vercel_project_environment_variable.enable_experimental_corepack
  to   = vercel_project_environment_variable.apps["web_enable_experimental_corepack"]
}

moved {
  from = vercel_project_environment_variable.flags_secret
  to   = vercel_project_environment_variable.apps["web_flags_secret"]
}

moved {
  from = vercel_project_environment_variable.flags_secret_development
  to   = vercel_project_environment_variable.apps["web_flags_secret_development"]
}

moved {
  from = vercel_project_environment_variable.recaptcha_project_id_production
  to   = vercel_project_environment_variable.apps["web_recaptcha_project_id_production"]
}

moved {
  from = vercel_project_environment_variable.recaptcha_secret_key_production
  to   = vercel_project_environment_variable.apps["web_recaptcha_secret_key_production"]
}

moved {
  from = vercel_project_environment_variable.recaptcha_secret_key_preview
  to   = vercel_project_environment_variable.apps["web_recaptcha_secret_key_preview"]
}

moved {
  from = vercel_project_environment_variable.eventro_recruitment_email_campaign_id_production
  to   = vercel_project_environment_variable.apps["web_eventro_recruitment_email_campaign_id_production"]
}

moved {
  from = vercel_project_environment_variable.eventro_recruitment_email_campaign_id_staging_branch
  to   = vercel_project_environment_variable.apps["web_eventro_recruitment_email_campaign_id_staging_branch"]
}

moved {
  from = vercel_project_environment_variable.eventro_recruitment_email_campaign_id_preview_development
  to   = vercel_project_environment_variable.apps["web_eventro_recruitment_email_campaign_id_preview_development"]
}

moved {
  from = vercel_project_environment_variable.revalidation_secret
  to   = vercel_project_environment_variable.apps["web_revalidation_secret"]
}
