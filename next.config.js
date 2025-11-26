/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  images: {
    domains: ['vercel.blob.core.windows.net'],
  },
};

module.exports = nextConfig;


