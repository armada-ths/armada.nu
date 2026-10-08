locals {
  # This map is the authoritative inventory of application and email RRsets for
  # armada.nu. Provider-generated SOA, NS, and DNSSEC records are intentionally
  # omitted because Cloud DNS creates and manages them.
  #
  # Keep one entry per (name, type) RRset. Cloud DNS and the Google provider
  # treat each RRset as authoritative, so all values for an MX/TXT/etc. RRset
  # must be kept together.
  dns_records = merge({
    "apex/MX" = {
      name = var.dns_name
      type = "MX"
      ttl  = 300
      rrdatas = [
        "1 aspmx.l.google.com.",
        "5 alt1.aspmx.l.google.com.",
        "5 alt2.aspmx.l.google.com.",
        "10 aspmx2.googlemail.com.",
        "10 aspmx3.googlemail.com.",
      ]
    }
    "apex/TXT" = {
      name = var.dns_name
      type = "TXT"
      ttl  = 300
      rrdatas = [
        "\"google-site-verification=Gsonm_iCF-kbdmvjrmiCX7bvMjFq3HSG9U8PrDpTH2A\"",
        "\"v=spf1 include:_spf.google.com ~all\"",
      ]
    }
    "cms/A" = {
      name    = "cms.${var.dns_name}"
      type    = "A"
      ttl     = 300
      rrdatas = ["34.54.47.115"]
    }
    "staging.cms/CNAME" = {
      name    = "staging.cms.${var.dns_name}"
      type    = "CNAME"
      ttl     = 300
      rrdatas = ["ghs.googlehosted.com."]
    }
    "banquet/CNAME" = {
      name    = "banquet.${var.dns_name}"
      type    = "CNAME"
      ttl     = 300
      rrdatas = ["armada-ths.github.io."]
    }
    "_dmarc/TXT" = {
      name    = "_dmarc.${var.dns_name}"
      type    = "TXT"
      ttl     = 300
      rrdatas = ["\"v=DMARC1; p=none;\""]
    }
    "_github-challenge-armada-ths-org/TXT" = {
      name    = "_github-challenge-armada-ths-org.${var.dns_name}"
      type    = "TXT"
      ttl     = 300
      rrdatas = ["\"032ecc4ba0\""]
    }
    "resend._domainkey/TXT" = {
      name = "resend._domainkey.${var.dns_name}"
      type = "TXT"
      ttl  = 300
      rrdatas = [
        "\"p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBs7hyzxtk3hUZyGBqfSn9EeBTdP48djjWpKt0w0HNNhj3n62bkGhQFn/tuDLyfIfjGN1njwJmb3zxhXHBdTXMnsO5lJ8tTD5ekcR+SwnpLCSbA3kQ0wbu09x7D3ht3Tldz/YB87PX/WmeSqYbqMlZzkU0A7pw/DO0B47lMfjyVQIDAQAB\"",
      ]
    }
    "rsend/CNAME" = {
      name    = "rsend.${var.dns_name}"
      type    = "CNAME"
      ttl     = 300
      rrdatas = ["rsend-euw1.forge.rmta.net."]
    }
    "send/CNAME" = {
      name    = "send.${var.dns_name}"
      type    = "CNAME"
      ttl     = 300
      rrdatas = ["send.forge.rmta.net."]
    }
    "links/CNAME" = {
      name    = "links.${var.dns_name}"
      type    = "CNAME"
      ttl     = 300
      rrdatas = ["links2.resend-dns.com."]
    }
  }, data.tfe_outputs.vercel_prod.nonsensitive_values.vercel_dns_records)
}

resource "google_dns_record_set" "managed" {
  for_each = local.dns_records

  project      = var.project_id
  managed_zone = google_dns_managed_zone.armada_nu.name
  name         = each.value.name
  type         = each.value.type
  ttl          = each.value.ttl
  rrdatas      = each.value.rrdatas
}
