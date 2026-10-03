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
