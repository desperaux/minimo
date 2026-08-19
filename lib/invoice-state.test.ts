import { describe, expect, it } from "vitest";
import { canTransitionInvoice, isReminderEligible, transitionInvoice, type InvoiceStatus } from "./invoice-state";

describe("invoice status transitions", () => {
  it("allows the documented draft-to-sent path", () => {
    expect(transitionInvoice("draft", "queued")).toBe("queued");
    expect(transitionInvoice("queued", "sent")).toBe("sent");
  });

  it("allows delivery retry and voiding", () => {
    expect(canTransitionInvoice("queued", "delivery_failed")).toBe(true);
    expect(canTransitionInvoice("delivery_failed", "queued")).toBe(true);
    expect(canTransitionInvoice("delivery_failed", "void")).toBe(true);
  });

  it("rejects terminal-state regressions", () => {
    expect(canTransitionInvoice("paid", "sent")).toBe(false);
    expect(canTransitionInvoice("void", "queued")).toBe(false);
    expect(() => transitionInvoice("paid", "draft")).toThrow("Invalid invoice status transition");
    expect(canTransitionInvoice("unknown" as InvoiceStatus, "sent")).toBe(false);
  });

  it("keeps paid and void invoices out of reminders", () => {
    expect(isReminderEligible("sent")).toBe(true);
    expect(isReminderEligible("delivery_failed")).toBe(true);
    expect(isReminderEligible("paid")).toBe(false);
    expect(isReminderEligible("void")).toBe(false);
  });
});
