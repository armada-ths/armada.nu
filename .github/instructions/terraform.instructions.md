---
description: "Use when working with Terraform files for armada.nu. Covers the separate Vercel and authoritative Cloud DNS roots, HCP Terraform workflow, and safety boundaries."
applyTo: "infra/terraform/**"
---

# Terraform — armada.nu infrastructure

Reference: [`infra/terraform/README.md`](../../infra/terraform/README.md)

## Root layout

| Root            | HCP workspace           | Responsibility                                               |
| --------------- | ----------------------- | ------------------------------------------------------------ |
| `vercel/prod/`  | `armadanu-vercel-prod`  | Vercel project settings and environment-variable definitions |
| `gcp/dns-prod/` | `armadanu-gcp-dns-prod` | Public authoritative DNS for `armada.nu`                     |

Keep these as separate roots and states. DNS is organization-wide infrastructure
and must never be added to the Vercel state.

## Vercel root

- Vercel project settings (`projects.tf`): framework, Node version, Git repository, serverless region, skew protection
- Shared API/Corepack and application-specific environment-variable definitions (`env_vars.tf`)
- All three projects' production, staging and default vercel.app domain assignments (`domains.tf`); preserve branch/redirect settings.

It does **not** manage deployments — those are triggered by the Vercel GitHub integration on every push to `main`.
It does not manage DNS, domain registration, GitHub secrets, Vercel-managed system variables, or environment-variable values.

## Cloud DNS root

The DNS root manages the Google Cloud DNS API, one public managed zone, and its
explicit RRsets. Websupport remains the registrar, so NS and DS updates are
manual, gated operations. Never manage or import provider-generated SOA, NS, or
DNSSEC records.

- Google Cloud DNS is authoritative for `armada.nu`; Websupport delegates the
  four `ns-cloud-d*.googledomains.com` name servers.
- Keep DNSSEC `on`. The matching KSK DS record is maintained manually at
  Websupport and must remain synchronized with Google Cloud DNS.
- Add or change application and email records only in `local.dns_records`, with
  one entry per `(name, type)` RRset and all values grouped in that entry.
- Vercel routing records are merged from `vercel_dns_records` in the Vercel workspace through `tfe_outputs`; do not duplicate their A/CNAME targets. Apply Vercel first, then DNS, with output-read access granted in HCP Terraform. Domain registration and non-Vercel records remain independent.
- Verify every DNS change directly against all four authoritative name servers
  and through multiple validating public resolvers after apply.
- Never change delegation while a DS record for a different provider or key is
  published at `.nu`; remove the DS first and wait out its TTL.
- Do not remove `prevent_destroy` from the managed zone.

## HCP Terraform — prefer remote plans

All applies run in their root-specific HCP Terraform workspace in organization
`THS-Armada`. Queue plans remotely and keep auto-apply disabled for the DNS
workspace. Local `terraform plan` for the Vercel root requires
`VERCEL_API_TOKEN`; the DNS root uses HCP dynamic GCP credentials.

Use `terraform validate` and `terraform fmt` for local validation. Imports write state and must target an explicitly identified existing resource; applies require a reviewed plan.

## Vercel env var value-drift pattern (critical)

Values for `vercel_project_environment_variable` resources are **managed in the Vercel dashboard**, not in Terraform.

- Both `vercel_project_environment_variable.apps` and `vercel_shared_environment_variable.apps` use `value = ""` as a placeholder. Create new definitions with Terraform, then set their real values in Vercel before deploying. Import definitions that already exist in Vercel.
- `lifecycle { ignore_changes = [value] }` preserves values set in Vercel during updates, not creation or replacement. Recreated variables need their real values set again.
- Terraform **does** enforce: key name, target environments, branch scope, and `sensitive` flag. Drift on those will appear in `terraform plan`.
- API origins and Corepack use `local.shared_env`, linked to all three projects. Do not duplicate those keys in `local.app_env`: project-local values override shared ones. Shared Production uses the production API; Preview/Development use staging. reCAPTCHA keys and secrets stay project-specific.

**Never** remove the `lifecycle` block or populate `value` with a real secret — that would store the secret in HCP Terraform state.

## Adding a new environment variable

1. Add an entry to `local.app_env` in `env_vars.tf` (or `local.shared_env` for a shared key), with the correct environment scope and sensitivity:

   ```hcl
   web_my_var = { app = "web", key = "MY_VAR", target = ["production"], sensitive = true }
   ```

2. Review and apply the Terraform plan to create the definition with an empty placeholder. Retain `ignore_changes = [value]`.
3. Set its real value in the **Vercel dashboard** before deploying any application that needs it. Never commit or log the value.
4. Register the key in the owning app's `src/env.ts` if the app code needs to read it; framework/tooling keys follow their respective entry points.
5. Deploy or redeploy the affected applications.

If the variable already exists in Vercel, retrieve its ID without logging its value and import it into the corresponding resource instead of creating a duplicate. Review and apply the import plan, then remove the completed import block. Do not deploy while a required variable still has an empty placeholder.

## Vercel workspace setup (first-time / CI)

`backend.tf` is gitignored. Copy `backend.tf.example` → `backend.tf` and run `terraform init`. The workspace requires one sensitive env var in HCP Terraform: `VERCEL_API_TOKEN`.
