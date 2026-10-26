import createNextIntlPlugin from "next-intl/plugin"
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")
import path from "node:path"
import process from "node:process"
import { networkInterfaces } from "node:os"

const localApi =
  process.env.NODE_ENV === "development" &&
  /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/?$/.test(
    process.env.NEXT_PUBLIC_API_URL ?? ""
  )

const nextConfig = {
  allowedDevOrigins: Object.values(networkInterfaces())
    .flat()
    .filter(address => address?.family === "IPv4" && !address.internal)
    .map(address => address.address),
  transpilePackages: ["@armada/shared"],
  outputFileTracingRoot: path.resolve(import.meta.dirname, "../.."),
  turbopack: { root: path.resolve(import.meta.dirname, "../..") },
  async rewrites() {
    if (!localApi) return []
    return [
      {
        source: "/api/v1/photo-events/access/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")}/api/v1/photo-events/access/:path*`
      },
      {
        source: "/local-photo-storage/:path*",
        destination: "http://127.0.0.1:54321/:path*"
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" }
        ]
      }
    ]
  }
}

export default withNextIntl(nextConfig)
