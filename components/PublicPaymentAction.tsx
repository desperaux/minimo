"use client";

import { useState } from "react";

export default function PublicPaymentAction({ amount, retry = false }: { amount: string; retry?: boolean }) {
  const [notice, setNotice] = useState("");
  if (notice) return <div className="public-state-note danger-state" role="status"><strong>Online payment is not connected</strong><span>{notice}</span></div>;
  return <div className="public-actions"><div><strong>{retry ? "Try again" : "Ready when you are"}</strong><span>{retry ? "Your balance is unchanged." : "Payments are securely handled by Stripe."}</span></div><button className="button primary" onClick={() => setNotice("Contact minimo Studio for another payment method while payment setup is being completed.")}>{retry ? "Try again" : `Pay ${amount}`}</button></div>;
}
