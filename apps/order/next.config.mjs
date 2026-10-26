import process from "node:process"
import createNextIntlPlugin from "next-intl/plugin"
const withNextIntl = createNextIntlPlugin(
  "./" +
    path
      .relative(
        process.cwd(),
        path.join(import.meta.dirname, "src/i18n/request.ts")
      )
      .replaceAll("\\", "/")
)
import path from "node:path"
const nextConfig = {
  transpilePackages: ["@armada/shared"],
  outputFileTracingRoot: path.resolve(import.meta.dirname, "../.."),
  turbopack: { root: path.resolve(import.meta.dirname, "../..") },
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
