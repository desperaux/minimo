import { describe, expect, it } from "vitest";
import { calculateInvoiceBreakdown, calculateInvoiceTotals } from "./invoice-calculation";

describe("invoice calculation", () => {
  it("calculates exact whole-unit lines without floating point math", () => {
    expect(calculateInvoiceTotals([{ quantity: "2", unitPriceMinor: 185000 }], { quantityScale: 2, rounding: "half_up" })).toEqual({ lineTotalsMinor: [370000], subtotalMinor: 370000 });
  });

  it("rounds half up per line and then sums lines", () => {
    expect(calculateInvoiceTotals([{ quantity: "0.005", unitPriceMinor: 100 }, { quantity: "0.005", unitPriceMinor: 100 }], { quantityScale: 3, rounding: "half_up" })).toEqual({ lineTotalsMinor: [1, 1], subtotalMinor: 2 });
  });

  it("supports explicit round-down policy", () => {
    expect(calculateInvoiceTotals([{ quantity: "0.009", unitPriceMinor: 100 }], { quantityScale: 3, rounding: "down" })).toEqual({ lineTotalsMinor: [0], subtotalMinor: 0 });
  });

  it("rejects quantities beyond the selected precision", () => {
    expect(() => calculateInvoiceTotals([{ quantity: "1.001", unitPriceMinor: 100 }], { quantityScale: 2, rounding: "half_up" })).toThrow("at most 2");
  });

  it("rejects unsafe calculated totals", () => {
    expect(() => calculateInvoiceTotals([{ quantity: "2", unitPriceMinor: Number.MAX_SAFE_INTEGER }], { quantityScale: 0, rounding: "half_up" })).toThrow("safe integer");
  });

  it("uses four-decimal quantities and rounds discounted taxable lines half up", () => {
    expect(calculateInvoiceBreakdown({
      items: [{ quantity: "1.2345", unitPriceMinor: 100, lineDiscountBps: 1_000, taxRateBps: 500 }],
    })).toEqual({
      lines: [{ lineSubtotalMinor: 111, lineDiscountMinor: 12, invoiceDiscountMinor: 0, taxableMinor: 111, taxMinor: 6, totalMinor: 117 }],
      subtotalMinor: 111,
      discountMinor: 12,
      taxMinor: 6,
      totalMinor: 117,
    });
  });

  it("calculates tax after line and invoice discounts", () => {
    expect(calculateInvoiceBreakdown({
      invoiceDiscountBps: 1_000,
      items: [
        { quantity: "1", unitPriceMinor: 100, taxRateBps: 1_000 },
        { quantity: "1", unitPriceMinor: 100, taxRateBps: 1_000 },
      ],
    })).toEqual({
      lines: [
        { lineSubtotalMinor: 100, lineDiscountMinor: 0, invoiceDiscountMinor: 10, taxableMinor: 90, taxMinor: 9, totalMinor: 99 },
        { lineSubtotalMinor: 100, lineDiscountMinor: 0, invoiceDiscountMinor: 10, taxableMinor: 90, taxMinor: 9, totalMinor: 99 },
      ],
      subtotalMinor: 200,
      discountMinor: 20,
      taxMinor: 18,
      totalMinor: 198,
    });
  });

  it("allocates invoice-discount remainders deterministically", () => {
    const result = calculateInvoiceBreakdown({
      invoiceDiscountBps: 3_333,
      items: [
        { quantity: "1", unitPriceMinor: 100 },
        { quantity: "1", unitPriceMinor: 100 },
      ],
    });
    expect(result.lines.map(line => line.invoiceDiscountMinor)).toEqual([34, 33]);
    expect(result.discountMinor).toBe(67);
  });

  it("rejects discount and tax rates above 100 percent", () => {
    expect(() => calculateInvoiceBreakdown({ items: [{ quantity: "1", unitPriceMinor: 100, taxRateBps: 10_001 }] })).toThrow("Tax rate");
    expect(() => calculateInvoiceBreakdown({ items: [{ quantity: "1", unitPriceMinor: 100, lineDiscountBps: 10_001 }] })).toThrow("Line discount");
  });
});
