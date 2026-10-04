/** @type {import('next').NextConfig} */

const apiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? 'http://localhost:8787';

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // نُبقي البناء متسامحًا مع أخطاء الأنواع لتسريع التسليم
  // وللفحص الصارم شغّل: npm run typecheck
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
