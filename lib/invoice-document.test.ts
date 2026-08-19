import { describe, expect, it } from "vitest";
import { createInvoiceDocument, hashInvoiceDocument } from "./invoice-document";

describe("invoice document snapshot", () => {
  it("preserves the complete presentation model", () => {
    const source = {
      templateVersion: 1,
      calculationVersion: 1,
      seller: { displayName: "minimo Studio", email: "hello@example.com" },
      client: { displayName: "Maya Chen", email: "maya@example.com" },
      invoiceNumber: "INV-1043",
      issueDate: "2026-08-18",
      dueDate: "2026-09-01",
      currency: "USD" as const,
      items: [{ description: "Creative direction", quantity: "1", unitPrice: { amountMinor: 185000, currency: "USD" as const }, lineTotal: { amountMinor: 185000, currency: "USD" as const } }],
      subtotal: { amountMinor: 185000, currency: "USD" as const },
      discount: { amountMinor: 0, currency: "USD" as const },
      tax: { amountMinor: 0, currency: "USD" as const },
      total: { amountMinor: 185000, currency: "USD" as const },
      amountPaid: { amountMinor: 0, currency: "USD" as const },
      amountDue: { amountMinor: 185000, currency: "USD" as const },
      notes: "Thank you.",
    };
    const snapshot = createInvoiceDocument(source);
    expect(snapshot).toEqual(source);
    expect(snapshot).not.toBe(source);
    expect(snapshot.items).not.toBe(source.items);
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot.items)).toBe(true);
  });

  it("creates a stable content hash", () => {
    const first = { invoiceNumber: "INV-1043", total: { amountMinor: 185000, currency: "USD" as const } } as unknown as Parameters<typeof hashInvoiceDocument>[0];
    const second = { total: { currency: "USD" as const, amountMinor: 185000 }, invoiceNumber: "INV-1043" } as unknown as Parameters<typeof hashInvoiceDocument>[0];
    expect(hashInvoiceDocument(first)).toBe(hashInvoiceDocument(second));
    expect(hashInvoiceDocument({ ...first, invoiceNumber: "INV-1044" })).not.toBe(hashInvoiceDocument(first));
  });
});
