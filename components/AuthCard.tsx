"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { normalizeEmailForLookup } from "@/lib/email";

type Mode = "sign-in" | "sign-up" | "recovery";

export default function AuthCard({ mode }: { mode: Mode }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);
  const isRecovery = mode === "recovery";
  const isSignUp = mode === "sign-up";
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);
  if (submitted) return <div className="auth-card"><div className="success-icon">✓</div><h1>{isRecovery ? "Check your inbox" : isSignUp ? "Account ready to finish" : "Signed in"}</h1><p className="subtle">This prototype does not send email or create sessions yet. Continue to the next product step when the auth provider is connected.</p><Link className="button primary" href={isSignUp ? "/onboarding" : "/"} style={{ marginTop: 24 }}>{isSignUp ? "Continue setup" : "Go to dashboard"}</Link></div>;
  return <div className="auth-card"><Link className="wordmark auth-wordmark" href="/marketing"><span className="wordmark-mark" />Junvo</Link><div className="eyebrow">{isRecovery ? "Account recovery" : isSignUp ? "Create your account" : "Welcome back"}</div><h1>{isRecovery ? "Get back into Junvo" : isSignUp ? "Start getting paid" : "Sign in to Junvo"}</h1><p className="subtle">{isRecovery ? "Enter your email and we’ll explain the recovery step." : "Simple invoicing for independent businesses."}</p>{error && <div ref={errorRef} className="error-summary" role="alert" tabIndex={-1}><strong>Check your email</strong><span>{error}</span></div>}<form className="form-section" style={{ marginTop: 26 }} onSubmit={e => { e.preventDefault(); const email = new FormData(e.currentTarget).get("email"); try { normalizeEmailForLookup(String(email)); setError(""); setSubmitted(true); } catch { setError("Enter a valid email address to continue."); } }}><div className="field"><label htmlFor="auth-email">Email</label><input id="auth-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></div>{!isRecovery && <div className="field"><label htmlFor="auth-password">Password</label><input id="auth-password" name="password" type="password" autoComplete={isSignUp ? "new-password" : "current-password"} required minLength={8} placeholder="At least 8 characters" /></div>}<button className="button primary" style={{ width: "100%", marginTop: 8 }}>{isRecovery ? "Send recovery link" : isSignUp ? "Create account" : "Sign in"}</button></form>{!isRecovery && <Link className="auth-link" href="/auth/recover">Forgot your password?</Link>}<p className="auth-switch">{isSignUp ? "Already have an account?" : "New to Junvo?"} <Link href={isSignUp ? "/auth/sign-in" : "/auth/sign-up"}>{isSignUp ? "Sign in" : "Create an account"}</Link></p></div>;
}
