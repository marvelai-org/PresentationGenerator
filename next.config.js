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
  // Disable strict error handling during static page generation in CI
  onDemandEntries: {
    // Treats warnings as warnings, not errors when using CI
    errorOnInvalid: process.env.CI_ENVIRONMENT !== 'true',
  },
};

// Special configuration for CI environments to handle authentication during build
if (process.env.CI_ENVIRONMENT === 'true') {
  console.log('🔧 CI environment detected, enabling special build options');
  
  // Set environment variables for build time
  process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-project.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';
  
  // Configure build output
  nextConfig.experimental = {
    ...nextConfig.experimental,
    // Force static rendering for CI builds
    appDir: true,
  };
}

module.exports = nextConfig;
