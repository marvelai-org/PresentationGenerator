/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.pravatar.cc', 'nextuipro.nyc3.cdn.digitaloceanspaces.com'],
  },
  transpilePackages: ['@heroui/react'],
  reactStrictMode: true,
  swcMinify: false, // Try disabling SWC minifier
  experimental: {
    // Only keep this important optimization
    optimizePackageImports: ['@heroui/react'],
  },
};

module.exports = nextConfig;
