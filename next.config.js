/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Workaround for issues with node_modules
  transpilePackages: ['react-pdf', '@react-pdf/renderer'],
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  experimental: {
    // Enable experimental features if needed
  },
  images: {
    domains: [],
  },
}

module.exports = nextConfig 