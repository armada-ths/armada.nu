# All project domain assignments; DNS records belong to the Cloud DNS root.
locals {
  app_domains = {
    web            = { app = "web", domain = "armada.nu" }
    web_www        = { app = "web", domain = "www.armada.nu", redirect = "armada.nu", redirect_status_code = 308 }
    web_staging    = { app = "web", domain = "staging.armada.nu", git_branch = "staging" }
    web_default    = { app = "web", domain = "armada-nu.vercel.app", redirect = "armada.nu", redirect_status_code = 308 }
    photos         = { app = "photos", domain = "photos.armada.nu" }
    photos_staging = { app = "photos", domain = "staging.photos.armada.nu", git_branch = "staging" }
    photos_default = { app = "photos", domain = "armada-photos.vercel.app", redirect = "photos.armada.nu", redirect_status_code = 308 }
    order          = { app = "order", domain = "order.armada.nu" }
    order_staging  = { app = "order", domain = "staging.order.armada.nu", git_branch = "staging" }
    order_default  = { app = "order", domain = "armada-order.vercel.app", redirect = "order.armada.nu", redirect_status_code = 308 }
  }

  # Stable keys identify each Cloud DNS routing RRset.
  dns_domains = {
    "apex/A"               = { assignment = "web", type = "A" }
    "www/A"                = { assignment = "web_www", type = "A" }
    "staging/CNAME"        = { assignment = "web_staging", type = "CNAME" }
    "photos/CNAME"         = { assignment = "photos", type = "CNAME" }
    "staging.photos/CNAME" = { assignment = "photos_staging", type = "CNAME" }
    "order/CNAME"          = { assignment = "order", type = "CNAME" }
    "staging.order/CNAME"  = { assignment = "order_staging", type = "CNAME" }
  }
}

resource "vercel_project_domain" "apps" {
  for_each             = local.app_domains
  team_id              = var.vercel_team_id
  project_id           = vercel_project.apps[each.value.app].id
  domain               = each.value.domain
  git_branch           = try(each.value.git_branch, null)
  redirect             = try(each.value.redirect, null)
  redirect_status_code = try(each.value.redirect_status_code, null)

  lifecycle {
    prevent_destroy = true
  }
}

# Ownership verification records are not routing records. Query the provider's
# domain configuration instead, without waiting for downstream DNS readiness.
data "vercel_domain_config" "apps" {
  for_each           = local.dns_domains
  team_id            = var.vercel_team_id
  project_id_or_name = vercel_project_domain.apps[each.value.assignment].project_id
  domain             = vercel_project_domain.apps[each.value.assignment].domain
}
