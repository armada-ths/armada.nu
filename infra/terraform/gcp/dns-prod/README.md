# armada.nu authoritative DNS

This Terraform root manages the public authoritative Cloud DNS zone for
`armada.nu`. The domain remains registered at Websupport. Registrar NS and DS
changes are intentionally manual because Websupport is outside Terraform.

## Ownership and safety boundaries

- GCP project: `armada-dns-prod`
- HCP Terraform organization/workspace: `THS-Armada/armadanu-gcp-dns-prod`
- HCP working directory: `infra/terraform/gcp/dns-prod`
- HCP auto-apply: disabled
- Project owners: `it@armada.nu` and `einar.harri@armada.nu`
- Terraform execution identity: `terraform-armadanu-dns@armada-dns-prod.iam.gserviceaccount.com`
- DNS zone deletion is protected with `prevent_destroy` and `force_destroy = false`.
- This root does not manage Websupport, Vercel domains, application deployments,
  or records in another DNS zone.

## One-time bootstrap

The GCP bootstrap was completed on 2026-09-29. Project `armada-dns-prod` belongs
to the `thskth.se` organization and uses the same organization-owned billing
account as ArmadaCMS. Cloud Billing and Cloud Resource Manager APIs are enabled
as bootstrap dependencies; Terraform manages Cloud DNS API enablement. The
dedicated Terraform service account has these project roles:

- `roles/dns.admin`
- `roles/serviceusage.serviceUsageAdmin`

The existing `hcp-terraform` Workload Identity pool is reused. Its providers are
workspace-specific, so DNS uses the dedicated provider
`hcp-terraform-dns-prod`, restricted to HCP organization `THS-Armada` and
workspace `armadanu-gcp-dns-prod`. Only that workspace identity has
`roles/iam.workloadIdentityUser` on the DNS Terraform service account.

The HCP workspace uses remote execution, Terraform 1.15.2, manual applies, and
these environment variables:

- `TFC_GCP_PROVIDER_AUTH=true`
- `TFC_GCP_WORKLOAD_PROVIDER_NAME=projects/475154911163/locations/global/workloadIdentityPools/hcp-terraform/providers/hcp-terraform-dns-prod`
- `TFC_GCP_RUN_SERVICE_ACCOUNT_EMAIL=terraform-armadanu-dns@armada-dns-prod.iam.gserviceaccount.com`

Connect the workspace to GitHub repository `armada-ths/armada.nu` after this
root has been pushed. Delaying the VCS connection avoids an automatic failed run
against a revision where the working directory does not exist. No `TFE_TOKEN`
or cross-workspace state sharing is required.

## Required pre-apply inventory check

The checked-in inventory was compared with the complete Loopia export made on
2026-09-29. All 15 non-provider RRsets and their values match. Terraform uses a
temporary TTL of 300 seconds for every imported RRset; the export still contains
longer TTLs for several records. The original export remains outside the
repository as rollback evidence.

Before the first apply:

1. Lower changeable Loopia record TTLs above 300 to 300 and wait out the old
   maximum TTL.
2. Freeze functional DNS changes.
3. Immediately before the first apply, export the complete Loopia zone again if
   any DNS change has occurred since the verified 2026-09-29 export, and retain
   the timestamped original outside the repository as rollback evidence.
4. Compare every non-provider RRset with `local.dns_records` in `records.tf` if
   a new export was required.
5. Do not copy Loopia's SOA, apex NS, DNSKEY, RRSIG, NSEC, or other generated
   DNSSEC data.
6. Confirm that no DS record is published by `.nu`. If one exists, stop; remove
   it at Websupport and wait until its TTL expires before continuing.

The export must account for all currently known website, CMS, staging, photo,
banquet, Google Workspace, GitHub verification, DMARC, SPF, and Resend records.

## Validation and first apply

Local static validation:

```powershell
terraform -chdir=infra/terraform/gcp/dns-prod fmt -check -recursive
terraform -chdir=infra/terraform/gcp/dns-prod init -backend=false
terraform -chdir=infra/terraform/gcp/dns-prod validate
```

Review the HCP plan before applying. It must contain only:

- Cloud DNS API enablement
- one public managed zone
- the expected DNS RRsets

Keep `dnssec_state = "off"` for this apply. After applying, retrieve the four
assigned name servers from the `name_servers` output and query every one
directly. Their RRsets must match the final Loopia export before Websupport is
changed.

## Nameserver cutover

At Websupport, replace only `ns1.loopia.se` and `ns2.loopia.se` with the exact
four Google name servers from Terraform output. Do not transfer the domain or
change its contacts or renewal.

Keep Loopia active and serving an identical zone during propagation. Validate
the delegation and records through multiple public resolvers, then test:

- `https://armada.nu` and `https://www.armada.nu`
- `https://cms.armada.nu/health`
- staging website and staging CMS
- `https://photos.armada.nu`
- `https://banquet.armada.nu`
- Vercel domain/TLS status and the CMS load-balancer certificate
- Google Workspace inbound/outbound email and Eventro/Resend delivery

For mail, confirm SPF and DMARC pass, Resend/Eventro DKIM passes, and Google DKIM
is no worse than the pre-cutover baseline. Keep DMARC at `p=none` during this
migration.

## DNSSEC after stabilization

After at least 72 stable hours, change `dnssec_state` to `"on"` in a separate
pull request and apply it. Retrieve the Cloud DNS DS value:

```powershell
gcloud dns dns-keys list `
  --project=armada-dns-prod `
  --zone=armada-nu `
  --filter="type=keySigning" `
  --format="value(ds_record())"
```

Publish exactly that DS value at Websupport. The zone is signed after the
Terraform apply but is not anchored until the DS record is present in `.nu`.
Verify DS, DNSKEY, RRSIG, and successful validating resolution without
`SERVFAIL`.

## Rollback and cleanup

- Before DS publication: restore Loopias two name servers at Websupport.
- After DS publication: remove the Google DS at Websupport, wait until it is no
  longer published and its TTL has expired, and only then restore Loopia NS.
- Never delete the Google zone during rollback.
- Keep Loopia for at least seven days and until DNSSEC validation is stable.
  After that, cancel only the Loopia DNS service; keep the registration at
  Websupport.

References:

- [Migrate to Cloud DNS](https://docs.cloud.google.com/dns/docs/migrating)
- [Activate DNSSEC at a registrar](https://docs.cloud.google.com/dns/docs/registrars)
