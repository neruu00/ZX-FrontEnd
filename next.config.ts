import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [new URL('https://image.aladin.co.kr/product/**')],
  },
};

export default nextConfig;
