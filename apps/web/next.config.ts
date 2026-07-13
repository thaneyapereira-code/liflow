import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: ["@liflow/domain"],
  turbopack: {
    root: path.resolve(__dirname, "../..")
  }
};

export default nextConfig;
