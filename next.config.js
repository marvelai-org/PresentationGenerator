/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: ['img.youtube.com', 'vumbnail.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'vumbnail.com',
      },
    ],
  },
  // Special handling for CI environments
  env: {
    CI_ENVIRONMENT: process.env.CI_ENVIRONMENT || 'false',
  },
  // Enable more efficient build caching
  experimental: {
    optimizeCss: true,
    turbotrace: {
      logLevel: 'error'
    }
  }
};

// Special configuration for CI environments to handle authentication during build
if (process.env.CI_ENVIRONMENT === 'true') {
  console.log('🔧 CI environment detected, enabling special build options');
  
  // Set environment variables for build time
  process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-project.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';
  
  // Additional CI-specific configurations
  nextConfig.experimental = {
    ...nextConfig.experimental,
    // For CI environments, we want fast builds without too much analysis
    staticWorkerRequestDeduping: true,
  };
  
  // Use the correct property name for cache handler
  nextConfig.cacheHandler = require.resolve('./src/lib/build/ci-cache-handler.js');
}

module.exports = nextConfig;
