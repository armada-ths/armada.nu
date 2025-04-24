const getEnvVar = (key: string, defaultValue = "") => {
  return process.env[key] || defaultValue
}

export const env = {
  SLACK_SALES_HOOK_URL: getEnvVar("SLACK_SALES_HOOK_URL"),
  NEXT_PUBLIC_API_URL: getEnvVar("NEXT_PUBLIC_API_URL"),
  NEXT_PUBLIC_RECAPTCHA_KEY: getEnvVar("NEXT_PUBLIC_RECAPTCHA_KEY")
}
