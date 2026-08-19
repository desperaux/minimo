import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: ["/marketing", "/legal/"], disallow: ["/i/", "/api/", "/auth/", "/onboarding", "/_next/"] }],
    sitemap: "https://junvo.example/sitemap.xml",
  };
}
