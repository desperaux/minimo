export type CalculationRounding = "half_up" | "down";

export type CalculationPolicy = {
  quantityScale: number;
  rounding: CalculationRounding;
};

export type CalculationItem = { quantity: string; unitPriceMinor: number };

export type CalculationResult = { lineTotalsMinor: number[]; subtotalMinor: number };

export type InvoiceCalculationItem = CalculationItem & {
  lineDiscountBps?: number;
  taxRateBps?: number;
  taxable?: boolean;
};

export type InvoiceCalculationInput = {
  items: InvoiceCalculationItem[];
  invoiceDiscountBps?: number;
  currencyMinorDigits?: 0 | 2 | 3;
};

export type InvoiceCalculationBreakdown = {
  lines: Array<{
    lineSubtotalMinor: number;
    lineDiscountMinor: number;
    invoiceDiscountMinor: number;
    taxableMinor: number;
    taxMinor: number;
    totalMinor: number;
  }>;
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  totalMinor: number;
};

const BPS_DENOMINATOR = BigInt(10_000);
const ACCEPTED_QUANTITY_SCALE = 4;

function parseQuantity(quantity: string, scale: number): bigint {
  if (!/^\d+(?:\.\d+)?$/.test(quantity)) throw new Error("Quantity must be a non-negative decimal.");
  const [whole, fraction = ""] = quantity.split(".");
  if (fraction.length > scale) throw new Error(`Quantity supports at most ${scale} decimal places.`);
  return BigInt(whole) * BigInt(10) ** BigInt(scale) + BigInt((fraction + "0".repeat(scale)).slice(0, scale) || "0");
}

function roundProduct(product: bigint, divisor: bigint, rounding: CalculationRounding): bigint {
  const quotient = product / divisor;
  if (rounding === "down" || product % divisor === BigInt(0)) return quotient;
  return product % divisor * BigInt(2) >= divisor ? quotient + BigInt(1) : quotient;
}

function assertBasisPoints(value: number, name: string): void {
  if (!Number.isInteger(value) || value < 0 || value > 10_000) throw new Error(`${name} must be an integer from 0 to 10000 basis points.`);
}

function toSafeNumber(value: bigint, message: string): number {
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error(message);
  return Number(value);
}

function allocateLargestRemainder(total: bigint, weights: bigint[]): bigint[] {
  if (total < BigInt(0)) throw new Error("Allocation values must be non-negative.");
  const weightTotal = weights.reduce((sum, weight) => sum + weight, BigInt(0));
  if (weightTotal === BigInt(0)) return weights.map(() => BigInt(0));

  const allocations = weights.map(weight => total * weight / weightTotal);
  let remainder = total - allocations.reduce((sum, allocation) => sum + allocation, BigInt(0));
  const ranked = weights.map((weight, index) => ({
    index,
    remainder: total * weight % weightTotal,
  })).sort((left, right) => right.remainder > left.remainder ? 1 : right.remainder < left.remainder ? -1 : left.index - right.index);

  for (const entry of ranked) {
    if (remainder === BigInt(0)) break;
    allocations[entry.index] += BigInt(1);
    remainder -= BigInt(1);
  }
  return allocations;
}

function validateCalculationItem(item: InvoiceCalculationItem): void {
  if (!Number.isSafeInteger(item.unitPriceMinor) || item.unitPriceMinor < 0) throw new Error("Unit price must be a non-negative integer minor-unit amount.");
  assertBasisPoints(item.lineDiscountBps ?? 0, "Line discount");
  assertBasisPoints(item.taxRateBps ?? 0, "Tax rate");
  if (item.taxable === false && (item.taxRateBps ?? 0) !== 0) throw new Error("Non-taxable lines cannot have a tax rate.");
}

