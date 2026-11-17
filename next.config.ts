import type { NextConfig } from "next";

const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};
export default nextConfig;