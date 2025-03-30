/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure CSS processing is properly configured
  images: {
    domains: ['i.pravatar.cc', 'nextuipro.nyc3.cdn.digitaloceanspaces.com'],
  },
  // Add proper transpilation config
  transpilePackages: ['@heroui/react'],
  reactStrictMode: true,
  // Configure caching for improved build times
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroui/react'],
  },
};

module.exports = nextConfig;
