/** @type {import('next').NextConfig} */

const apiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? 'http://localhost:8787';

const nextConfig = {
  // static export → يولّد مجلد "out" الذي تتوقعه Cloudflare Pages
  output: 'export',

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  env: {
    NEXT_PUBLIC_API_BASE_URL: apiBase,
  },
};

export default nextConfig;
