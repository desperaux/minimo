"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { normalizeEmailForLookup } from "@/lib/email";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [business, setBusiness] = useState({ name: "", email: "", terms: "14" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);

  const next = () => {
    if (step === 1 && !business.name.trim()) return setError("Add your business name and a valid support email to continue.");
    if (step === 1) {
      try { normalizeEmailForLookup(business.email); } catch { return setError("Add your business name and a valid support email to continue."); }
    }
    setError("");
    setStep(current => Math.min(4, current + 1));
  };

  const finish = async () => {
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/v1/onboarding", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ businessName: business.name, supportEmail: business.email, paymentTermsDays: Number(business.terms), timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }) });
      const result = await response.json() as { ok: boolean; error?: { message?: string } };
      if (!response.ok || !result.ok) throw new Error(result.error?.message || "We could not save your workspace. Try again.");
      window.location.assign("/");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We could not save your workspace. Try again.");
      setSaving(false);
    }
  };

  return <main className="onboarding-page"><header className="onboarding-header"><Link className="wordmark" href="/marketing"><span className="wordmark-mark" />minimo</Link><span className="subtle">Step {step} of 4</span></header><div className="onboarding-progress"><span style={{ width: `${step * 25}%` }} /></div><section className="onboarding-card">
    {step === 1 && <><div className="eyebrow">Let’s get started</div><h1>Tell us about your business</h1><p className="subtle">These details appear on your invoices and payment pages.</p>{error && <div ref={errorRef} className="error-summary" role="alert" tabIndex={-1}><strong>Check your details</strong><span>{error}</span></div>}<div className="form-section" style={{ marginTop: 28 }}><div className="field"><label htmlFor="business-name">Business or display name</label><input id="business-name" autoFocus value={business.name} placeholder="minimo Studio" onChange={e => { setBusiness({ ...business, name: e.target.value }); setError(""); }} /></div><div className="field"><label htmlFor="business-email">Support email</label><input id="business-email" type="email" value={business.email} placeholder="hello@yourbusiness.com" onChange={e => { setBusiness({ ...business, email: e.target.value }); setError(""); }} /></div></div><button className="button primary" style={{ width: "100%", marginTop: 28 }} onClick={next}>Continue</button></>}
    {step === 2 && <><div className="eyebrow">Invoice defaults</div><h1>Choose a helpful starting point</h1><p className="subtle">You can change this for any invoice later.</p><div className="form-section" style={{ marginTop: 28 }}><div className="field"><label htmlFor="terms">Default payment terms</label><select id="terms" value={business.terms} onChange={e => setBusiness({ ...business, terms: e.target.value })}><option value="7">Due in 7 days</option><option value="14">Due in 14 days</option><option value="30">Due in 30 days</option></select></div><div className="field"><label htmlFor="currency">Currency</label><select id="currency" defaultValue="USD"><option>USD — US Dollar</option></select></div></div><div className="onboarding-actions"><button className="button secondary" onClick={() => setStep(1)}>Back</button><button className="button primary" onClick={next}>Continue</button></div></>}
    {step === 3 && <><div className="eyebrow">Optional branding</div><h1>Make invoices feel like yours</h1><p className="subtle">You can add a logo and accent color now, or come back later.</p><div className="logo-drop"><div className="logo-placeholder" aria-hidden="true">＋</div><strong>Logo upload isn’t connected yet</strong><span>Logo storage will be added with secure object storage. Optional.</span></div><div className="onboarding-actions"><button className="button secondary" onClick={() => setStep(2)}>Back</button><button className="button primary" onClick={next}>Skip for now</button></div></>}
    {step === 4 && <><div className="success-icon">✓</div><h1>You’re ready to send your first invoice</h1><p className="subtle">Your workspace is set up. Online payments can be connected when you’re ready.</p>{error && <div ref={errorRef} className="error-summary" role="alert" tabIndex={-1}><strong>Could not finish setup</strong><span>{error}</span></div>}<div className="onboarding-summary"><div><span>Business</span><strong>{business.name || "Your business"}</strong></div><div><span>Default terms</span><strong>Due in {business.terms} days</strong></div></div><button className="button primary" style={{ width: "100%", marginTop: 28 }} onClick={finish} disabled={saving}>{saving ? "Saving workspace…" : "Save workspace and open dashboard"}</button></>}
  </section></main>;
}
