/** @type {import('next').NextConfig} */
import toolbar from "@vercel/toolbar/plugins/next"

const withVercelToolbar = toolbar()
const nextConfig = {
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "armada-ais-files.s3.eu-north-1.amazonaws.com",
        port: "",
        pathname: "**"
      },
      {
        protocol: "https",
        hostname: "armada-cms-files-e48105192c52.s3.eu-north-1.amazonaws.com",
        port: "",
        pathname: "**"
      },
      {
        protocol: "https",
        hostname: "app.eventro.se",
        port: "",
        pathname: "**"
      },
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
        port: "",
        pathname: "**"
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
  }
}

export default withVercelToolbar(nextConfig)
