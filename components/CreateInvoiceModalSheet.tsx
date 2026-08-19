"use client";

import React, { useEffect, useRef, useState } from "react";
import ClientSection from "./ClientSection";
import { getSavedServices, addSavedService } from "@/lib/local-store";

const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

type Client = {
  name: string;
  email: string;
  company: string;
};

type Item = {
  description: string;
  quantity: string;
  rate: string;
};

/** Autocomplete dropdown for service descriptions */
function ServiceAutocomplete({
  value,
  onChange,
  placeholder,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [savedServices, setSavedServices] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useRef(`svc-list-${Math.random().toString(36).slice(2)}`).current;

  useEffect(() => {
    setSavedServices(getSavedServices());
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (v: string) => {
    onChange(v);
    if (v.trim().length > 0) {
      const q = v.toLowerCase();
      setSuggestions(savedServices.filter((s) => s.toLowerCase().includes(q) && s !== v));
      setOpen(true);
    } else {
      setSuggestions(savedServices);
      setOpen(true);
    }
  };

  const handleFocus = () => {
    const q = value.toLowerCase();
    setSuggestions(
      value.trim()
        ? savedServices.filter((s) => s.toLowerCase().includes(q) && s !== value)
        : savedServices
    );
    setOpen(true);
  };

  const pick = (s: string) => {
    onChange(s);
    setOpen(false);
  };

  return (
    <div className="svc-autocomplete" ref={containerRef}>
      <input
        aria-label={ariaLabel}
        aria-autocomplete="list"
        aria-controls={open && suggestions.length > 0 ? listId : undefined}
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={handleFocus}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
          if (e.key === "Enter" && value.trim()) {
            addSavedService(value);
            setSavedServices(getSavedServices());
            setOpen(false);
          }
        }}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <ul id={listId} className="svc-dropdown" role="listbox">
          {suggestions.map((s) => (
            <li
              key={s}
              role="option"
              aria-selected={s === value}
              className="svc-option"
              onMouseDown={(e) => { e.preventDefault(); pick(s); }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CreateInvoiceModalSheet({
  isOpen,
  onClose,
  client,
  setClient,
  dates,
  setDates,
  items,
  updateItem,
  addItem,
  removeItem,
  notes,
  setNotes,
  subtotal,
  error,
  storageWarning,
  onReview,
}: {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  setClient: (client: Client) => void;
  dates: { issue: string; due: string };
  setDates: (dates: { issue: string; due: string }) => void;
  items: Item[];
  updateItem: (index: number, field: keyof Item, value: string) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  notes: string;
  setNotes: (notes: string) => void;
  subtotal: number;
  error: string;
  storageWarning: string;
  onReview: () => void;
}) {
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error && isOpen) {
      errorRef.current?.focus();
    }
  }, [error, isOpen]);

  // Handle ESC key to dismiss modal sheet
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-sheet-title"
    >
      <div className="modal-sheet">
        {/* Top iOS / Threads-style Sheet Header */}
        <header className="modal-sheet-header">
          <button
            type="button"
            className="sheet-cancel-btn"
            onClick={onClose}
            aria-label="Cancel invoice creation"
          >
            Cancel
          </button>
          <h2 id="modal-sheet-title" className="sheet-title">
            New invoice
          </h2>
          <button
            type="button"
            className="sheet-action-btn"
            onClick={onReview}
          >
            Review
          </button>
        </header>

        {/* Sheet Body Content */}
        <div className="modal-sheet-body">
          {/* Creator Profile / Studio Eyebrow */}
          <div className="sheet-creator-badge">
            <div className="sheet-avatar">J</div>
            <div className="sheet-creator-info">
              <strong className="sheet-creator-name">minimo Studio</strong>
              <span className="sheet-creator-sub subtle">hello@minimostudio.com</span>
            </div>
          </div>

          {storageWarning && (
            <div className="error-summary" role="status">
              <strong>Draft save needs attention</strong>
              <span>{storageWarning}</span>
            </div>
          )}

          {error && (
            <div ref={errorRef} className="error-summary" role="alert" tabIndex={-1}>
              <strong>Review your invoice</strong>
              <span>{error}</span>
            </div>
          )}

          {/* Client Details */}
          <ClientSection client={client} setClient={setClient} />

          {/* Line Items */}
          <section className="form-section">
            <div className="section-title">
              <h2>Line items</h2>
              <span className="subtle">USD</span>
            </div>
            <div className="line-items">
              {items.map((item, index) => (
                <div className="line-item" key={index}>
                  <div className="field line-item-desc">
                    <label>{index === 0 ? "Description" : ""}</label>
                    <ServiceAutocomplete
                      ariaLabel={`Item ${index + 1} description`}
                      value={item.description}
                      placeholder="What did you do?"
                      onChange={(v) => updateItem(index, "description", v)}
                    />
                  </div>
                  <div className="field line-item-qty">
                    <label>{index === 0 ? "Qty" : ""}</label>
                    <input
                      aria-label={`Item ${index + 1} quantity`}
                      inputMode="decimal"
                      value={item.quantity}
                      onChange={e => updateItem(index, "quantity", e.target.value)}
                    />
                  </div>
                  <div className="field line-item-rate">
                    <label>{index === 0 ? "Rate" : ""}</label>
                    <input
                      aria-label={`Item ${index + 1} rate`}
                      inputMode="decimal"
                      value={item.rate}
                      onChange={e => updateItem(index, "rate", e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="remove"
                    aria-label={`Remove item ${index + 1}`}
                    onClick={() => removeItem(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="button tertiary"
              style={{ justifySelf: "start" }}
              onClick={addItem}
            >
              ＋ Add line item
            </button>
          </section>

          {/* Issue & Due Dates */}
          <section className="form-section">
            <div className="section-title">
              <h2>Dates</h2>
            </div>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="modal-issue-date">Issue date</label>
                <input
                  id="modal-issue-date"
                  type="date"
                  value={dates.issue}
                  onChange={e => setDates({ ...dates, issue: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="modal-due-date">Due date</label>
                <input
                  id="modal-due-date"
                  type="date"
                  value={dates.due}
                  onChange={e => setDates({ ...dates, due: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Notes & Payment Options */}
          <section className="form-section">
            <div className="section-title">
              <h2>Options &amp; Notes</h2>
            </div>
            <div className="field">
              <label htmlFor="modal-notes">
                Note to client <span className="subtle">(Optional)</span>
              </label>
              <textarea
                id="modal-notes"
                placeholder="Add payment terms, bank details, or a thank you note..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
            <label style={{ display: "flex", gap: 10, alignItems: "center", fontWeight: 600, color: "var(--ink-950)" }}>
              <input
                type="checkbox"
                defaultChecked
                style={{ width: 18, minHeight: 18, accentColor: "var(--brand-green)" }}
              />
              Offer online payment
            </label>
          </section>

          {/* Bottom Sheet Summary Actions */}
          <div className="sheet-footer-actions">
            <div className="sheet-total-display">
              <span className="subtle">Total amount:</span>
              <strong className="sheet-total-val">{money(subtotal)}</strong>
            </div>
            <button
              type="button"
              className="button primary"
              style={{ width: "100%" }}
              onClick={onReview}
            >
              Review and send →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
