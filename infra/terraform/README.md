# Terraform layout

Terraform is split into one root per logical stack. Each root has its own HCP
Terraform workspace and state.

| Root            | HCP Terraform workspace | Responsibility                                               |
| --------------- | ----------------------- | ------------------------------------------------------------ |
| `vercel/prod/`  | `armadanu-vercel-prod`  | Vercel project settings and environment-variable definitions |
| `gcp/dns-prod/` | `armadanu-gcp-dns-prod` | Authoritative public DNS for `armada.nu`                     |

The DNS root deliberately does not manage the domain registration at
Websupport, Vercel domains, deployments, or application infrastructure. Changes
to the registrar's NS and DS records remain controlled manual operations.

See each root's README for bootstrap, validation, apply, and rollback steps.
