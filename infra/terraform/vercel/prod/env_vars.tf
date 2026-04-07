# Each resource tracks one Vercel environment variable.
# Import blocks bring existing variables under Terraform management.
# Import ID format: {team_id}/{project_id}/{env_var_id}
#
# Values are intentionally NOT managed by Terraform. They are set and rotated
# directly in the Vercel dashboard (or via the Vercel CLI). The `value = ""`
# placeholder satisfies the provider schema, and `lifecycle { ignore_changes =
# [value] }` ensures Terraform never overwrites a value set in Vercel.
#
# Terraform DOES enforce: key name, target environments, and sensitive flag.
# Any drift on those attributes will appear in `terraform plan`.

locals {
  project_id = vercel_project.armada_nu.id
  team_id    = var.vercel_team_id
}

# ── NEXT_PUBLIC_API_URL ───────────────────────────────────────────────────────

import {
  to = vercel_project_environment_variable.next_public_api_url_production
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/eejAvTBjP0HcSWtp"
}

resource "vercel_project_environment_variable" "next_public_api_url_production" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "NEXT_PUBLIC_API_URL"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production"]
  sensitive  = true

  lifecycle {
    ignore_changes = [value]
  }
}

import {
  to = vercel_project_environment_variable.next_public_api_url_preview_development
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/1HaYPMKsZIJOP1OG"
}

resource "vercel_project_environment_variable" "next_public_api_url_preview_development" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "NEXT_PUBLIC_API_URL"
  value      = "" # Managed in Vercel dashboard.
  target     = ["preview", "development"]
  sensitive  = true

  lifecycle {
    ignore_changes = [value]
  }
}

# ── FEATURE_FLAG_PREVIEW_OVERRIDES_JSON ──────────────────────────────────────

import {
  to = vercel_project_environment_variable.feature_flag_preview_overrides_json
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/30nzAHsViOQjnI06"
}

resource "vercel_project_environment_variable" "feature_flag_preview_overrides_json" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "FEATURE_FLAG_PREVIEW_OVERRIDES_JSON"
  value      = "" # Managed in Vercel dashboard.
  target     = ["preview"]
  sensitive  = true

  lifecycle {
    ignore_changes = [value]
  }
}

# ── NEXT_PUBLIC_RECAPTCHA_SITE_KEY ────────────────────────────────────────────

import {
  to = vercel_project_environment_variable.next_public_recaptcha_site_key
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/2LrI9axeI1scp86h"
}

resource "vercel_project_environment_variable" "next_public_recaptcha_site_key" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "NEXT_PUBLIC_RECAPTCHA_SITE_KEY"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production", "preview", "development"]
  sensitive  = true

  lifecycle {
    ignore_changes = [value]
  }
}

# ── NEXT_PUBLIC_RECAPTCHA_KEY ─────────────────────────────────────────────────

import {
  to = vercel_project_environment_variable.next_public_recaptcha_key
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/dOimiSDL7YZmz87S"
}

resource "vercel_project_environment_variable" "next_public_recaptcha_key" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "NEXT_PUBLIC_RECAPTCHA_KEY"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production", "preview", "development"]
  sensitive  = true

  lifecycle {
    ignore_changes = [value]
  }
}

# ── EXPO_ACCESS_TOKEN ─────────────────────────────────────────────────────────

import {
  to = vercel_project_environment_variable.expo_access_token
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/fP5RAOJ6DmPIrUlP"
}

resource "vercel_project_environment_variable" "expo_access_token" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "EXPO_ACCESS_TOKEN"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production", "preview", "development"]
  sensitive  = true

  lifecycle {
    ignore_changes = [value]
  }
}

# ── SLACK_ORDER_HOOK_URL ──────────────────────────────────────────────────────

import {
  to = vercel_project_environment_variable.slack_order_hook_url
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/1cJAwhpAddad4HU3"
}

resource "vercel_project_environment_variable" "slack_order_hook_url" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "SLACK_ORDER_HOOK_URL"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production", "preview", "development"]
  sensitive  = true

  lifecycle {
    ignore_changes = [value]
  }
}

# ── SLACK_SALES_HOOK_URL ──────────────────────────────────────────────────────

import {
  to = vercel_project_environment_variable.slack_sales_hook_url
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/zJ7I13A5LUbqw2YR"
}

resource "vercel_project_environment_variable" "slack_sales_hook_url" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "SLACK_SALES_HOOK_URL"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production", "preview", "development"]
  sensitive  = true

  lifecycle {
    ignore_changes = [value]
  }
}

# ── ENABLE_EXPERIMENTAL_COREPACK ──────────────────────────────────────────────

import {
  to = vercel_project_environment_variable.enable_experimental_corepack
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/zVVll9oIYGa54kFi"
}

resource "vercel_project_environment_variable" "enable_experimental_corepack" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "ENABLE_EXPERIMENTAL_COREPACK"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production", "preview", "development"]
  sensitive  = true

  lifecycle {
    ignore_changes = [value]
  }
}

# ── FLAG_SECRET ───────────────────────────────────────────────────────────────

import {
  to = vercel_project_environment_variable.flag_secret
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/5Ax9usxWbWW2Kz9Q"
}

resource "vercel_project_environment_variable" "flag_secret" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "FLAG_SECRET"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production", "preview", "development"]
  sensitive  = true

  lifecycle {
    ignore_changes = [value]
  }
}

# ── FLAGS_SECRET ──────────────────────────────────────────────────────────────

import {
  to = vercel_project_environment_variable.flags_secret
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/ltPUXoOxZXopE9uE"
}

resource "vercel_project_environment_variable" "flags_secret" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "FLAGS_SECRET"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production", "preview", "development"]
  sensitive  = true

  lifecycle {
    ignore_changes = [value]
  }
}

# ── CONTENTFUL_SPACE_ID (legacy) ──────────────────────────────────────────────

import {
  to = vercel_project_environment_variable.contentful_space_id
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/BAM8jQ3jS7dxTVbW"
}

resource "vercel_project_environment_variable" "contentful_space_id" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "CONTENTFUL_SPACE_ID"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production", "preview", "development"]
  sensitive  = true

  lifecycle {
    ignore_changes = [value]
  }
}

# ── CONTENTFUL_DELIVERY_TOKEN (legacy) ────────────────────────────────────────

import {
  to = vercel_project_environment_variable.contentful_delivery_token
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/0fPa20S1sGe9WIC8"
}

resource "vercel_project_environment_variable" "contentful_delivery_token" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "CONTENTFUL_DELIVERY_TOKEN"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production", "preview", "development"]
  sensitive  = true

  lifecycle {
    ignore_changes = [value]
  }
}

# ── CONTENTFUL_PREVIEW_TOKEN (legacy) ─────────────────────────────────────────

import {
  to = vercel_project_environment_variable.contentful_preview_token
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/yvEsLjVuckHS232e"
}

resource "vercel_project_environment_variable" "contentful_preview_token" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "CONTENTFUL_PREVIEW_TOKEN"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production", "preview", "development"]
  sensitive  = true

  lifecycle {
    ignore_changes = [value]
  }
}
