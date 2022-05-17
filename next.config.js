/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

if (process.env.NEXT_BASE_PATH) {
  nextConfig.basePath = process.env.NEXT_BASE_PATH
}

module.exports = nextConfig
