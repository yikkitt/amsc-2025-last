/** @type {import('next').NextConfig} */
const { configureWebpack } = require('./module-resolve');

const nextConfig = {
  output: 'standalone',
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
    // Disable CSS optimization that's causing build errors with critters
    optimizeCss: false,
    // Enable optimizations for faster loading
    scrollRestoration: true, // Enable scroll restoration for better UX
    adjustFontFallbacks: true, // Improve font display
    adjustFontFallbacksWithSizeAdjust: true, // Better font size adjustments
    // Enables more efficient code splitting
    optimizePackageImports: ['lucide-react'],
    serverComponentsExternalPackages: [],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kiotgupdmepdyiscbrmb.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    unoptimized: false, // Ensure image optimization is enabled
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Add 4K support
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Extended image sizes
    formats: ['image/avif', 'image/webp'], // Modern image formats for better compression
    minimumCacheTTL: 604800, // Cache optimized images for 1 week (improves LCP)
    dangerouslyAllowSVG: true, // Allow SVG optimization
    contentDispositionType: 'attachment', // Better caching for images
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ['kiotgupdmepdyiscbrmb.supabase.co'],
  },
  
  // Add webpack configuration to handle Node.js built-in modules (Webpack 5 compatible)
  webpack: (config, { isServer, dev }) => {
    // First apply our custom webpack configuration
    config = configureWebpack(config, { isServer });
    
    // Then handle polyfills for server components
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    
    // Add optimization plugins
    if (!isServer) {
      // Set production mode for client-side bundles
      config.mode = 'production';
      
      // Performance optimizations
      config.optimization = {
        ...config.optimization,
        runtimeChunk: 'single',
        moduleIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 20000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                // Safely get the package name
                try {
                  // Get the name of the package
                  const packagePathMatch = module.context?.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                  if (!packagePathMatch || !packagePathMatch[1]) {
                    return 'vendor';
                  }
                  // Return a unique name for the chunk based on the package name
                  return `npm.${packagePathMatch[1].replace('@', '')}`;
                } catch (err) {
                  console.warn('Failed to determine package name:', err);
                  return 'vendor';
                }
              },
            },
          },
        },
      };
    }
    
    // Optimize images at build time
    if (!dev) {
      config.module.rules.push({
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
      });
    }
    
    // Add loader for PDF generation
    config.module.rules.push({
      test: /\.node$/,
      use: 'null-loader',
    });
    
    return config;
  },
  
  // Font optimization settings - enable for better performance
  optimizeFonts: true, // Enable font optimization
  
  // Ensure env variables are properly loaded
  env: {
    // Use explicitly hardcoded values for build time to avoid substitution issues
    NEXT_PUBLIC_SUPABASE_URL: 'https://kiotgupdmepdyiscbrmb.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpb3RndXBkbWVwZHlpc2Nicm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTc4MDQsImV4cCI6MjA1OTU3MzgwNH0.USrVcvc8lzraMh4a4BpaTSope81DwX4EsYCxMddC1I8',
    // Google Maps API key
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: 'AIzaSyA-rV5256Pr0I1g-yVGX2UvDdaOVPrBMYs',
  },
  
  // Enable compression
  compress: true,
  
  // Optimize build output
  poweredByHeader: false, // Remove X-Powered-By header
  
  // New performance optimizations
  productionBrowserSourceMaps: false, // Disable source maps in production for faster loading
  
  // Add custom headers for better caching and security
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          }
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          }
        ],
      },
      {
        source: '/:path*.(jpg|jpeg|png|webp|avif|svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          }
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          }
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  // Handle browser polyfills
  transpilePackages: [
    '@react-pdf/renderer', 
    'react-pdf',
    'jspdf',
    'jspdf-autotable',
  ],
  // Ensure public files are available
  publicRuntimeConfig: {
    staticFolder: '/public',
  },
  // Add redirects if needed
  async redirects() {
    return [
      {
        source: '/forms',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
  generateBuildId: async () => {
    return `build-${new Date().toISOString()}`;
  },
}

module.exports = nextConfig 