# armada.nu Terraform — Vercel production

This Terraform root manages the **Vercel project configuration** for Web, Photos and Order.

It does **not** manage deployments — those are triggered automatically by the
Vercel GitHub integration on every push to `main`.

## What it manages

- Vercel project settings (framework, Node version, Git repository, serverless region)
- Shared and application-specific environment-variable definitions in `env_vars.tf`

It does not manage domains, DNS, deployments, GitHub secrets, or environment
variable values. Vercel-managed system variables are also outside this root.

## Files

| File                 | Purpose                                                          |
| -------------------- | ---------------------------------------------------------------- |
| `versions.tf`        | Provider version requirements (vercel)                           |
| `variables.tf`       | Configurable inputs                                              |
| `projects.tf`        | Web, Photos and Order `vercel_project` resources                 |
| `env_vars.tf`        | Shared and project-specific environment-variable resources       |
| `outputs.tf`         | Project ID and name outputs                                      |
| `imports.tf`         | Existing project and environment-variable imports                |
| `moved.tf`           | State-address migrations into the shared for_each resources      |
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
3. Add an entry to `local.app_env` in `env_vars.tf` with the owning app, key, targets and sensitivity (and `git_branch` if applicable). Add an `import {}` block targeting `vercel_project_environment_variable.apps["entry_name"]` with the variable ID. The shared resource preserves dashboard values with `ignore_changes = [value]`.
4. Run `terraform apply` to import it into state, then remove the `import {}` block.
5. Register the key in the owning app's `src/env.ts` if the app code needs to read it.

## Standalone projects

`projects.tf` defines all three projects, `env_vars.tf` contains their environment-variable definitions, and `outputs.tf` exposes their project identifiers. `imports.tf` adopts the prepared projects and public configuration. The existing armada-nu project ID is preserved. Apply the apps/web Root Directory change only when the workspace commit is available and the staged cutover is ready. See [the rollout runbook](../../../../docs/standalone-apps.md). Secret values and production domain moves remain separate manual steps.

All projects use `vercel_project.apps`. Project-specific variables use `vercel_project_environment_variable.apps`, and shared variables use `vercel_shared_environment_variable.apps`. `moved.tf` migrates the remaining project-specific state addresses without recreating projects or resetting environment values. Existing output names remain compatible; `project_ids` also includes Web.

## Shared environment variables

Three team-level definitions are linked to Web, Photos and Order:

| Key                            | Environments                     | Value managed in Vercel         |
| ------------------------------ | -------------------------------- | ------------------------------- |
| `NEXT_PUBLIC_API_URL`          | Production                       | `https://cms.armada.nu`         |
| `NEXT_PUBLIC_API_URL`          | Preview, Development             | `https://staging.cms.armada.nu` |
| `ENABLE_EXPERIMENTAL_COREPACK` | Production, Preview, Development | `1`                             |

These shared definitions and their project links were created and verified through the Vercel CLI on 2026-10-03. The ten project-local API/Corepack overrides were then deleted, including Web's staging-branch API override. Previously, Web's generic previews/development used the production API; they now use staging, matching Photos and Order. All unrelated project variables were retained. reCAPTCHA keys and application secrets remain project-specific.

The imports in `imports.tf` adopt the three existing shared definitions on the next HCP apply. Import before applying any shared resource with a placeholder value: `ignore_changes` protects imported values, but does not supply a valid value for a newly created variable. `prevent_destroy` guards against accidental deletion of an existing managed shared definition. The first plan may drop stale project-local variable records because those objects have already been removed in Vercel; it must not recreate API/Corepack overrides or reset shared values. Do not apply older configuration that would restore the retired project-local placeholders.

Project-local variables take precedence over shared values, so do not add duplicate API/Corepack keys to `local.app_env`. All Preview branches use staging; branch-specific shared values are not supported. Each local app's `.env.local` can still override its development API, for example to `http://localhost:8080`. Existing deployments keep their previously captured configuration; the new settings take effect on the next deployment. No deployment was triggered as part of this migration.

## Provider v5 and automation bypass

The provider uses v5 with the exact selected version recorded in `.terraform.lock.hcl`. Run `terraform init` after pulling the upgrade. Schema retrieval for an initialized HCP root requires valid HCP authentication (`terraform login`); reload VS Code after refreshing its provider schema if diagnostics are stale.

V5 removes `protection_bypass_for_automation` and its secret from the project resource. Existing automation bypass tokens remain managed directly in Vercel; this root does not create, rotate or delete them. The CMS's configured `VERCEL_AUTOMATION_BYPASS_SECRET` must keep matching the existing Web token. Do not create a replacement token as part of this upgrade. If token management is added to Terraform later, import existing tokens into `vercel_project_protection_bypass` rather than generating replacements; import identifiers contain the secret and must never be committed. Review the first HCP plan for project replacements, environment-value changes and unexpected protection changes before applying.

## Removing state migration blocks

After a successful apply has migrated every state using this root, `moved.tf` can be removed. Verify that no source addresses listed in its `from` declarations remain (`terraform state list`), then check that removing the file produces no infrastructure changes. A plan alone does not persist these migrations. Keep the file if any workspace or restored older state still needs the upgrade path; retaining the blocks is harmless. The same caution applies when rolling back to older Terraform configuration.
