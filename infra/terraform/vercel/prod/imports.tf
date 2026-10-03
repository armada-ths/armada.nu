# Projects were prepared without deploying or moving production domains.
# These imports adopt them into the existing HCP state on the next apply.
import {
  to = vercel_project.standalone["photos"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_NmkiFlsmef0gTtzRmCRzzOc8HCVa"
}

import {
  to = vercel_project.standalone["order"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_jojVslRWi91VyCrj8eQYUMkWD2lz"
}

import {
  to = vercel_project_environment_variable.standalone["photos_api_production"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_NmkiFlsmef0gTtzRmCRzzOc8HCVa/fQ0g0VFIs3Gslc5f"
}

import {
  to = vercel_project_environment_variable.standalone["photos_api_preview"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_NmkiFlsmef0gTtzRmCRzzOc8HCVa/wdimCAhzW9o8PXat"
}

import {
  to = vercel_project_environment_variable.standalone["photos_corepack"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_NmkiFlsmef0gTtzRmCRzzOc8HCVa/1xGLClKhB7sZCs0t"
}

import {
  to = vercel_project_environment_variable.standalone["photos_captcha_production"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_NmkiFlsmef0gTtzRmCRzzOc8HCVa/vhxlSqTvTP0UGRai"
}

import {
  to = vercel_project_environment_variable.standalone["photos_captcha_preview"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_NmkiFlsmef0gTtzRmCRzzOc8HCVa/C2o91hX3H90eq3Y3"
}

import {
  to = vercel_project_environment_variable.standalone["order_api_production"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_jojVslRWi91VyCrj8eQYUMkWD2lz/RwBdtIdV6IyYDcQ2"
}

import {
  to = vercel_project_environment_variable.standalone["order_api_preview"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_jojVslRWi91VyCrj8eQYUMkWD2lz/LSm2bj77mnl5Cc2s"
}

import {
  to = vercel_project_environment_variable.standalone["order_corepack"]
  id = "team_btIcmU7B2r6eWM5S61x4wJWM/prj_jojVslRWi91VyCrj8eQYUMkWD2lz/4i7O76DrSygmJTdV"
}