export function calculateInvoiceBreakdown(input: InvoiceCalculationInput): InvoiceCalculationBreakdown {
  const currencyMinorDigits = input.currencyMinorDigits ?? 2;
  if (![0, 2, 3].includes(currencyMinorDigits)) throw new Error("Currency minor digits must be 0, 2, or 3.");
  const invoiceDiscountBps = input.invoiceDiscountBps ?? 0;
  assertBasisPoints(invoiceDiscountBps, "Invoice discount");

  const lines = input.items.map(item => {
    validateCalculationItem(item);
    const quantity = parseQuantity(item.quantity, ACCEPTED_QUANTITY_SCALE);
    const rawSubtotal = BigInt(item.unitPriceMinor) * quantity;
    const quantityDivisor = BigInt(10) ** BigInt(ACCEPTED_QUANTITY_SCALE);
    const subtotal = roundProduct(rawSubtotal, quantityDivisor, "half_up");
    const lineSubtotal = roundProduct(rawSubtotal * (BPS_DENOMINATOR - BigInt(item.lineDiscountBps ?? 0)), quantityDivisor * BPS_DENOMINATOR, "half_up");
    const lineDiscount = subtotal - lineSubtotal;
    return { item, subtotal, lineSubtotal };
  });

  const eligible = lines.map(line => line.item.lineDiscountBps !== undefined || line.item.taxable !== false ? line.lineSubtotal : BigInt(0));
  const invoiceDiscountTotal = roundProduct(eligible.reduce((sum, value) => sum + value, BigInt(0)) * BigInt(invoiceDiscountBps), BPS_DENOMINATOR, "half_up");
  const allocatedInvoiceDiscount = allocateLargestRemainder(invoiceDiscountTotal, eligible);

  const resultLines = lines.map((line, index) => {
    const invoiceDiscount = allocatedInvoiceDiscount[index];
    const taxable = line.lineSubtotal - invoiceDiscount;
    const tax = line.item.taxable === false ? BigInt(0) : roundProduct(taxable * BigInt(line.item.taxRateBps ?? 0), BPS_DENOMINATOR, "half_up");
    return {
      lineSubtotalMinor: toSafeNumber(line.lineSubtotal, "Calculated line subtotal exceeds the safe integer limit."),
      lineDiscountMinor: toSafeNumber(line.subtotal - line.lineSubtotal, "Calculated line discount exceeds the safe integer limit."),
      invoiceDiscountMinor: toSafeNumber(invoiceDiscount, "Calculated invoice discount exceeds the safe integer limit."),
      taxableMinor: toSafeNumber(taxable, "Calculated taxable amount exceeds the safe integer limit."),
      taxMinor: toSafeNumber(tax, "Calculated tax exceeds the safe integer limit."),
      totalMinor: toSafeNumber(taxable + tax, "Calculated line total exceeds the safe integer limit."),
    };
  });

  const sum = (key: keyof InvoiceCalculationBreakdown["lines"][number]) => resultLines.reduce((total, line) => total + line[key], 0);
  const subtotalMinor = sum("lineSubtotalMinor");
  const discountMinor = sum("lineDiscountMinor") + sum("invoiceDiscountMinor");
  const taxMinor = sum("taxMinor");
  const totalMinor = sum("totalMinor");
  for (const value of [subtotalMinor, discountMinor, taxMinor, totalMinor]) {
    if (!Number.isSafeInteger(value)) throw new Error("Calculated invoice total exceeds the safe integer limit.");
  }
  return { lines: resultLines, subtotalMinor, discountMinor, taxMinor, totalMinor };
}

export function calculateInvoiceTotals(items: CalculationItem[], policy: CalculationPolicy): CalculationResult {
  if (!Number.isInteger(policy.quantityScale) || policy.quantityScale < 0 || policy.quantityScale > 12) throw new Error("Quantity scale must be an integer from 0 to 12.");
  const divisor = BigInt(10) ** BigInt(policy.quantityScale);
  const lineTotalsMinor = items.map(item => {
    if (!Number.isSafeInteger(item.unitPriceMinor) || item.unitPriceMinor < 0) throw new Error("Unit price must be a non-negative integer minor-unit amount.");
    const total = roundProduct(BigInt(item.unitPriceMinor) * parseQuantity(item.quantity, policy.quantityScale), divisor, policy.rounding);
    if (total > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("Calculated line total exceeds the safe integer limit.");
    return Number(total);
  });
  const subtotalMinor = lineTotalsMinor.reduce((sum, lineTotal) => sum + lineTotal, 0);
  if (!Number.isSafeInteger(subtotalMinor)) throw new Error("Calculated subtotal exceeds the safe integer limit.");
  return { lineTotalsMinor, subtotalMinor };
}
