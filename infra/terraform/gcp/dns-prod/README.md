# armada.nu authoritative DNS

This Terraform root is the source of truth for the public authoritative DNS
zone `armada.nu` in Google Cloud DNS. Websupport holds the domain registration
and the registrar-level NS and DS records. Google Cloud manages the generated
SOA, NS, DNSKEY, RRSIG, and denial-of-existence records.

## Production architecture

| Component                  | Configuration                                                             |
| -------------------------- | ------------------------------------------------------------------------- |
| GCP project                | `armada-dns-prod` in the `thskth.se` organization                         |
| Managed zone               | `armada-nu` for `armada.nu.`                                              |
| Registrar                  | Websupport                                                                |
| Authoritative name servers | `ns-cloud-d1.googledomains.com` through `ns-cloud-d4.googledomains.com`   |
| DNSSEC                     | Enabled in Cloud DNS and anchored by the matching DS record at Websupport |
| HCP Terraform workspace    | `THS-Armada/armadanu-gcp-dns-prod`                                        |
| HCP working directory      | `infra/terraform/gcp/dns-prod`                                            |
| Apply policy               | Manual approval; auto-apply disabled                                      |
| Terraform identity         | `terraform-armadanu-dns@armada-dns-prod.iam.gserviceaccount.com`          |

Project Owners are `it@armada.nu` and `einar.harri@armada.nu`. The Terraform
service account has `roles/dns.admin` and
`roles/serviceusage.serviceUsageAdmin`. HCP authenticates through the
workspace-restricted `hcp-terraform-dns-prod` Workload Identity provider; no
long-lived Google credentials are stored in HCP.

Cloud Billing and Cloud Resource Manager APIs are project dependencies.
Terraform manages Cloud DNS API enablement, the public zone, and all
non-generated RRsets. The zone is protected by `prevent_destroy` and
`force_destroy = false`.

## Record ownership

`local.dns_records` in `records.tf` is the authoritative inventory of website,
CMS, staging, photo, banquet, Google Workspace, GitHub verification, SPF,
DMARC, and Resend records. Keep exactly one map entry per `(name, type)` RRset;
multi-value MX and TXT records must remain grouped in the same resource.

Targets such as CNAMEs and mail exchangers use fully qualified names with a
trailing dot. TXT data is quoted in the representation expected by Cloud DNS.
Public verification and DKIM public keys are intentionally version-controlled;
private keys and API credentials must never be added here.

Do not add provider-generated SOA, apex NS, DNSKEY, RRSIG, NSEC, or NSEC3
records to Terraform. Do not manage Websupport, Vercel domain objects,
application deployments, or another DNS zone from this state.

## Routine DNS changes

1. Edit the relevant RRset in `records.tf`. Avoid making the same functional
   change directly in Cloud DNS while the pull request is open.
2. Run the local static checks:

   ```powershell
   terraform -chdir=infra/terraform/gcp/dns-prod fmt -check -recursive
   terraform -chdir=infra/terraform/gcp/dns-prod init -backend=false
   terraform -chdir=infra/terraform/gcp/dns-prod validate
   ```

3. Open and review a pull request. The HCP plan must affect only the intended
   RRsets or explicitly reviewed zone settings.
4. Merge the pull request and manually approve the HCP apply. Auto-apply stays
   disabled.
5. Query all four authoritative name servers directly and at least two public
   validating resolvers. Verify affected applications and mail flows.

Registrar changes are not part of routine record updates. The Websupport NS
delegation remains pointed at the four name servers in Terraform output.

## DNSSEC operations

Production keeps `dnssec_state = "on"`. Google Cloud DNS manages signing keys
and signatures; Websupport stores the DS record that anchors the chain in
`.nu`. Read the current KSK-derived DS value with:

```powershell
gcloud dns dns-keys list `
  --project=armada-dns-prod `
  --zone=armada-nu `
  --filter="type=keySigning" `
  --format="value(ds_record())"
```

The returned value must exactly match the DS record at Websupport and the DS
published by `.nu`. Verify the chain with direct DS and DNSKEY queries and a
validating resolver. A validating lookup must return the normal answer, never
`SERVFAIL`.

Never turn DNSSEC off while the DS record is published. For an intentional key
or provider transition, follow the provider's rollover procedure and verify the
parent DS before removing an old key.

## Operational verification

Useful checks include:

```powershell
terraform -chdir=infra/terraform/gcp/dns-prod output name_servers
dig armada.nu NS
dig armada.nu DS
dig armada.nu DNSKEY +dnssec
dig @ns-cloud-d1.googledomains.com armada.nu SOA
```

After DNS changes, verify:

- `https://armada.nu` and `https://www.armada.nu`
- `https://cms.armada.nu/health`
- staging website and `https://staging.cms.armada.nu/health`
- `https://photos.armada.nu`
- `https://banquet.armada.nu`
- Vercel domain/TLS status and the CMS load-balancer certificate
- Google Workspace inbound/outbound mail and Eventro/Resend delivery
- SPF, DMARC, Google/Resend DKIM, DS, DNSKEY, and RRSIG responses

## Recovery and destructive changes

Correct ordinary record mistakes through Terraform and apply the smallest
possible fix. Do not delete or recreate the managed zone: that changes its name
servers and DNSSEC keys, and `prevent_destroy` exists to block it.

If authoritative DNS must move to another provider, first prepare and verify the
replacement zone. Because DNSSEC is active, remove the Google DS record at
Websupport and wait until it has disappeared from `.nu` and its TTL has expired
before changing NS delegation. Publish the replacement provider's DS only after
its signed zone is serving correctly. Never change providers while an
incompatible DS remains published.

References:

- [Cloud DNS overview](https://docs.cloud.google.com/dns/docs/overview)
- [DNSSEC for Cloud DNS](https://docs.cloud.google.com/dns/docs/dnssec)
- [Activate DNSSEC at a registrar](https://docs.cloud.google.com/dns/docs/registrars)
