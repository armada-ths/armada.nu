export function shouldSkipPhotoRecaptcha(apiUrl: string, environment: string) {
  return (
    environment === "development" &&
    /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/?$/.test(apiUrl)
  )
}
