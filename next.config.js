/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.pravatar.cc', 'nextuipro.nyc3.cdn.digitaloceanspaces.com'],
  },
  transpilePackages: ['@heroui/react'],
  reactStrictMode: true,
  // experimental: {
  //   // Only keep this important optimization
  //   optimizePackageImports: ['@heroui/react'],
  // },
};

module.exports = nextConfig;