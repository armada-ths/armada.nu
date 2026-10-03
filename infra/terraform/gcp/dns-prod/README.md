# armada.nu authoritative DNS

This Terraform root manages the public `armada.nu` zone in Google Cloud DNS.
Websupport remains the registrar and holds the domain's NS and DS settings.

| Component          | Configuration                                         |
| ------------------ | ----------------------------------------------------- |
| GCP project / zone | `armada-dns-prod` / `armada-nu`                       |
| HCP workspace      | `THS-Armada/armadanu-gcp-dns-prod`                    |
| Authoritative DNS  | Google's four `ns-cloud-d*.googledomains.com` servers |
| DNSSEC             | Enabled; DS maintained manually at Websupport         |
| Applies            | Manual approval; auto-apply disabled                  |

The zone is protected by `prevent_destroy` and `force_destroy = false`.

## DNS records

`local.dns_records` in `records.tf` combines explicitly configured application
and email RRsets with the public `vercel_dns_records` output from
`THS-Armada/armadanu-vercel-prod`, read through `tfe_outputs` in
`vercel_outputs.tf`. Vercel routing A/CNAME targets are not duplicated here.
Keep one entry per `(name, type)` and group every value for a multi-value RRset.

Apply the Vercel workspace first to publish the output, then plan/apply this
workspace. Grant this workspace output-read access in HCP Terraform and ensure
the tfe provider can authenticate (HCP run credentials, or TFE_TOKEN locally).
Missing/incomplete output blocks planning rather than deleting existing Vercel
records. This reads outputs only, not the complete Vercel state. Review changes
to recommended IPv4 sets as well as CNAME targets before approving DNS apply.

Use fully qualified targets with a trailing dot and correctly quoted TXT data.
Public verification and DKIM public keys may be committed; private keys and API
credentials must not be.

Google manages SOA, NS, DNSKEY, RRSIG, and denial-of-existence records. Do not
add those records to Terraform.

## Making changes

1. Edit `records.tf` or another zone setting.
2. Run:

   ```powershell
   terraform -chdir=infra/terraform/gcp/dns-prod fmt -check -recursive
   terraform -chdir=infra/terraform/gcp/dns-prod init -backend=false
   terraform -chdir=infra/terraform/gcp/dns-prod validate
   ```

3. Review the HCP plan in a pull request.
4. Merge and manually approve the HCP apply.
5. Verify the changed records through Google's authoritative servers and public
   resolvers. Test affected web and mail flows.

Do not make parallel manual changes in Cloud DNS. Registrar changes at
Websupport are outside Terraform.

## DNSSEC

Production keeps `dnssec_state = "on"`. Google manages signing keys; the KSK's
DS record at Websupport anchors the chain in `.nu`.

```powershell
gcloud dns dns-keys list `
  --project=armada-dns-prod `
  --zone=armada-nu `
  --filter="type=keySigning" `
  --format="value(ds_record())"
```

The returned value must match Websupport and `.nu`. Never turn DNSSEC off while
a DS record is published.

## Recovery

Fix ordinary record mistakes through Terraform. Do not delete or recreate the
managed zone because that changes its name servers and DNSSEC keys.

Before moving authoritative DNS elsewhere, prepare the replacement zone, remove
the Google DS at Websupport, and wait until it has disappeared from `.nu` and
its TTL has expired. Change NS delegation only after that; publish the new DS
after the replacement signed zone has been verified.

References: [Cloud DNS](https://docs.cloud.google.com/dns/docs/overview) and
[DNSSEC](https://docs.cloud.google.com/dns/docs/dnssec).
