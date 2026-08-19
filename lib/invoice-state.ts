export type InvoiceStatus = "draft" | "queued" | "sent" | "delivery_failed" | "paid" | "void";

const transitions: Record<InvoiceStatus, readonly InvoiceStatus[]> = {
  draft: ["queued"],
  queued: ["sent", "delivery_failed"],
  sent: ["paid", "void"],
  delivery_failed: ["queued", "void"],
  paid: [],
  void: [],
};

export function canTransitionInvoice(from: InvoiceStatus, to: InvoiceStatus): boolean {
  return transitions[from]?.includes(to) ?? false;
}

export function transitionInvoice(from: InvoiceStatus, to: InvoiceStatus): InvoiceStatus {
  if (!canTransitionInvoice(from, to)) throw new Error(`Invalid invoice status transition: ${from} -> ${to}`);
  return to;
}

export function isReminderEligible(status: InvoiceStatus): boolean {
  return status === "sent" || status === "delivery_failed";
}
