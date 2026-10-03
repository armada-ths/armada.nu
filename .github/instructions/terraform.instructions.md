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
- Application-specific project environment-variable definitions (`env_vars.tf`)

It does **not** manage deployments — those are triggered by the Vercel GitHub integration on every push to `main`.
It also does not manage domains, DNS, GitHub secrets, Vercel-managed system variables, or environment-variable values.

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

Local commands that are always safe: `terraform validate`, `terraform fmt`, `terraform import`.

## Vercel env var value-drift pattern (critical)

Values for `vercel_project_environment_variable` resources are **managed in the Vercel dashboard**, not in Terraform.

- The shared `vercel_project_environment_variable.apps` resource uses `value = ""` as a placeholder.
- `lifecycle { ignore_changes = [value] }` ensures Terraform never overwrites a value set in Vercel.
- Terraform **does** enforce: key name, target environments, branch scope, and `sensitive` flag. Drift on those will appear in `terraform plan`.

**Never** remove the `lifecycle` block or populate `value` with a real secret — that would store the secret in HCP Terraform state.

## Adding a new environment variable

1. Add the variable in the **Vercel dashboard** with its real value.
2. Get its ID from the Vercel API or Vercel dashboard network tab (`vercel env ls` also works).
3. Add an entry to `local.app_env` in `env_vars.tf`:

   ```hcl
   web_my_var = { app = "web", key = "MY_VAR", target = ["production"], sensitive = true }
   ```

4. Add an `import {}` block targeting `vercel_project_environment_variable.apps["web_my_var"]` with the variable ID, run `terraform apply` to import, then remove the block. The shared resource keeps `ignore_changes = [value]`.
5. Register the key in `src/env.ts` if the app code needs to read it.

## Vercel workspace setup (first-time / CI)

`backend.tf` is gitignored. Copy `backend.tf.example` → `backend.tf` and run `terraform init`. The workspace requires one sensitive env var in HCP Terraform: `VERCEL_API_TOKEN`.
