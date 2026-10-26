import process from "node:process"
const nativeFetch = globalThis.fetch
globalThis.fetch = async (input, options) => {
  const url = new URL(
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input.url
  )
  if (url.hostname === "hooks.slack.com") {
    if (!process.env.ORDER_FIXTURE_URL)
      throw new Error("Missing local order fixture")
    return nativeFetch(process.env.ORDER_FIXTURE_URL + "/__slack", {
      method: "POST",
      body: options?.body,
      headers: { "Content-Type": "application/json" }
    })
  }
  return nativeFetch(input, options)
}
