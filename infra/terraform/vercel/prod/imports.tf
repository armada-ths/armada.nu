# Projects were prepared without deploying or moving production domains.
# These imports adopt them into the existing HCP state on the next apply.
import {
  to = vercel_project.apps["photos"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_NmkiFlsmef0gTtzRmCRzzOc8HCVa"
}

import {
  to = vercel_project.apps["order"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_jojVslRWi91VyCrj8eQYUMkWD2lz"
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
