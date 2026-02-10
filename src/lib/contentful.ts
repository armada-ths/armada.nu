import { env } from "@/env"
import * as contentful from "contentful"

export const contentfulClient = contentful.createClient({
  space: env.CONTENTFUL_SPACE_ID,
  accessToken:
    process.env.NODE_ENV === "development"
      ? env.CONTENTFUL_PREVIEW_TOKEN
      : env.CONTENTFUL_DELIVERY_TOKEN,
  host:
    process.env.NODE_ENV === "development"
      ? "preview.contentful.com"
      : "cdn.contentful.com"
})
