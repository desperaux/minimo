const baseSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none';" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
] as const;

export function getSecurityHeaders(isProduction: boolean) {
  return isProduction
    ? [...baseSecurityHeaders, { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
    : [...baseSecurityHeaders];
}

export const securityHeaders = getSecurityHeaders(false);

export const publicInvoiceHeaders = [
  { key: "Cache-Control", value: "no-store" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
] as const;
