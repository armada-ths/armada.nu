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
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**"
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "54321",
        pathname: "/storage/v1/object/public/**"
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54321",
        pathname: "/storage/v1/object/public/**"
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
