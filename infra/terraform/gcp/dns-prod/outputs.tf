output "managed_zone_name" {
  description = "Google Cloud DNS managed zone name."
  value       = google_dns_managed_zone.armada_nu.name
}

output "name_servers" {
  description = "Authoritative Google Cloud name servers delegated from Websupport and .nu."
  value       = google_dns_managed_zone.armada_nu.name_servers
}

output "dnssec_state" {
  description = "Configured DNSSEC state. The matching DS record is maintained manually at Websupport."
  value       = var.dnssec_state
}
