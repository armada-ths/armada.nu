resource "google_project_service" "cloud_dns" {
  project = var.project_id
  service = "dns.googleapis.com"

  disable_on_destroy = false
}

resource "google_dns_managed_zone" "armada_nu" {
  project       = var.project_id
  name          = "armada-nu"
  dns_name      = var.dns_name
  description   = "Authoritative production DNS for armada.nu"
  visibility    = "public"
  force_destroy = false

  labels = {
    environment = "production"
    managed-by  = "terraform"
    repository  = "armada-nu"
  }

  dnssec_config {
    state = var.dnssec_state
  }

  lifecycle {
    prevent_destroy = true
  }

  depends_on = [google_project_service.cloud_dns]
}
