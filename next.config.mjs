/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
    NEXT_PUBLIC_BACKEND_SERVER: "https://xtrack-backend-production-67a3.up.railway.app",
    // NEXT_PUBLIC_BACKEND_SERVER: "http://localhost:5000",

  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xtrack-backend-production.up.railway.app",
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
