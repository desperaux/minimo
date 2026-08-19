"use client";

import { useEffect, useRef, useState } from "react";
import { normalizeEmailForLookup } from "@/lib/email";
import { getSavedClients, upsertSavedClient, type SavedClient } from "@/lib/local-store";

type Client = { name: string; email: string; company: string };

export default function ClientSection({
  client,
  setClient,
}: {
  client: Client;
  setClient: (client: Client) => void;
}) {
  const [mode, setMode] = useState<"pick" | "new">("pick");
  const [search, setSearch] = useState("");
  const [savedClients, setSavedClients] = useState<SavedClient[]>([]);
  const [form, setForm] = useState<Client>({ name: "", email: "", company: "" });
  const [formError, setFormError] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSavedClients(getSavedClients());
  }, []);

  useEffect(() => {
    if (formError) errorRef.current?.focus();
  }, [formError]);

  const filtered = savedClients.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q)
    );
  });

  const selectClient = (c: SavedClient) => {
    setClient({ name: c.name, email: c.email, company: c.company });
    setSearch("");
  };

  const saveNewClient = () => {
    if (!form.name.trim()) return setFormError("Please enter the client's name and a valid email.");
    try { normalizeEmailForLookup(form.email); } catch {
      return setFormError("Please enter the client's name and a valid email.");
    }
    const entry = upsertSavedClient({ name: form.name.trim(), email: form.email.trim(), company: form.company.trim() });
    setSavedClients(getSavedClients());
    setClient({ name: entry.name, email: entry.email, company: entry.company });
    setForm({ name: "", email: "", company: "" });
    setFormError("");
    setMode("pick");
  };

  const isSelected = (c: SavedClient) =>
    c.email.toLowerCase() === client.email.toLowerCase();

  return (
    <section className="form-section">
      <div className="section-title">
        <h2>Client</h2>
        {mode === "pick" ? (
          <button
            className="button tertiary"
            onClick={() => setMode("new")}
            type="button"
          >
            ＋ New client
          </button>
        ) : (
          <button
            className="button tertiary"
            onClick={() => { setMode("pick"); setFormError(""); }}
            type="button"
          >
            Cancel
          </button>
        )}
      </div>

      {mode === "pick" ? (
        <div className="client-picker">
          {/* Search box */}
          <div className="client-search-wrap">
            <svg className="client-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="client-search-input"
              placeholder="Search clients…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search saved clients"
            />
            {search && (
              <button
                type="button"
                className="client-search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Client list */}
          <div className="client-list" role="listbox" aria-label="Saved clients">
            {filtered.length === 0 ? (
              <p className="client-empty subtle">
                {search ? `No clients matching "${search}"` : "No saved clients yet."}
              </p>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected(c)}
                  className={`client-row${isSelected(c) ? " selected" : ""}`}
                  onClick={() => selectClient(c)}
                >
                  <span className="client-avatar">{c.name.charAt(0).toUpperCase()}</span>
                  <span className="client-row-info">
                    <span className="client-row-name">{c.name}</span>
                    <span className="client-row-sub subtle">{c.company || c.email}</span>
                  </span>
                  {isSelected(c) && (
                    <svg className="client-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Selected client summary */}
          {client.name && (
            <div className="client-selected-summary">
              <span className="subtle">Billing to:</span>
              <strong>{client.name}</strong>
              <span className="subtle">{client.email}</span>
            </div>
          )}
        </div>
      ) : (
        /* New client inline form */
        <div className="inline-form">
          <p className="subtle">Create a client without leaving the invoice.</p>
          {formError && (
            <div ref={errorRef} className="field-error" role="alert" tabIndex={-1}>
              {formError}
            </div>
          )}
          <div className="field-grid">
            <div className="field">
              <label htmlFor="inline-client-name">Name</label>
              <input
                id="inline-client-name"
                value={form.name}
                onChange={(e) => { setForm({ ...form, name: e.target.value }); setFormError(""); }}
              />
            </div>
            <div className="field">
              <label htmlFor="inline-client-email">Email</label>
              <input
                id="inline-client-email"
                type="email"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setFormError(""); }}
              />
            </div>
            <div className="field full">
              <label htmlFor="inline-client-company">
                Company <span className="subtle">(Optional)</span>
              </label>
              <input
                id="inline-client-company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>
          </div>
          <button className="button secondary" onClick={saveNewClient} type="button">
            Use this client
          </button>
        </div>
      )}
    </section>
  );
}
