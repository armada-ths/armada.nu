output "managed_zone_name" {
  description = "Google Cloud DNS managed zone name."
  value       = google_dns_managed_zone.armada_nu.name
}

output "name_servers" {
  description = "Authoritative Google Cloud name servers to configure at Websupport after pre-cutover validation."
  value       = google_dns_managed_zone.armada_nu.name_servers
}

output "dnssec_state" {
  description = "Configured DNSSEC state. The chain is not active until the matching DS record is published at Websupport."
  value       = var.dnssec_state
}
