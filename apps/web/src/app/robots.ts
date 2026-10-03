import type { MetadataRoute } from "next"
import { isProductionDeployment } from "@/lib/deployment"

export default function robots(): MetadataRoute.Robots {
  if (!isProductionDeployment()) {
    // Crawlers must be able to read the noindex header/meta tag. Disallowing
    // crawling would prevent removal of URLs that have already been indexed.
    return { rules: { userAgent: "*", allow: "/" } }
  }
  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/about/team"
      }
    ],
    sitemap: "https://armada.nu/sitemap.xml"
  }
}
