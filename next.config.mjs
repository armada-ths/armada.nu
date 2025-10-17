/** @type {import('next').NextConfig} */
import toolbar from "@vercel/toolbar/plugins/next"

const withVercelToolbar = toolbar()
const nextConfig = {
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
