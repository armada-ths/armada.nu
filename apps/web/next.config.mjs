/** @type {import('next').NextConfig} */
import toolbar from "@vercel/toolbar/plugins/next"
import path from "node:path"

const withVercelToolbar = toolbar()
const nextConfig = {
  transpilePackages: ["@armada/shared"],
  outputFileTracingRoot: path.resolve(import.meta.dirname, "../.."),
  async headers() {
    const stagingHeaders = [
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "X-Content-Type-Options", value: "nosniff" }
    ]
    return [
      // Preview builds also have NODE_ENV=production. VERCEL_ENV identifies
      // the deployment, and an absent value keeps local/self-hosted builds safe.
      // eslint-disable-next-line no-undef
      ...(process.env.VERCEL_ENV !== "production"
        ? [{ source: "/:path*", headers: stagingHeaders }]
        : []),
      // Keep the fixed staging domain non-indexable even if it is accidentally
      // assigned a production deployment. Do not rely on authentication alone.
      {
        source: "/:path*",
        has: [{ type: "host", value: "staging\\.armada\\.nu" }],
        headers: stagingHeaders
      }
    ]
  },
  webpack(config) {
    // Find the existing rule handling SVGs
    const fileLoaderRule = config.module.rules.find(rule =>
      rule.test?.test?.(".svg")
    )

    // If found, modify it safely
    if (fileLoaderRule) {
      // Exclude svg from the default file loader
      fileLoaderRule.exclude = /\.svg$/i

      // Add your custom SVG handling rules
      config.module.rules.push(
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          resourceQuery: /url/, // *.svg?url
          type: "asset/resource"
        },
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          resourceQuery: { not: [/url/] }, // *.svg but not ?url
          use: ["@svgr/webpack"]
        }
      )
    }

    // Important: don't spread/clone rules or overwrite config entirely
    return config
  },
  images: {
    // eslint-disable-next-line no-undef
    unoptimized: process.env.NODE_ENV === "development",
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**"
      },
      {
        protocol: "https",
        hostname: "app.eventro.se",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/**"
      }
    ]
  },
  redirects: async () => {
    return [
      {
        source: "/map",
        destination: "/student/map",
        permanent: true
      },
      {
        source: "/at-the-fair",
        destination: "/student/at-the-fair",
        permanent: true
      },
      {
        source: "/recruitment",
        destination: "/student/recruitment",
        permanent: true
      },
      {
        source: "/team",
        destination: "/about/team",
        permanent: true
      }
    ]
  },
  turbopack: {
    root: path.resolve(import.meta.dirname, "../.."),
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js"
      }
    }
  }
}

export default withVercelToolbar(nextConfig)
