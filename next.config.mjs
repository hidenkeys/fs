/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ]
  },
  outputFileTracingIncludes: {
    "/*": ["./db/schema.sql"]
  }
};

export default nextConfig;
