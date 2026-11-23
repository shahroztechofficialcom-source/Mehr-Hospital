import type { NextConfig } from "next";
import path from "node:path";
const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // Keep Next's tracing inside this app when a parent folder also has a lockfile.
  outputFileTracingRoot: path.resolve(process.cwd()),
};
export default nextConfig;
