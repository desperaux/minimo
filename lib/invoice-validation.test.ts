import { describe, expect, it } from "vitest";
import { INVOICE_INPUT_LIMITS, validateInvoiceDraft } from "./invoice-validation";

const client = { name: "Maya Chen", email: "maya@example.com" };
const dates = { issue: "2026-08-18", due: "2026-09-01" };
const item = [{ description: "Creative direction", quantity: "1", rate: "1850" }];

describe("validateInvoiceDraft", () => {
  it("publishes shared input limits", () => expect(INVOICE_INPUT_LIMITS).toEqual({ clientName: 200, description: 500, quantity: 32, rate: 32, notes: 1000 }));
  it("accepts a complete draft", () => expect(validateInvoiceDraft(client, dates, item)).toBeNull());
  it("rejects an invalid client email", () => expect(validateInvoiceDraft({ ...client, email: "not-an-email" }, dates, item)).toContain("valid email"));
  it("rejects a due date before the issue date", () => expect(validateInvoiceDraft(client, { issue: "2026-09-01", due: "2026-08-18" }, item)).toContain("due date"));
  it("rejects malformed calendar dates", () => expect(validateInvoiceDraft(client, { issue: "2026-02-30", due: "2026-03-01" }, item)).toContain("valid dates"));
  it("rejects non-decimal numeric formats and empty rates", () => {
    expect(validateInvoiceDraft(client, dates, [{ description: "Work", quantity: "1e2", rate: "10" }])).toContain("line item");
    expect(validateInvoiceDraft(client, dates, [{ description: "Work", quantity: "1", rate: "" }])).toContain("line item");
  });
  it("rejects incomplete or non-positive line items", () => expect(validateInvoiceDraft(client, dates, [{ description: "", quantity: "0", rate: "-1" }])).toContain("line item"));

  it("rejects oversized client and line-item values", () => {
    expect(validateInvoiceDraft({ ...client, name: "x".repeat(201) }, dates, item)).toContain("client");
    expect(validateInvoiceDraft(client, dates, [{ description: "x".repeat(501), quantity: "1", rate: "10" }])).toContain("line item");
  });
});
