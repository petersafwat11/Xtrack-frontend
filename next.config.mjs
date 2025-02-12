/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_SERVER: "https://xtrack-backend-production.up.railway.app",
  },
  images: {
    domains: ["localhost"],
  },
};

export default nextConfig;
