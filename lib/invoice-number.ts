export type InvoiceNumberPolicy = {
  prefix?: string;
  width?: number;
};

const DEFAULT_PREFIX = "INV-";
const DEFAULT_WIDTH = 6;

function validateSequence(sequence: number): void {
  if (!Number.isSafeInteger(sequence) || sequence < 1) throw new Error("Invoice sequence must be a positive safe integer.");
}

function validatePolicy(policy: InvoiceNumberPolicy): Required<InvoiceNumberPolicy> {
  const prefix = policy.prefix ?? DEFAULT_PREFIX;
  const width = policy.width ?? DEFAULT_WIDTH;
  if (!/^[A-Z0-9][A-Z0-9_-]{0,15}$/.test(prefix)) throw new Error("Invoice prefix must use 1 to 16 uppercase letters, numbers, underscores, or hyphens.");
  if (!Number.isInteger(width) || width < 1 || width > 12) throw new Error("Invoice number width must be an integer from 1 to 12.");
  return { prefix, width };
}

export function formatInvoiceNumber(sequence: number, policy: InvoiceNumberPolicy = {}): string {
  validateSequence(sequence);
  const { prefix, width } = validatePolicy(policy);
  return `${prefix}${String(sequence).padStart(width, "0")}`;
}

export function isIssuedInvoiceNumber(value: string, policy: InvoiceNumberPolicy = {}): boolean {
  if (typeof value !== "string") return false;
  const { prefix, width } = validatePolicy(policy);
  const pattern = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\d{${width},}$`);
  return pattern.test(value);
}

export function nextInvoiceSequence(current: number | null): number {
  if (current !== null) validateSequence(current);
  const next = (current ?? 0) + 1;
  validateSequence(next);
  return next;
}
