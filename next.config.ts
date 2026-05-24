import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow LAN access in dev (so phones on same wifi can load the dev server)
  allowedDevOrigins: ["192.168.1.9", "192.168.1.*", "10.0.0.*", "localhost"],
};

export default nextConfig;
