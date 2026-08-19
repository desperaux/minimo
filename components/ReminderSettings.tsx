"use client";

import { useState } from "react";

export default function ReminderSettings() {
  const [rules, setRules] = useState({ before: true, due: true, after: true });
  const toggle = (key: keyof typeof rules) => setRules(current => ({ ...current, [key]: !current[key] }));
  return <section className="card"><h2>Reminders</h2><p className="subtle" style={{ marginTop: 6 }}>A calm default schedule for following up on open invoices.</p><div className="reminder-list"><ReminderRow label="Before the due date" detail="3 days before" active={rules.before} onToggle={() => toggle("before")} /><ReminderRow label="On the due date" detail="The morning it’s due" active={rules.due} onToggle={() => toggle("due")} /><ReminderRow label="After the due date" detail="3 days after" active={rules.after} onToggle={() => toggle("after")} /></div><div className="field" style={{ marginTop: 18 }}><label htmlFor="reminder-gap">Minimum time between reminders</label><select id="reminder-gap" defaultValue="3"><option value="1">1 day</option><option value="3">3 days</option><option value="7">7 days</option></select></div><p className="subtle" style={{ marginTop: 12 }}>Reminders stop automatically when an invoice is paid, voided, bounced, or suppressed.</p></section>;
}

function ReminderRow({ label, detail, active, onToggle }: { label: string; detail: string; active: boolean; onToggle: () => void }) {
  return <div className="reminder-row"><div><strong>{label}</strong><span>{detail}</span></div><button className={`toggle ${active ? "on" : ""}`} aria-label={`${label}: ${active ? "on" : "off"}`} aria-pressed={active} onClick={onToggle}><span /></button></div>;
}
