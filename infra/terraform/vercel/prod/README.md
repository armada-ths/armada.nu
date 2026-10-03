# armada.nu Terraform — Vercel

This root manages the Web, Photos and Order Vercel projects, their environment-variable definitions and domain assignments. Deployments are handled by Vercel's GitHub integration. Environment values, automation bypass tokens, GitHub secrets, DNS and domain registration are managed separately.

## Projects and domains

| Project         | Root Directory | Production         | Staging branch domain      |
| --------------- | -------------- | ------------------ | -------------------------- |
| `armada-nu`     | `apps/web`     | `armada.nu`        | `staging.armada.nu`        |
| `armada-photos` | `apps/photos`  | `photos.armada.nu` | `staging.photos.armada.nu` |
| `armada-order`  | `apps/order`   | `order.armada.nu`  | `staging.order.armada.nu`  |

All projects use Next.js, Node 24, `main` as the production branch, Stockholm (`arn1`) for functions and Skip unaffected projects. Workspace source files outside each Root Directory must be included. Each app's `vercel.json` selects its own `pnpm build`.

`domains.tf` manages ten assignments: the production, staging and generated vercel.app domain for each project, plus `www.armada.nu`. Web's www and all projects' generated domains redirect permanently to their production domains; staging assignments select the `staging` branch.

Standard Protection (`standard_protection_new`) makes only production custom domains public. Staging, preview and generated deployment URLs require Vercel Authentication unless an explicit bypass or exception applies. Automation bypass tokens are managed directly in Vercel; the CMS's `VERCEL_AUTOMATION_BYPASS_SECRET` must match the Web project's token.

## Files and state

| File                  | Purpose                                             |
| --------------------- | --------------------------------------------------- |
| `versions.tf`         | Terraform and Vercel provider requirements          |
| `.terraform.lock.hcl` | Selected provider versions                          |
| `variables.tf`        | Configurable inputs                                 |
| `projects.tf`         | The three `vercel_project.apps` resources           |
| `env_vars.tf`         | Project-specific and shared environment definitions |
| `domains.tf`          | Domain assignments and routing data sources         |
| `outputs.tf`          | Project identifiers and public DNS recommendations  |
| `prod.auto.tfvars`    | Non-secret defaults                                 |
| `backend.tf.example`  | HCP Terraform backend template                      |

The HCP workspace is `THS-Armada/armadanu-vercel-prod`. It requires a sensitive `VERCEL_API_TOKEN` environment variable. The provider uses v5; the exact selected version is pinned in `.terraform.lock.hcl`.

## Environment variables

Actual values are set and rotated in Vercel, never committed. Both project-specific and shared Terraform resources use `value = ""` and `ignore_changes = [value]`. This preserves values of existing managed variables; it does not configure a valid value for a new variable. Protect Terraform state and API credentials.

Terraform controls key names, environment targets, sensitivity, project links and project-specific branch scope. Project-local variables take precedence over shared variables; do not duplicate shared API/Corepack keys in `local.app_env`.

| Shared key                     | Environments                     | Value configured in Vercel      |
| ------------------------------ | -------------------------------- | ------------------------------- |
| `NEXT_PUBLIC_API_URL`          | Production                       | `https://cms.armada.nu`         |
| `NEXT_PUBLIC_API_URL`          | Preview, Development             | `https://staging.cms.armada.nu` |
| `ENABLE_EXPERIMENTAL_COREPACK` | Production, Preview, Development | `1`                             |

These definitions link to all three projects. All preview branches use staging; local apps can override the API in their own `.env.local`. Public values must be available at build time. Changes to Vercel environment values require a new deployment to take effect.

Web owns sales, reCAPTCHA, Eventro, feature flag and revalidation variables. Photos owns its public reCAPTCHA keys. Order owns production/preview access tokens, the production `SLACK_ORDER_HOOK_URL` and preview-only `SLACK_ORDER_TEST_HOOK_URL`. Order's test delivery never falls back to the production hook.

To add a new variable that does not already exist in Vercel:

1. Add its definition to `local.app_env` (or `local.shared_env` for a shared key), with the correct environment scope and sensitivity. Retain `ignore_changes = [value]`.
2. Review and apply the Terraform plan to create the variable with an empty placeholder value.
3. Set its real value in the Vercel dashboard before deploying any application that needs it. Never commit or log the value.
4. Register application keys in the owning app's `src/env.ts`. Framework/tooling keys follow their respective entry points.
5. Deploy or redeploy the affected applications to use the configured value.

If the variable already exists in Vercel, retrieve its ID without logging its value, add its Terraform definition and import it into the corresponding resource instead of creating a duplicate. Review and apply the import plan, then remove the completed import block.

`ignore_changes = [value]` preserves manually configured values during updates, not creation or replacement. Set the real value again if Terraform recreates a variable. Do not deploy to production while a required variable still has an empty placeholder.

## DNS output and apply order

`vercel_domain_config` retrieves routing recommendations for seven custom domains. `vercel_dns_records` exports stable RRset keys, fully qualified names, TTLs and A/CNAME values to `THS-Armada/armadanu-gcp-dns-prod` through `tfe_outputs`. Generated vercel.app domains do not belong in Cloud DNS.

Apply this workspace before planning/applying DNS. Grant the DNS workspace output-read access in HCP Terraform and configure its tfe provider credentials. DNS reads public outputs, not the complete Vercel state; it needs no Vercel API credential. Review every recommended IPv4 and CNAME change. Domain assignments do not wait for DNS readiness, avoiding a circular dependency.

## Validation and changes

Run `terraform fmt -check`, `terraform validate` and a reviewed HCP plan. Review project replacements, environment definitions and protection settings before approving an apply. Verify DNS/TLS, production responses and staging authentication after domain or protection changes. Do not apply changes directly in Vercel that conflict with Terraform-managed settings.
