import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://minimo.example";
  return ["/marketing", "/legal/terms", "/legal/privacy", "/legal/cookies", "/legal/acceptable-use", "/legal/subprocessors"].map(path => ({ url: `${baseUrl}${path}`, lastModified: new Date("2026-08-18"), changeFrequency: "monthly" as const }));
}
