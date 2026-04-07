# Import the pre-existing Vercel project into Terraform state.
# Safe to keep after the first apply; re-applying is a no-op.
import {
  to = vercel_project.armada_nu
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq"
}

resource "vercel_project" "armada_nu" {
  name    = var.vercel_project_name
  team_id = var.vercel_team_id

  framework    = "nextjs"
  node_version = "22.x"

  git_repository = {
    type              = "github"
    repo              = "armada-ths/armada.nu"
    production_branch = "main"
  }

  # arn1 = eu-north-1 (Stockholm). Deprecated in favour of resource_config
  # function_default_regions, but kept here to match the current Vercel project
  # configuration. Migrate to resource_config when convenient.
  serverless_function_region = "arn1"
}
