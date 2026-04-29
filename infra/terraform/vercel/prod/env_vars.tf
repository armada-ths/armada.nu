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

resource "vercel_project_environment_variable" "next_public_api_url_staging_branch" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "NEXT_PUBLIC_API_URL"
  value      = "" # Managed in Vercel dashboard.
  target     = ["preview"]
  git_branch = "staging"
  sensitive  = false

  lifecycle {
    ignore_changes = [value, sensitive]
  }
}

resource "vercel_project_environment_variable" "next_public_api_url_production" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "NEXT_PUBLIC_API_URL"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production"]
  sensitive  = false

  lifecycle {
    ignore_changes = [value, sensitive]
  }
}

resource "vercel_project_environment_variable" "next_public_api_url_preview_development" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "NEXT_PUBLIC_API_URL"
  value      = "" # Managed in Vercel dashboard.
  target     = ["preview", "development"]
  sensitive  = false

  lifecycle {
    ignore_changes = [value, sensitive]
  }
}

# ── NEXT_PUBLIC_RECAPTCHA_SITE_KEY ────────────────────────────────────────────

resource "vercel_project_environment_variable" "next_public_recaptcha_site_key_production" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "NEXT_PUBLIC_RECAPTCHA_SITE_KEY"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production"]
  sensitive  = false

  lifecycle {
    ignore_changes = [value, sensitive]
  }
}

resource "vercel_project_environment_variable" "next_public_recaptcha_site_key_preview" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "NEXT_PUBLIC_RECAPTCHA_SITE_KEY"
  value      = "" # Managed in Vercel dashboard.
  target     = ["preview"]
  sensitive  = false

  lifecycle {
    ignore_changes = [value, sensitive]
  }
}

# ── EXPO_ACCESS_TOKEN ─────────────────────────────────────────────────────────

resource "vercel_project_environment_variable" "expo_access_token" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "EXPO_ACCESS_TOKEN"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production", "preview"]
  sensitive  = true

  lifecycle {
    ignore_changes = [value, sensitive]
  }
}

# ── SLACK_ORDER_HOOK_URL ──────────────────────────────────────────────────────

resource "vercel_project_environment_variable" "slack_order_hook_url" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "SLACK_ORDER_HOOK_URL"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production", "preview", "development"]
  sensitive  = false

  lifecycle {
    ignore_changes = [value, sensitive]
  }
}

# ── SLACK_SALES_HOOK_URL ──────────────────────────────────────────────────────

resource "vercel_project_environment_variable" "slack_sales_hook_url_production" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "SLACK_SALES_HOOK_URL"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production"]
  sensitive  = false

  lifecycle {
    ignore_changes = [value, sensitive]
  }
}

resource "vercel_project_environment_variable" "slack_sales_hook_url_preview_development" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "SLACK_SALES_HOOK_URL"
  value      = "" # Managed in Vercel dashboard.
  target     = ["preview", "development"]
  sensitive  = false

  lifecycle {
    ignore_changes = [value, sensitive]
  }
}

# ── ENABLE_EXPERIMENTAL_COREPACK ──────────────────────────────────────────────

resource "vercel_project_environment_variable" "enable_experimental_corepack" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "ENABLE_EXPERIMENTAL_COREPACK"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production", "preview", "development"]
  sensitive  = false

  lifecycle {
    ignore_changes = [value, sensitive]
  }
}

# ── FLAG_SECRET ───────────────────────────────────────────────────────────────

resource "vercel_project_environment_variable" "flag_secret" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "FLAG_SECRET"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production", "preview"]
  sensitive  = true

  lifecycle {
    ignore_changes = [value, sensitive]
  }
}

# ── FLAGS_SECRET ──────────────────────────────────────────────────────────────

resource "vercel_project_environment_variable" "flags_secret" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "FLAGS_SECRET"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production", "preview"]
  sensitive  = true

  lifecycle {
    ignore_changes = [value, sensitive]
  }
}

# ── RECAPTCHA_PROJECT_ID ──────────────────────────────────────────────────────

resource "vercel_project_environment_variable" "recaptcha_project_id_production" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "RECAPTCHA_PROJECT_ID"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production", "preview"]
  sensitive  = false

  lifecycle {
    ignore_changes = [value, sensitive]
  }
}

# ── RECAPTCHA_SECRET_KEY ──────────────────────────────────────────────────────

resource "vercel_project_environment_variable" "recaptcha_secret_key_production" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "RECAPTCHA_SECRET_KEY"
  value      = "" # Managed in Vercel dashboard.
  target     = ["production"]
  sensitive  = true

  lifecycle {
    ignore_changes = [value, sensitive]
  }
}

resource "vercel_project_environment_variable" "recaptcha_secret_key_preview" {
  project_id = local.project_id
  team_id    = local.team_id
  key        = "RECAPTCHA_SECRET_KEY"
  value      = "" # Managed in Vercel dashboard.
  target     = ["preview"]
  sensitive  = true

  lifecycle {
    ignore_changes = [value, sensitive]
  }
}

# ── MOVED BLOCKS ──────────────────────────────────────────────────────────────
# These tell Terraform that existing state entries have been renamed, avoiding
# a destroy+create cycle.

moved {
  from = vercel_project_environment_variable.next_public_recaptcha_site_key
  to   = vercel_project_environment_variable.next_public_recaptcha_site_key_preview
}

moved {
  from = vercel_project_environment_variable.slack_sales_hook_url
  to   = vercel_project_environment_variable.slack_sales_hook_url_production
}

# ── IMPORT BLOCKS ─────────────────────────────────────────────────────────────
# IDs discovered via GET /v10/projects/{projectId}/env?teamId={teamId}

import {
  to = vercel_project_environment_variable.next_public_recaptcha_site_key_production
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/2AdhQ3ggcXMeNTfe"
}

import {
  to = vercel_project_environment_variable.slack_sales_hook_url_preview_development
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/Ry5lYPlol70j7ass"
}

import {
  to = vercel_project_environment_variable.recaptcha_project_id_production
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/3PYzxFaZIoX5HBJD"
}

import {
  to = vercel_project_environment_variable.recaptcha_secret_key_production
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/FmEcoQ47HXOSOk6j"
}

import {
  to = vercel_project_environment_variable.recaptcha_secret_key_preview
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/jkcD2fd5cu31x1II"
}
