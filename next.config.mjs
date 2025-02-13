/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // BACKEND_SERVER: "https://web-production-6b66.up.railway.app",
    BACKEND_SERVER: "http://localhost:5000",
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
