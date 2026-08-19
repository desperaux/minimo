import { describe, expect, it } from "vitest";
import { canIssueInvoice, canUsePlanFeature, PLAN_CATALOG } from "./plan-entitlements";

describe("plan entitlements", () => {
  it("publishes the accepted prices and Free issuance limit", () => {
    expect(PLAN_CATALOG.free).toEqual({ monthlyPriceCents: 0, annualPriceCents: 0, newlyIssuedInvoiceLimitPerCalendarMonth: 5 });
    expect(PLAN_CATALOG.pro).toEqual({ monthlyPriceCents: 900, annualPriceCents: 9_000, newlyIssuedInvoiceLimitPerCalendarMonth: null });
  });

  it("limits Free to five newly issued invoices per calendar month", () => {
    expect(canIssueInvoice("free", 4)).toBe(true);
    expect(canIssueInvoice("free", 5)).toBe(false);
    expect(canIssueInvoice("pro", 5_000)).toBe(true);
  });

  it("does not invent a hard Pro fair-use threshold", () => {
    expect(PLAN_CATALOG.pro.newlyIssuedInvoiceLimitPerCalendarMonth).toBeNull();
  });

  it("keeps PDF, payments, manual recording, and export available to both plans", () => {
    for (const feature of ["pdf_download", "stripe_payment_link", "manual_payment", "data_export"] as const) {
      expect(canUsePlanFeature("free", feature)).toBe(true);
      expect(canUsePlanFeature("pro", feature)).toBe(true);
    }
  });

  it("reserves custom reminders and branding removal for Pro", () => {
    expect(canUsePlanFeature("free", "custom_reminder_schedule")).toBe(false);
    expect(canUsePlanFeature("pro", "custom_reminder_schedule")).toBe(true);
    expect(canUsePlanFeature("free", "remove_branding")).toBe(false);
    expect(canUsePlanFeature("pro", "remove_branding")).toBe(true);
  });

  it("rejects invalid issued invoice counts", () => {
    expect(() => canIssueInvoice("free", -1)).toThrow("non-negative safe integer");
    expect(() => canIssueInvoice("free", 1.5)).toThrow("non-negative safe integer");
  });
});
