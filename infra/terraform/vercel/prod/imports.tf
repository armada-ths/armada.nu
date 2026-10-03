# Imports adopt existing Vercel resources into the HCP state.
# Already imported resources are left unchanged on subsequent applies.
import {
  to = vercel_project_domain.apps["web"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/armada.nu"
}

import {
  to = vercel_project_domain.apps["web_www"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/www.armada.nu"
}

import {
  to = vercel_project_domain.apps["web_staging"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/staging.armada.nu"
}

import {
  to = vercel_project_domain.apps["web_default"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_1QAHp2yja1LumPMNUb0t6H4HEeiq/armada-nu.vercel.app"
}

import {
  to = vercel_project_domain.apps["photos_staging"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_NmkiFlsmef0gTtzRmCRzzOc8HCVa/staging.photos.armada.nu"
}

import {
  to = vercel_project_domain.apps["photos_default"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_NmkiFlsmef0gTtzRmCRzzOc8HCVa/armada-photos.vercel.app"
}

import {
  to = vercel_project_domain.apps["order_staging"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_jojVslRWi91VyCrj8eQYUMkWD2lz/staging.order.armada.nu"
}

import {
  to = vercel_project_domain.apps["order_default"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_jojVslRWi91VyCrj8eQYUMkWD2lz/armada-order.vercel.app"
}

import {
  to = vercel_project_domain.apps["photos"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_NmkiFlsmef0gTtzRmCRzzOc8HCVa/photos.armada.nu"
}

import {
  to = vercel_project_domain.apps["order"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_jojVslRWi91VyCrj8eQYUMkWD2lz/order.armada.nu"
}

import {
  to = vercel_project.apps["photos"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_NmkiFlsmef0gTtzRmCRzzOc8HCVa"
}

import {
  to = vercel_project.apps["order"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_jojVslRWi91VyCrj8eQYUMkWD2lz"
}

# Order variables were created with empty sensitive values.
# Set their real values in Vercel before testing or deploying Order.
import {
  to = vercel_project_environment_variable.apps["order_token_production"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_jojVslRWi91VyCrj8eQYUMkWD2lz/aV3qbQh3xtMBupCy"
}

import {
  to = vercel_project_environment_variable.apps["order_token_preview"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_jojVslRWi91VyCrj8eQYUMkWD2lz/Gp9pO7z9gIBF2Uq3"
}

import {
  to = vercel_project_environment_variable.apps["order_hook_production"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_jojVslRWi91VyCrj8eQYUMkWD2lz/YVgj8FNcxxtkCsBZ"
}

import {
  to = vercel_project_environment_variable.apps["order_hook_preview"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_jojVslRWi91VyCrj8eQYUMkWD2lz/kFHQyyggchu2spHa"
}




import {
  to = vercel_project_environment_variable.apps["photos_captcha_production"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_NmkiFlsmef0gTtzRmCRzzOc8HCVa/vhxlSqTvTP0UGRai"
}

import {
  to = vercel_project_environment_variable.apps["photos_captcha_preview"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_NmkiFlsmef0gTtzRmCRzzOc8HCVa/C2o91hX3H90eq3Y3"
}




import {
  to = vercel_shared_environment_variable.apps["api_production"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/env_fNYgzCIhVC6GKV9WAV5Ooemt"
}

import {
  to = vercel_shared_environment_variable.apps["api_preview_development"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/env_cB6VjGQc1XDaRRqbGeWa86k6"
}

import {
  to = vercel_shared_environment_variable.apps["corepack"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/env_s5gpj9QEysbd8Td8XjxYDub1"
}
