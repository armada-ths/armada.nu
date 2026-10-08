output "project_id" {
  description = "The Vercel project ID for armada-nu."
  value       = vercel_project.apps["web"].id
}

output "project_name" {
  description = "The Vercel project name."
  value       = vercel_project.apps["web"].name
}

output "standalone_project_ids" {
  value = { for app, project in vercel_project.apps : app => project.id if app != "web" }
}

output "project_ids" {
  description = "The Vercel project IDs for all workspace apps."
  value       = { for app, project in vercel_project.apps : app => project.id }
}

output "vercel_dns_records" {
  description = "Public routing RRsets recommended by Vercel, consumed by armadanu-gcp-dns-prod."
  value = {
    for key, config in local.dns_domains : key => {
      name = "${trimsuffix(data.vercel_domain_config.apps[key].domain, ".")}."
      type = config.type
      ttl  = 300
      rrdatas = config.type == "A" ? data.vercel_domain_config.apps[key].recommended_ipv4s : [
        "${trimsuffix(data.vercel_domain_config.apps[key].recommended_cname, ".")}."
      ]
    }
  }

  precondition {
    condition = alltrue([
      for key, config in local.dns_domains : config.type == "A" ? (
        length(data.vercel_domain_config.apps[key].recommended_ipv4s) > 0
        ) : (
        length(trimspace(data.vercel_domain_config.apps[key].recommended_cname)) > 0
      )
    ])
    error_message = "Vercel must supply non-empty routing recommendations for every custom domain."
  }
}
