/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['antd'],
  // Disable Turbopack explicitly
  experimental: {}
};

module.exports = nextConfig;