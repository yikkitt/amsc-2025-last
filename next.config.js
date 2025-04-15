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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/**',
      },
    ],
    unoptimized: false, // Optimize images as Vercel can handle this well
  },
  // Set to 'standalone' to support pages with dynamic server usage (cookies)
  output: 'standalone',
  
  // Add webpack configuration to handle Node.js built-in modules (Webpack 5 compatible)
  webpack: (config, { isServer }) => {
    // First apply our custom webpack configuration
    config = configureWebpack(config, { isServer });
    
    // Then handle polyfills for server components
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    
    return config;
  },
  
  // Font optimization settings
  optimizeFonts: false, // Disable font optimization to prevent Google Fonts requests
  
  // Ensure env variables are properly loaded
  env: {
    // Use explicitly hardcoded values for build time to avoid substitution issues
    NEXT_PUBLIC_SUPABASE_URL: 'https://kiotgupdmepdyiscbrmb.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpb3RndXBkbWVwZHlpc2Nicm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTc4MDQsImV4cCI6MjA1OTU3MzgwNH0.USrVcvc8lzraMh4a4BpaTSope81DwX4EsYCxMddC1I8',
  },
}

module.exports = nextConfig 