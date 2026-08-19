import { describe, expect, it } from "vitest";
import { getSecurityHeaders, publicInvoiceHeaders, securityHeaders } from "./security-headers";

describe("security headers", () => {
  it("keeps browser protections explicit", () => {
    const headers = Object.fromEntries(securityHeaders.map(header => [header.key, header.value]));
    expect(headers).toMatchObject({
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Content-Security-Policy": "frame-ancestors 'none';",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    });
    expect(headers["Permissions-Policy"]).toContain("camera=()");
  });

  it("adds HSTS only for production", () => {
    expect(getSecurityHeaders(false).some(header => header.key === "Strict-Transport-Security")).toBe(false);
    expect(getSecurityHeaders(true)).toContainEqual({ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" });
  });

  it("protects tokenized invoice pages from caching and referrer leakage", () => {
    expect(publicInvoiceHeaders).toContainEqual({ key: "Cache-Control", value: "no-store" });
    expect(publicInvoiceHeaders).toContainEqual({ key: "Referrer-Policy", value: "no-referrer" });
    expect(publicInvoiceHeaders).toContainEqual({ key: "X-Robots-Tag", value: "noindex, nofollow" });
  });
});
