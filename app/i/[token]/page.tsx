import Link from "next/link";
import PublicPaymentAction from "@/components/PublicPaymentAction";

export const metadata = {
  title: "Invoice · Junvo",
  robots: { index: false, follow: false },
};

const money = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
type PublicState = "open" | "paid" | "void" | "unavailable";
type PaymentState = "ready" | "unavailable" | "processing" | "failed";

export default async function PublicInvoicePage({ searchParams }: { searchParams: Promise<{ state?: string; payment?: string }> }) {
  const params = await searchParams;
  const requestedState = params.state;
  const paymentState: PaymentState = params.payment === "unavailable" || params.payment === "processing" || params.payment === "failed" ? params.payment : "ready";
  const state: PublicState = requestedState === "paid" || requestedState === "void" || requestedState === "unavailable" ? requestedState : "open";
  if (state === "unavailable") return <PublicFrame><div className="public-message"><div className="success-icon">?</div><h1>We couldn’t find that invoice</h1><p className="subtle">This secure link may have expired or been replaced. Ask the sender for a new link.</p><Link className="button secondary" href="/" style={{ marginTop: 24 }}>Back to Junvo</Link></div></PublicFrame>;
  const isPaid = state === "paid";
  const isVoid = state === "void";
  const status = isPaid ? "paid" : isVoid ? "void" : "sent";
  return <PublicFrame><div className="public-shell"><div className="public-hero"><div><div className="eyebrow">From Junvo Studio</div><h1>Invoice INV-1043</h1><p className="subtle" style={{ marginTop: 8 }}>For Maya Chen · Due September 1, 2026</p></div><div style={{ textAlign: "right" }}><span className={`status ${status}`}>{isPaid ? "Paid" : isVoid ? "Voided" : "Open"}</span><div className="public-amount">{money(185000)}</div></div></div><div className="public-document"><div className="invoice-preview"><div className="invoice-preview-top"><div><strong style={{ fontSize: 20 }}>Junvo Studio</strong><p className="subtle" style={{ marginTop: 5 }}>hello@junvostudio.com</p></div><div className="invoice-title"><strong>INVOICE</strong><span>INV-1043</span></div></div><div className="preview-meta"><div><span>BILLED TO</span><strong>Maya Chen</strong><strong style={{ color: "var(--ink-500)", fontWeight: 500 }}>maya@northstar.co</strong></div><div style={{ textAlign: "right" }}><span>ISSUED</span><strong>Aug 18, 2026</strong><span style={{ marginTop: 8 }}>DUE Sep 1, 2026</span></div></div><table className="preview-table"><thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody><tr><td>Brand strategy and creative direction</td><td>1</td><td>{money(185000)}</td><td>{money(185000)}</td></tr></tbody></table><div className="preview-totals"><div className="preview-total"><span className="preview-total-label">Subtotal</span><span>{money(185000)}</span></div><div className="preview-total final"><span>{isPaid ? "Paid" : "Total due"}</span><span>{money(185000)}</span></div></div><div className="preview-note">Thank you for working with Junvo Studio.</div></div></div>{isVoid ? <div className="public-state-note danger-state"><strong>This invoice was voided</strong><span>This invoice is no longer payable. Contact Junvo Studio if you have questions.</span></div> : isPaid ? <div className="public-state-note success-state"><strong>Payment received</strong><span>This invoice has been paid. Keep this page for your records.</span></div> : paymentState === "unavailable" ? <div className="public-state-note danger-state"><strong>Online payment is unavailable</strong><span>Contact Junvo Studio for another payment method.</span></div> : paymentState === "processing" ? <div className="public-state-note"><strong>Payment processing</strong><span>Your payment is still being confirmed. You do not need to try again immediately.</span></div> : <PublicPaymentAction amount={money(185000)} retry={paymentState === "failed"} />}<p className="subtle" style={{ textAlign: "center", marginTop: 20 }}><Link href="/">Powered by Junvo</Link></p></div></PublicFrame>;
}

function PublicFrame({ children }: { children: React.ReactNode }) { return <main className="public-page"><header className="public-header"><div className="wordmark"><span className="wordmark-mark" />Junvo</div><span className="subtle">Secure invoice</span></header>{children}</main>; }
