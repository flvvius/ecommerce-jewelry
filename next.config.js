/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    domains: ['ecommerce-jewelry.vercel.app'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  // Configure correct asset prefix for production
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_APP_URL || 'https://ecommerce-jewelry.vercel.app'
    : undefined,
};

export default config;
