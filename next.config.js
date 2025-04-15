/** @type {import('next').NextConfig} */
const { configureWebpack } = require('./module-resolve');

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
  experimental: {},
  images: {
    domains: [],
    unoptimized: true, // Add this for Vercel
  },
  // Set to 'standalone' to support pages with dynamic server usage (cookies)
  output: 'standalone',
  
  // Add webpack configuration to handle Node.js built-in modules (Webpack 5 compatible)
  webpack: configureWebpack,
  
  // Font optimization settings
  optimizeFonts: false, // Disable font optimization to prevent Google Fonts requests
}

module.exports = nextConfig 