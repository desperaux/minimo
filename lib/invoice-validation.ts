import { normalizeEmailForLookup } from "./email";

export const INVOICE_INPUT_LIMITS = { clientName: 200, description: 500, quantity: 32, rate: 32, notes: 1000 } as const;

export type DraftClient = { name: string; email: string };
export type DraftDates = { issue: string; due: string };
export type DraftItem = { description: string; quantity: string; rate: string };

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function validateInvoiceDraft(client: DraftClient, dates: DraftDates, items: DraftItem[]): string | null {
  if (!client.name.trim() || client.name.trim().length > INVOICE_INPUT_LIMITS.clientName) return "Add a client name and a valid email address before continuing.";
  try { normalizeEmailForLookup(client.email); } catch { return "Add a client name and a valid email address before continuing."; }
  if (!isIsoDate(dates.issue) || !isIsoDate(dates.due) || dates.due < dates.issue) return "Choose valid dates with a due date on or after the issue date.";
  const invalidItem = items.some(item => item.description.trim().length > INVOICE_INPUT_LIMITS.description || item.quantity.length > INVOICE_INPUT_LIMITS.quantity || item.rate.length > INVOICE_INPUT_LIMITS.rate || !item.description.trim() || !/^\d+(?:\.\d+)?$/.test(item.quantity) || !/^\d+(?:\.\d+)?$/.test(item.rate) || Number(item.quantity) <= 0 || Number(item.rate) < 0 || !Number.isFinite(Number(item.quantity)) || !Number.isFinite(Number(item.rate)));
  if (invalidItem) return "Complete each line item with a description, quantity, and rate.";
  return null;
}
