const getEnvVar = (key: string, defaultValue = "") => {
  return process.env[key] || defaultValue
}

export const env = {
  SLACK_SALES_HOOK_URL: getEnvVar("SLACK_SALES_HOOK_URL"),
  SLACK_ORDER_HOOK_URL: getEnvVar("SLACK_ORDER_HOOK_URL"),
  NEXT_PUBLIC_API_URL: getEnvVar("NEXT_PUBLIC_API_URL"),
  NEXT_PUBLIC_RECAPTCHA_KEY: getEnvVar("NEXT_PUBLIC_RECAPTCHA_KEY"),
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: getEnvVar("NEXT_PUBLIC_RECAPTCHA_SITE_KEY"),
  // Server-side secret for verifying reCAPTCHA tokens
  RECAPTCHA_SECRET_KEY: getEnvVar("RECAPTCHA_SECRET_KEY"),
  // Contentful CMS (server-only)
  CONTENTFUL_SPACE_ID: getEnvVar("CONTENTFUL_SPACE_ID"),
  CONTENTFUL_PREVIEW_TOKEN: getEnvVar("CONTENTFUL_PREVIEW_TOKEN"),
  CONTENTFUL_DELIVERY_TOKEN: getEnvVar("CONTENTFUL_DELIVERY_TOKEN")
}
