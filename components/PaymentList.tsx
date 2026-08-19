"use client";

import { useState } from "react";

const payments = [
  { invoice: "INV-1040", client: "Jon Bell", amount: 95000, date: "Aug 12, 2026", status: "succeeded", source: "Stripe" },
  { invoice: "INV-1039", client: "Maya Chen", amount: 120000, date: "Jul 22, 2026", status: "succeeded", source: "Stripe" },
];

const money = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

export default function PaymentList() {
  const [notice, setNotice] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <>
      <header className="dashboard-hero-header">
        <h1>Payments</h1>
        <p className="subtle" style={{ marginTop: 4 }}>
          Track confirmed payments without treating minimo as the holder of funds.
        </p>
      </header>

      {notice && <div className="inline-notice" role="status">{notice}</div>}

      <div className="priority-banner" style={{ marginBottom: 24 }}>
        <div className="priority-header-row">
          <div className="priority-icon-circle">✓</div>
          <span className="priority-eyebrow">Payment Gateway</span>
        </div>
        <div className="priority-body-row">
          <h2>Stripe payments are not connected</h2>
          <p>Connect a seller account before offering online payment on new invoices.</p>
        </div>
        <div className="priority-bottom-row">
          <span className="subtle" style={{ fontSize: 13 }}>Direct payouts to bank</span>
          <button
            className="button primary"
            onClick={() => setNotice("Stripe onboarding will be enabled after the account model and payment decisions are finalized.")}
          >
            Connect Stripe
          </button>
        </div>
      </div>

      <section className="summary-section" aria-label="Payment statistics">
        <div
          className="summary-grid summary-carousel"
          onScroll={e => {
            const el = e.currentTarget;
            const scrollLeft = el.scrollLeft;
            const cardWidth = el.offsetWidth * 0.68;
            if (cardWidth > 0) {
              const slide = Math.round(scrollLeft / cardWidth);
              setActiveSlide(Math.min(2, Math.max(0, slide)));
            }
          }}
        >
          <div className="summary-card">
            <div className="summary-label">Paid this month</div>
            <div className="summary-value">{money(95000)}</div>
            <div className="summary-note">1 invoice paid</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Successful payments</div>
            <div className="summary-value">2</div>
            <div className="summary-note">Total across lifetime</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Processing</div>
            <div className="summary-value">0</div>
            <div className="summary-note">No pending payments</div>
          </div>
        </div>
        <div className="carousel-dots" aria-hidden="true">
          <span className={`dot ${activeSlide === 0 ? "active" : ""}`} />
          <span className={`dot ${activeSlide === 1 ? "active" : ""}`} />
          <span className={`dot ${activeSlide === 2 ? "active" : ""}`} />
        </div>
      </section>

      <section aria-labelledby="payments-heading" className="recent-invoices-section">
        <div className="section-heading">
          <h2 id="payments-heading">Payment history</h2>
          <span className="subtle" style={{ fontSize: 12.5 }}>Verified events only</span>
        </div>
        <div className="recent-invoices-card-group" role="list" aria-label="Payment transactions">
          {payments.map(payment => (
            <div key={payment.invoice} className="recent-invoice-row" role="listitem">
              <div className="recent-invoice-left">
                <span className="invoice-number">{payment.invoice}</span>
                <span className="client-name">{payment.client}</span>
                <span className="invoice-date">{payment.date}</span>
              </div>
              <div className="recent-invoice-right">
                <span className="invoice-amount">{money(payment.amount)}</span>
                <span className="status paid">
                  <span className="status-dot" />
                  Paid
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
