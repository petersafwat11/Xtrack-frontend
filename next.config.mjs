/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_SERVER: "http://localhost:5000", // Development server URL
  },
  images: {
    domains: ["localhost"],
  },
};

export default nextConfig;
