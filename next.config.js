/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  output: "standalone",
  outputFileTracingIncludes: {
    "/api/*": ["./prisma/dev.db"],
  },
};

module.exports = nextConfig;
