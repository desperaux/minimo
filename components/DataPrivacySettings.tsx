"use client";

import { useState } from "react";

export default function DataPrivacySettings() {
  const [notice, setNotice] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [phrase, setPhrase] = useState("");
  const requestExport = () => setNotice("Your export request is ready for the data service. No files were generated in this prototype.");
  const requestClosure = () => {
    if (phrase !== "CLOSE MY ACCOUNT") return;
    setNotice("Closure request captured for review. Retained financial records would remain protected under the documented retention policy.");
    setConfirming(false);
    setPhrase("");
  };
  return <section className="card data-privacy-card"><h2>Data &amp; privacy</h2><p className="subtle" style={{ marginTop: 6 }}>Export your records or review what account closure means before taking action.</p>{notice && <div className="inline-notice" role="status" style={{ marginTop: 18, marginBottom: 0 }}>{notice}</div>}<div className="data-action"><div><strong>Export your data</strong><span>Download clients, invoices, payments, and account information.</span></div><button className="button secondary" onClick={requestExport}>Request export</button></div><div className="data-action danger-action"><div><strong>Close your account</strong><span>Access is removed first. Financial and audit records may remain for lawful retention.</span></div>{confirming ? <div className="closure-confirm"><label htmlFor="closure-phrase">Type CLOSE MY ACCOUNT</label><input id="closure-phrase" value={phrase} onChange={e => setPhrase(e.target.value)} /><button className="button" disabled={phrase !== "CLOSE MY ACCOUNT"} onClick={requestClosure}>Confirm closure</button></div> : <button className="button secondary" onClick={() => setConfirming(true)}>Review closure</button>}</div></section>;
}
