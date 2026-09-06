/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@theblinghaven/shared'],
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/products',
        destination: '/catalog',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
