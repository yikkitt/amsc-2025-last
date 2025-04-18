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
  experimental: {
    // Enable optimizations
    optimizeCss: true,  // CSS optimization
    legacyBrowsers: false, // Don't support legacy browsers
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/**',
      },
    ],
    unoptimized: false, // Ensure image optimization is enabled (default is true in Next.js 13+)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048], // Responsive image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // Image sizes for srcset
    formats: ['image/webp', 'image/avif'], // Modern image formats for better compression
    minimumCacheTTL: 60, // Cache optimized images for 60 seconds minimum
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
    
    // Add optimization plugins
    if (!isServer) {
      // Set production mode for client-side bundles
      config.mode = 'production';
    }
    
    return config;
  },
  
  // Font optimization settings - enable for better performance
  optimizeFonts: true, // Enable font optimization
  
  // Ensure env variables are properly loaded
  env: {
    // Use explicitly hardcoded values for build time to avoid substitution issues
    NEXT_PUBLIC_SUPABASE_URL: 'https://kiotgupdmepdyiscbrmb.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpb3RndXBkbWVwZHlpc2Nicm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTc4MDQsImV4cCI6MjA1OTU3MzgwNH0.USrVcvc8lzraMh4a4BpaTSope81DwX4EsYCxMddC1I8',
  },
  
  // Enable compression
  compress: true,
  
  // Optimize build output
  poweredByHeader: false, // Remove X-Powered-By header
}

module.exports = nextConfig 