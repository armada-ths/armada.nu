/** @type {import('next').NextConfig} */
import toolbar from "@vercel/toolbar/plugins/next"

const withVercelToolbar = toolbar()
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "armada-ais-files.s3.eu-north-1.amazonaws.com",
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
