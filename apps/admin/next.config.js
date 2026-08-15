/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@theblinghaven/shared'],
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    unoptimized: true,
  },
};

module.exports = nextConfig;
