# Read public outputs only, not the Vercel workspace's complete state.
# Apply armadanu-vercel-prod first to publish vercel_dns_records. Grant this
# workspace output-read access in HCP Terraform before planning DNS changes.
data "tfe_outputs" "vercel_prod" {
  organization = "THS-Armada"
  workspace    = "armadanu-vercel-prod"

  lifecycle {
    postcondition {
      condition = try(toset(keys(self.nonsensitive_values.vercel_dns_records)) == toset([
        "apex/A", "www/A", "staging/CNAME", "photos/CNAME",
        "staging.photos/CNAME", "order/CNAME", "staging.order/CNAME"
      ]), false)
      error_message = "Apply the Vercel workspace first: vercel_dns_records must contain all seven expected routing RRsets."
    }
  }
}
