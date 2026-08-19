import type { NextConfig } from "next";
import { getSecurityHeaders, publicInvoiceHeaders } from "./lib/security-headers";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      { source: "/i/:path*", headers: [...publicInvoiceHeaders] },
      { source: "/(.*)", headers: getSecurityHeaders(process.env.NODE_ENV === "production") },
    ];
  },
};

export default nextConfig;
