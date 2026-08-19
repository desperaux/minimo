import { createHash } from "node:crypto";
import type { Money } from "./api-contracts";
import { canonicalJson } from "./canonical-json";

export type InvoiceParty = { displayName: string; email: string; companyName?: string; address?: string };
export type InvoiceItemSnapshot = { description: string; quantity: string; unitPrice: Money; lineTotal: Money };
export type InvoiceDocument = {
  templateVersion: number;
  calculationVersion: number;
  seller: InvoiceParty;
  client: InvoiceParty;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: "USD";
  items: InvoiceItemSnapshot[];
  subtotal: Money;
  discount: Money;
  tax: Money;
  total: Money;
  amountPaid: Money;
  amountDue: Money;
  notes?: string;
};

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return value;
}

export function createInvoiceDocument(input: InvoiceDocument): InvoiceDocument {
  return deepFreeze(structuredClone(input));
}

export function hashInvoiceDocument(document: InvoiceDocument): string {
  return createHash("sha256").update(canonicalJson(document), "utf8").digest("hex");
}
