---
description: "Use when working with Terraform files for the armada.nu Vercel infrastructure. Covers env var value-drift pattern, HCP Terraform workflow, and what Terraform does and does not manage."
applyTo: "infra/terraform/**"
---

# Terraform — armada.nu Vercel production

Reference: [`infra/terraform/vercel/prod/README.md`](../../infra/terraform/vercel/prod/README.md)

## What this root manages

- Vercel project settings (`project.tf`): framework, Node version, Git repository, serverless region, skew protection
- All project environment variables (`env_vars.tf`)

It does **not** manage deployments — those are triggered by the Vercel GitHub integration on every push to `main`.

## HCP Terraform — prefer remote plans

All applies run in HCP Terraform workspace **`armadanu-vercel-prod`** (org `THS-Armada`). For non-trivial changes, queue a plan from the HCP Terraform UI rather than running `terraform plan` locally. Local `terraform plan` requires a valid `VERCEL_API_TOKEN` in your environment and hits the Vercel API directly, which is fine for quick validation but slower than remote.

Local commands that are always safe: `terraform validate`, `terraform fmt`, `terraform import`.

## Env var value-drift pattern (critical)

Values for `vercel_project_environment_variable` resources are **managed in the Vercel dashboard**, not in Terraform.

- Every resource uses `value = ""` as a placeholder.
- `lifecycle { ignore_changes = [value, sensitive] }` ensures Terraform never overwrites a value set in Vercel.
- Terraform **does** enforce: key name, target environments, and `sensitive` flag. Drift on those will appear in `terraform plan`.

**Never** remove the `lifecycle` block or populate `value` with a real secret — that would store the secret in HCP Terraform state.

## Adding a new environment variable

1. Add the variable in the **Vercel dashboard** with its real value.
2. Get its ID from the Vercel API or Vercel dashboard network tab (`vercel env ls` also works).
3. Add a `vercel_project_environment_variable` resource in `env_vars.tf`:
   ```hcl
   resource "vercel_project_environment_variable" "my_var" {
     project_id = local.project_id
     team_id    = local.team_id
     key        = "MY_VAR"
     value      = "" # Managed in Vercel dashboard.
     target     = ["production"]
     sensitive  = true

     lifecycle {
       ignore_changes = [value, sensitive]
     }
   }
   ```
4. Add an `import {}` block with the variable ID, run `terraform apply` to import, then remove the block.
5. Register the key in `src/env.ts` if the app code needs to read it.

## Workspace setup (first-time / CI)

`backend.tf` is gitignored. Copy `backend.tf.example` → `backend.tf` and run `terraform init`. The workspace requires one sensitive env var in HCP Terraform: `VERCEL_API_TOKEN`.
