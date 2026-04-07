# armada.nu Terraform — Vercel production

This Terraform root manages the **Vercel project configuration** for `armada.nu`.

It does **not** manage deployments — those are triggered automatically by the
Vercel GitHub integration on every push to `main`.

## What it manages

- Vercel project settings (framework, Node version, Git repository, serverless region)
- All project environment variables

## Files

| File                 | Purpose                                                          |
| -------------------- | ---------------------------------------------------------------- |
| `versions.tf`        | Provider version requirements (vercel)                           |
| `variables.tf`       | Configurable inputs                                              |
| `project.tf`         | `vercel_project` resource                                        |
| `env_vars.tf`        | `vercel_project_environment_variable` resources                  |
| `outputs.tf`         | Project ID and name outputs                                      |
| `prod.auto.tfvars`   | Committed non-secret production defaults (team ID, project name) |
| `backend.tf.example` | HCP Terraform backend template                                   |

## HCP Terraform workspace

Workspace: `armadanu-vercel-prod`. Requires one sensitive environment variable:
`VERCEL_API_TOKEN` — a personal access token from vercel.com/account.

## Environment variable values — managed in Vercel, not in Terraform

Values for existing env vars are set and rotated in the **Vercel dashboard** (or
via the Vercel CLI). Terraform does not store or push values.

The `value = ""` placeholder in each `vercel_project_environment_variable`
resource satisfies the provider schema. `lifecycle { ignore_changes = [value] }`
tells Terraform to never plan a change when the in-Vercel value differs from the
placeholder in config.

Terraform **does** enforce:

- The variable key name
- Target environments (`production`, `preview`, `development`)
- Whether the variable is `sensitive`

Any drift on those attributes will surface in `terraform plan`.

## Adding a new environment variable

1. Add the variable in the **Vercel dashboard** with its real value.
2. Get its ID from the Vercel API or dashboard network tab (or `vercel env ls`).
3. Add a `vercel_project_environment_variable` resource in `env_vars.tf` (use `value = ""` + `lifecycle { ignore_changes = [value, sensitive] }`) and an `import {}` block with the variable ID.
4. Run `terraform apply` to import it into state, then remove the `import {}` block.
5. Register the key in `src/env.ts` if the app code needs to read it.
