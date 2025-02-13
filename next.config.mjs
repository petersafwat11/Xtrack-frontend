/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_SERVER: "https://xtrack-backend-production.up.railway.app",
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
