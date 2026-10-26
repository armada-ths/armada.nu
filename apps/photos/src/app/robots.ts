import type { MetadataRoute } from "next"
export default function robots(): MetadataRoute.Robots {
  // Allow crawlers to read the app-wide noindex header and metadata.
  return { rules: { userAgent: "*", allow: "/" } }
}
