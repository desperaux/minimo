import { describe, expect, it } from "vitest";
import { formatInvoiceNumber, isIssuedInvoiceNumber, nextInvoiceSequence } from "./invoice-number";

describe("invoice numbering", () => {
  it("formats the accepted default sequence", () => {
    expect(formatInvoiceNumber(1)).toBe("INV-000001");
    expect(formatInvoiceNumber(42)).toBe("INV-000042");
  });

  it("supports a bounded workspace prefix and width", () => {
    expect(formatInvoiceNumber(12, { prefix: "ACME-", width: 4 })).toBe("ACME-0012");
    expect(formatInvoiceNumber(12345, { width: 3 })).toBe("INV-12345");
  });

  it("validates issued numbers without accepting drafts or malformed values", () => {
    expect(isIssuedInvoiceNumber("INV-000001")).toBe(true);
    expect(isIssuedInvoiceNumber("INV-1")).toBe(false);
    expect(isIssuedInvoiceNumber("draft-123")).toBe(false);
    expect(isIssuedInvoiceNumber("INV-000001", { prefix: "ACME-" })).toBe(false);
  });

  it("increments only positive safe sequences", () => {
    expect(nextInvoiceSequence(null)).toBe(1);
    expect(nextInvoiceSequence(41)).toBe(42);
    expect(() => nextInvoiceSequence(0)).toThrow("positive safe integer");
  });

  it("rejects invalid sequence and policy values", () => {
    expect(() => formatInvoiceNumber(0)).toThrow("positive safe integer");
    expect(() => formatInvoiceNumber(1, { prefix: "bad prefix" })).toThrow("Invoice prefix");
    expect(() => formatInvoiceNumber(1, { width: 0 })).toThrow("Invoice number width");
  });
});
