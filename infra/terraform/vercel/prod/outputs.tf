output "project_id" {
  description = "The Vercel project ID for armada-nu."
  value       = vercel_project.armada_nu.id
}

output "project_name" {
  description = "The Vercel project name."
  value       = vercel_project.armada_nu.name
}
