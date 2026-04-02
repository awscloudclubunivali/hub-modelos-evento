import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/hub-modelos-evento",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
