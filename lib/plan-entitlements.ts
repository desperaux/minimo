export type JunvoPlan = "free" | "pro";

export const PLAN_CATALOG = {
  free: {
    monthlyPriceCents: 0,
    annualPriceCents: 0,
    newlyIssuedInvoiceLimitPerCalendarMonth: 5,
  },
  pro: {
    monthlyPriceCents: 900,
    annualPriceCents: 9_000,
    newlyIssuedInvoiceLimitPerCalendarMonth: null,
  },
} as const;

export function canIssueInvoice(plan: JunvoPlan, newlyIssuedThisCalendarMonth: number): boolean {
  if (!Number.isSafeInteger(newlyIssuedThisCalendarMonth) || newlyIssuedThisCalendarMonth < 0) throw new Error("Issued invoice count must be a non-negative safe integer.");
  return plan === "pro" || newlyIssuedThisCalendarMonth < PLAN_CATALOG.free.newlyIssuedInvoiceLimitPerCalendarMonth;
}

export function canUsePlanFeature(plan: JunvoPlan, feature: "pdf_download" | "stripe_payment_link" | "manual_payment" | "data_export" | "custom_reminder_schedule" | "remove_branding"): boolean {
  if (feature === "custom_reminder_schedule" || feature === "remove_branding") return plan === "pro";
  return plan === "free" || plan === "pro";
}
