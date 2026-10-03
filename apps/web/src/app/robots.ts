import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
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
