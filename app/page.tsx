"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { validateInvoiceDraft } from "@/lib/invoice-validation";
import ClientSection from "@/components/ClientSection";
import PaymentList from "@/components/PaymentList";
import ReminderSettings from "@/components/ReminderSettings";
import DataPrivacySettings from "@/components/DataPrivacySettings";
import CreateInvoiceModalSheet from "@/components/CreateInvoiceModalSheet";
import { normalizeEmailForLookup } from "@/lib/email";

type Item = { description: string; quantity: string; rate: string };
type DemoInvoice = {
  number: string;
  client: string;
  email: string;
  date: string;
  due: string;
  amount: number;
  status: "sent" | "overdue" | "paid" | "void";
};

const invoices: DemoInvoice[] = [
  { number: "INV-1042", client: "Maya Chen", email: "maya@northstar.co", date: "Aug 14, 2026", due: "Aug 28, 2026", amount: 185000, status: "sent" },
  { number: "INV-1041", client: "Oak & Finch", email: "hello@oakandfinch.com", date: "Aug 06, 2026", due: "Aug 20, 2026", amount: 72000, status: "overdue" },
  { number: "INV-1040", client: "Jon Bell", email: "jon@bellstudio.co", date: "Jul 29, 2026", due: "Aug 12, 2026", amount: 95000, status: "paid" },
];

const clients = [
  { name: "Maya Chen", company: "Northstar Studio", email: "maya@northstar.co", outstanding: 185000, lastInvoice: "INV-1042" },
  { name: "Oak & Finch", company: "Oak & Finch", email: "hello@oakandfinch.com", outstanding: 72000, lastInvoice: "INV-1041" },
  { name: "Jon Bell", company: "Bell Studio", email: "jon@bellstudio.co", outstanding: 0, lastInvoice: "INV-1040" },
];

const money = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
const invoiceStatusLabel = (status: DemoInvoice["status"]) =>
  status === "sent" ? "Sent" : status === "paid" ? "Paid" : status === "overdue" ? "Overdue" : "Void";

/* --- SVG Icons --- */
function IconHome({ className = "nav-svg-icon" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconInvoices({ className = "nav-svg-icon" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function IconClients({ className = "nav-svg-icon" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconPayments({ className = "nav-svg-icon" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function IconSettings({ className = "nav-svg-icon" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function IconMonitor({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function IconSun({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function IconMoon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MinimoLogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="4.5" width="5.5" height="15" rx="2.75" fill="#00E575" transform="rotate(-15 6 12)" />
      <rect x="12.5" y="4.5" width="5.5" height="15" rx="2.75" fill="#00E575" transform="rotate(-15 15 12)" />
    </svg>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<"dashboard" | "invoices" | "clients" | "payments" | "settings" | "detail" | "editor" | "review" | "sent">("dashboard");
  const [themeMode, setThemeMode] = useState<"system" | "dark" | "light">("system");
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("dark");
  const [selectedInvoice, setSelectedInvoice] = useState(invoices[0]);
  const [draftError, setDraftError] = useState("");
  const [draftStorageWarning, setDraftStorageWarning] = useState("");
  const [draftHydrated, setDraftHydrated] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [client, setClient] = useState({ name: "Maya Chen", email: "maya@northstar.co", company: "Northstar Studio" });
  const [dates, setDates] = useState({ issue: "2026-08-18", due: "2026-09-01" });
  const [items, setItems] = useState<Item[]>([{ description: "Brand strategy and creative direction", quantity: "1", rate: "1850" }]);
  const [notes, setNotes] = useState("Thank you for working with minimo Studio.");

  /* Initialize and load saved theme preference */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedTheme = window.localStorage.getItem("junvo-theme-mode") as "system" | "dark" | "light" | null;
        if (savedTheme === "system" || savedTheme === "dark" || savedTheme === "light") {
          setThemeMode(savedTheme);
        }
      } catch {
        // Fallback to default
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  /* Follow Device Settings / Dynamic Theme Resolution */
  useEffect(() => {
    const applyTheme = (mode: "system" | "dark" | "light") => {
      let resolved: "dark" | "light" = "dark";
      if (mode === "system") {
        resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      } else {
        resolved = mode;
      }
      setCurrentTheme(resolved);
      document.documentElement.setAttribute("data-theme", resolved);
      document.documentElement.style.colorScheme = resolved;
    };

    applyTheme(themeMode);

    try {
      window.localStorage.setItem("junvo-theme-mode", themeMode);
    } catch {
      // LocalStorage ignored if restricted
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (themeMode === "system") {
        const resolved = e.matches ? "dark" : "light";
        setCurrentTheme(resolved);
        document.documentElement.setAttribute("data-theme", resolved);
        document.documentElement.style.colorScheme = resolved;
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, [themeMode]);

  /* Keyboard shortcut 'c' to create invoice */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "c" || e.key === "C") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        if (tag === "input" || tag === "textarea" || tag === "select" || (e.target as HTMLElement)?.isContentEditable) {
          return;
        }
        e.preventDefault();
        setIsCreateModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem("junvo-demo-invoice-draft");
        if (saved) {
          const draft = JSON.parse(saved) as { client?: typeof client; dates?: typeof dates; items?: Item[]; notes?: string };
          if (draft.client) setClient(draft.client);
          if (draft.dates) setDates(draft.dates);
          if (draft.items?.length) setItems(draft.items);
          if (typeof draft.notes === "string") setNotes(draft.notes);
        }
        setDraftHydrated(true);
      } catch {
        setDraftHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!draftHydrated) return;
    let warningTimer: number | undefined;
    try {
      window.localStorage.setItem("junvo-demo-invoice-draft", JSON.stringify({ client, dates, items, notes }));
    } catch {
      warningTimer = window.setTimeout(() => setDraftStorageWarning("Couldn’t save the local draft. Your current changes remain on this page; try again shortly."), 0);
    }
    return () => { if (warningTimer) window.clearTimeout(warningTimer); };
  }, [client, dates, items, notes, draftHydrated]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + Math.round(Number(item.quantity || 0) * Number(item.rate || 0) * 100), 0), [items]);
  const updateItem = (index: number, field: keyof Item, value: string) => setItems(current => current.map((item, i) => i === index ? { ...item, [field]: value } : item));
  const addItem = () => setItems(current => [...current, { description: "", quantity: "1", rate: "0" }]);
  const removeItem = (index: number) => setItems(current => current.length === 1 ? current : current.filter((_, i) => i !== index));
  const resetDraft = () => {
    if (!window.confirm("Start a fresh invoice? Your current local draft will be cleared.")) return;
    try {
      window.localStorage.removeItem("junvo-demo-invoice-draft");
      setDraftStorageWarning("");
    } catch {
      setDraftStorageWarning("Couldn’t clear the saved local draft, but the editor has been reset on this page.");
    }
    setClient({ name: "", email: "", company: "" });
    setDates({ issue: "2026-08-18", due: "2026-09-01" });
    setItems([{ description: "", quantity: "1", rate: "0" }]);
    setNotes("");
    setDraftError("");
  };
  const reviewDraft = () => {
    const error = validateInvoiceDraft(client, dates, items);
    if (error) return setDraftError(error);
    setDraftError("");
    setIsCreateModalOpen(false);
    setScreen("review");
  };

  /* Scroll to top when switching tabs/screens */
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch {
      // Ignore if unavailable
    }
  }, [screen]);

  return (
    <div className="app-shell">
      <Sidebar
        active={screen === "dashboard" ? "Home" : screen === "clients" ? "Clients" : screen === "payments" ? "Payments" : screen === "settings" ? "Settings" : "Invoices"}
        onNavigate={setScreen}
      />
      <div className="main-viewport">
        {/* Mobile Top Header Bar */}
        <header className="mobile-top-bar" aria-label="Mobile header">
          <div className="mobile-logo">
            <MinimoLogoMark />
            <span className="mobile-brand-name">minimo</span>
          </div>
          <div className="mobile-top-right">
            <button
              className="user-avatar-circle"
              aria-label="Open Settings"
              type="button"
              onClick={() => setScreen("settings")}
            >
              J
            </button>
          </div>
        </header>

        <main className="main" id="main-content">
          {screen === "dashboard" && (
            <Dashboard
              onCreate={() => setIsCreateModalOpen(true)}
              onViewInvoices={() => setScreen("invoices")}
              onOpenInvoice={invoice => { setSelectedInvoice(invoice); setScreen("detail"); }}
            />
          )}
          {screen === "invoices" && <InvoiceList onCreate={() => setIsCreateModalOpen(true)} onOpenInvoice={invoice => { setSelectedInvoice(invoice); setScreen("detail"); }} />}
          {screen === "clients" && <ClientList onCreate={() => setIsCreateModalOpen(true)} />}
          {screen === "payments" && <PaymentList />}
          {screen === "settings" && <Settings themeMode={themeMode} setThemeMode={setThemeMode} />}
          {screen === "detail" && (
            <InvoiceDetail
              invoice={selectedInvoice}
              onBack={() => setScreen("invoices")}
              onVoid={() => setSelectedInvoice(current => ({ ...current, status: "void" }))}
              onCorrect={() => {
                setClient({ name: selectedInvoice.client, email: selectedInvoice.email, company: "" });
                setDates({ issue: "2026-08-18", due: "2026-09-01" });
                setItems([{ description: "Brand strategy and creative direction", quantity: "1", rate: String(selectedInvoice.amount / 100) }]);
                setNotes(`Correction for ${selectedInvoice.number}. Please disregard the voided invoice.`);
                setDraftError("");
                setIsCreateModalOpen(true);
              }}
              onDuplicate={() => {
                setClient({ name: selectedInvoice.client, email: selectedInvoice.email, company: "" });
                setDates({ issue: "2026-08-18", due: "2026-09-01" });
                setItems([{ description: "Brand strategy and creative direction", quantity: "1", rate: String(selectedInvoice.amount / 100) }]);
                setNotes("Thank you for working with minimo Studio.");
                setDraftError("");
                setIsCreateModalOpen(true);
              }}
            />
          )}
          {screen === "editor" && (
            <Editor
              client={client}
              setClient={setClient}
              dates={dates}
              setDates={setDates}
              items={items}
              updateItem={updateItem}
              addItem={addItem}
              removeItem={removeItem}
              notes={notes}
              setNotes={setNotes}
              subtotal={subtotal}
              error={draftError}
              storageWarning={draftStorageWarning}
              onBack={() => setScreen("dashboard")}
              onReview={reviewDraft}
              onReset={resetDraft}
            />
          )}
          {screen === "review" && (
            <Review client={client} items={items} subtotal={subtotal} notes={notes} onBack={() => { setScreen("dashboard"); setIsCreateModalOpen(true); }} onSend={() => setScreen("sent")} />
          )}
          {screen === "sent" && (
            <Sent client={client} onDashboard={() => setScreen("dashboard")} onCreate={() => { setItems([{ description: "", quantity: "1", rate: "0" }]); setIsCreateModalOpen(true); }} />
          )}
        </main>
      </div>

      {/* Floating Bottom Nav Dock */}
      <MobileNav
        active={screen === "dashboard" ? "Home" : screen === "clients" ? "Clients" : screen === "payments" ? "Payments" : screen === "settings" ? "Settings" : "Invoices"}
        onNavigate={setScreen}
        onCreate={() => setIsCreateModalOpen(true)}
      />

      {/* Slide-Up Bottom Sheet Modal for Quick Create Invoice */}
      <CreateInvoiceModalSheet
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        client={client}
        setClient={setClient}
        dates={dates}
        setDates={setDates}
        items={items}
        updateItem={updateItem}
        addItem={addItem}
        removeItem={removeItem}
        notes={notes}
        setNotes={setNotes}
        subtotal={subtotal}
        error={draftError}
        storageWarning={draftStorageWarning}
        onReview={reviewDraft}
      />
    </div>
  );
}

function Sidebar({ active, onNavigate }: { active: string; onNavigate: (screen: any) => void }) {
  return (
    <aside className="sidebar">
      <div className="wordmark">
        <MinimoLogoMark />
        <span>minimo</span>
      </div>
      <nav className="nav" aria-label="Main navigation">
        <NavButton label="Home" icon={<IconHome />} active={active === "Home"} onClick={() => onNavigate("dashboard")} />
        <NavButton label="Invoices" icon={<IconInvoices />} active={active === "Invoices"} onClick={() => onNavigate("invoices")} />
        <NavButton label="Clients" icon={<IconClients />} active={active === "Clients"} onClick={() => onNavigate("clients")} />
        <NavButton label="Payments" icon={<IconPayments />} active={active === "Payments"} onClick={() => onNavigate("payments")} />
        <NavButton label="Settings" icon={<IconSettings />} active={active === "Settings"} onClick={() => onNavigate("settings")} />
      </nav>
      <div className="sidebar-bottom">
        <span className="help-link">Need a hand?</span>
        <div className="profile">
          <span className="avatar">J</span>
          <span>minimo Studio</span>
        </div>
      </div>
    </aside>
  );
}

function NavButton({ label, icon, active, onClick }: { label: string; icon: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button className={`nav-link-btn ${active ? "active" : ""}`} type="button" onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function MobileNav({
  active,
  onNavigate,
  onCreate,
}: {
  active: string;
  onNavigate: (screen: any) => void;
  onCreate: () => void;
}) {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {/* 1. Home */}
      <button
        className={`mobile-nav-btn ${active === "Home" ? "active" : ""}`}
        type="button"
        aria-label="Home"
        onClick={() => onNavigate("dashboard")}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </button>

      {/* 2. Invoices */}
      <button
        className={`mobile-nav-btn ${active === "Invoices" ? "active" : ""}`}
        type="button"
        aria-label="Invoices"
        onClick={() => onNavigate("invoices")}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      </button>

      {/* 3. Center Quick Action: Slide-Up Create Invoice Sheet */}
      <button
        className="mobile-nav-btn mobile-nav-create-btn"
        type="button"
        aria-label="Create invoice"
        onClick={onCreate}
      >
        <div className="mobile-nav-plus-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
      </button>

      {/* 4. Clients Directory */}
      <button
        className={`mobile-nav-btn ${active === "Clients" ? "active" : ""}`}
        type="button"
        aria-label="Clients"
        onClick={() => onNavigate("clients")}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </button>

      {/* 5. Settings */}
      <button
        className={`mobile-nav-btn ${active === "Settings" ? "active" : ""}`}
        type="button"
        aria-label="Settings"
        onClick={() => onNavigate("settings")}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>
    </nav>
  );
}

function Dashboard({
  onCreate,
  onViewInvoices,
  onOpenInvoice,
}: {
  onCreate: () => void;
  onViewInvoices: () => void;
  onOpenInvoice: (invoice: (typeof invoices)[number]) => void;
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const overdueInvoices = invoices.filter(inv => inv.status === "overdue");
  const overdueCount = overdueInvoices.length;
  const totalOverdueAmount = overdueInvoices.reduce((acc, inv) => acc + inv.amount, 0);

  return (
    <>
      <header className="dashboard-hero-header">
        <div className="hero-header-text">
          <div className="eyebrow">TUESDAY, AUGUST 18</div>
          <h1>Good morning, Jordan.</h1>
          <p className="subtle" style={{ marginTop: 4 }}>
            Here&apos;s what&apos;s happening with your invoices.
          </p>
        </div>
        <button className="button primary hero-create-btn" onClick={onCreate}>
          <span>＋ Create invoice</span>
          <span className="kbd-shortcut">C</span>
        </button>
      </header>

      {/* Priority Attention Card (Prominently placed right below hero header) */}
      <section className="priority-banner" aria-label="Action required">
        {overdueCount === 0 ? (
          <>
            <div className="priority-header-row">
              <div className="priority-icon-circle" aria-hidden="true">✓</div>
              <span className="priority-eyebrow">All caught up</span>
            </div>
            <div className="priority-body-row">
              <h2>No overdue invoices</h2>
              <p>All client accounts are in good standing with payment terms.</p>
            </div>
            <div className="priority-bottom-row">
              <div className="priority-amount" style={{ fontSize: 18, opacity: 0.9 }}>$0.00</div>
              <button className="button outline-dark" onClick={onViewInvoices}>
                View all
              </button>
            </div>
          </>
        ) : overdueCount === 1 ? (
          <>
            <div className="priority-header-row">
              <div className="priority-icon-circle" aria-hidden="true">!</div>
              <span className="priority-eyebrow">One invoice needs attention</span>
            </div>
            <div className="priority-body-row">
              <h2>{overdueInvoices[0].client} is overdue</h2>
              <p>A gentle reminder could help move this one along.</p>
            </div>
            <div className="priority-bottom-row">
              <div className="priority-amount">{money(overdueInvoices[0].amount)}</div>
              <button className="button outline-dark" onClick={onViewInvoices}>
                Review overdue
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="priority-header-row">
              <div className="priority-icon-circle" aria-hidden="true">!</div>
              <span className="priority-eyebrow">{overdueCount} invoices need attention</span>
            </div>
            <div className="priority-body-row">
              <h2>{overdueInvoices[0].client} &amp; {overdueCount - 1} other{overdueCount > 2 ? "s" : ""}</h2>
              <p>Total overdue balance requiring follow-up reminders.</p>
            </div>

            <div className="priority-breakdown-list">
              {overdueInvoices.map(inv => (
                <div key={inv.number} className="priority-breakdown-item" onClick={() => onOpenInvoice(inv)}>
                  <div className="breakdown-left">
                    <span className="breakdown-dot" />
                    <span className="breakdown-name">{inv.client}</span>
                    <span className="breakdown-number">{inv.number}</span>
                  </div>
                  <strong className="breakdown-amount">{money(inv.amount)}</strong>
                </div>
              ))}
            </div>

            <div className="priority-bottom-row">
              <div className="priority-amount">{money(totalOverdueAmount)}</div>
              <button className="button outline-dark" onClick={onViewInvoices}>
                Review all ({overdueCount})
              </button>
            </div>
          </>
        )}
      </section>

      {/* Summary Metric Cards */}
      <section className="summary-section" aria-label="Invoice statistics">
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
            <div className="summary-label">Outstanding</div>
            <div className="summary-value">{money(257000)}</div>
            <div className="summary-note">2 open invoices</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Paid this month</div>
            <div className="summary-value">{money(95000)}</div>
            <div className="summary-note">1 invoice paid</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Average time to pay</div>
            <div className="summary-value">9.4 days</div>
            <div className="summary-note">1.2 days faster than last month</div>
          </div>
        </div>
        <div className="carousel-dots" aria-hidden="true">
          <span className={`dot ${activeSlide === 0 ? "active" : ""}`} />
          <span className={`dot ${activeSlide === 1 ? "active" : ""}`} />
          <span className={`dot ${activeSlide === 2 ? "active" : ""}`} />
        </div>
      </section>

      {/* Recent Invoices Section */}
      <section aria-labelledby="recent-invoices-heading" className="recent-invoices-section">
        <div className="section-heading">
          <h2 id="recent-invoices-heading">Recent invoices</h2>
          <button className="view-all-btn" onClick={onViewInvoices}>
            View all →
          </button>
        </div>
        <div className="recent-invoices-card-group" role="list" aria-label="Recent invoices">
          {invoices.map(invoice => (
            <div
              key={invoice.number}
              className="recent-invoice-row"
              role="listitem"
              onClick={() => onOpenInvoice(invoice)}
            >
              <div className="recent-invoice-left">
                <span className="invoice-number">{invoice.number}</span>
                <span className="client-name">{invoice.client}</span>
                <span className="invoice-date">Due {invoice.due}</span>
              </div>
              <div className="recent-invoice-right">
                <span className="invoice-amount">{money(invoice.amount)}</span>
                <span className={`status ${invoice.status}`}>
                  <span className="status-dot" />
                  {invoice.status === "sent" ? "Sent" : invoice.status === "paid" ? "Paid" : "Overdue"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function InvoiceList({ onCreate, onOpenInvoice }: { onCreate: () => void; onOpenInvoice: (invoice: (typeof invoices)[number]) => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const filtered = invoices.filter(
    invoice =>
      `${invoice.number} ${invoice.client} ${invoice.email}`.toLowerCase().includes(query.toLowerCase()) &&
      (filter === "All" || (filter === "Outstanding" ? invoice.status === "sent" || invoice.status === "overdue" : filter.toLowerCase() === invoice.status))
  );
  return (
    <>
      <header className="dashboard-hero-header">
        <h1>Invoices</h1>
        <p className="subtle" style={{ marginTop: 4 }}>
          Keep every invoice, status, and next step in one place.
        </p>
        <button className="button primary hero-create-btn" onClick={onCreate}>
          <span>＋ Create invoice</span>
          <span className="kbd-shortcut">C</span>
        </button>
      </header>

      <div className="list-toolbar">
        <input
          aria-label="Search invoices"
          placeholder="Search by client or invoice number"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <select aria-label="Filter invoices" value={filter} onChange={e => setFilter(e.target.value)}>
          <option>All</option>
          <option>Outstanding</option>
          <option>Overdue</option>
          <option>Paid</option>
        </select>
      </div>

      <div className="recent-invoices-card-group" role="list" aria-label="Invoices list">
        {filtered.map(invoice => (
          <div
            key={invoice.number}
            className="recent-invoice-row"
            role="listitem"
            onClick={() => onOpenInvoice(invoice)}
          >
            <div className="recent-invoice-left">
              <span className="invoice-number">{invoice.number}</span>
              <span className="client-name">{invoice.client}</span>
              <span className="invoice-date">Due {invoice.due}</span>
            </div>
            <div className="recent-invoice-right">
              <span className="invoice-amount">{money(invoice.amount)}</span>
              <span className={`status ${invoice.status}`}>
                <span className="status-dot" />
                {invoice.status === "sent" ? "Sent" : invoice.status === "paid" ? "Paid" : "Overdue"}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state" style={{ padding: "36px 20px" }}>
            <strong>No matching invoices</strong>
            <span className="subtle">Try a different search query or filter.</span>
          </div>
        )}
      </div>
    </>
  );
}

function ClientList({ onCreate }: { onCreate: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [savedClient, setSavedClient] = useState<typeof clients[number] | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [error, setError] = useState("");
  const rows = savedClient ? [savedClient, ...clients] : clients;
  const saveClient = () => {
    if (!form.name.trim()) return setError("Add a client name and valid email address.");
    try { normalizeEmailForLookup(form.email); } catch { return setError("Add a client name and valid email address."); }
    setSavedClient({ name: form.name.trim(), company: form.company.trim() || form.name.trim(), email: form.email.trim(), outstanding: 0, lastInvoice: "—" });
    setForm({ name: "", email: "", company: "" });
    setError("");
    setShowForm(false);
  };
  return (
    <>
      <header className="dashboard-hero-header">
        <h1>Clients</h1>
        <p className="subtle" style={{ marginTop: 4 }}>
          Reuse client details without changing historical invoices.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: showForm ? "1fr" : "1fr 1fr", gap: 10 }}>
          <button className="button secondary hero-create-btn" onClick={() => setShowForm(value => !value)}>
            {showForm ? "Cancel" : "＋ New client"}
          </button>
          {!showForm && (
            <button className="button primary hero-create-btn" onClick={onCreate}>
              <span>＋ Create invoice</span>
              <span className="kbd-shortcut">C</span>
            </button>
          )}
        </div>
      </header>

      {showForm && (
        <section className="card client-form" style={{ marginBottom: 20 }}>
          <div className="section-heading">
            <div>
              <h2>New client</h2>
              <p className="subtle" style={{ marginTop: 4 }}>Name and email are required. Historical invoices stay unchanged.</p>
            </div>
          </div>
          {error && (
            <div className="error-summary" role="alert">
              <strong>Check the client details</strong>
              <span>{error}</span>
            </div>
          )}
          <div className="field-grid">
            <div className="field">
              <label htmlFor="new-client-name">Name</label>
              <input id="new-client-name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="new-client-email">Email</label>
              <input id="new-client-email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="field full">
              <label htmlFor="new-client-company">Company <span className="subtle">(Optional)</span></label>
              <input id="new-client-company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            </div>
          </div>
          <button className="button primary" style={{ marginTop: 18, minHeight: 40, width: "100%" }} onClick={saveClient}>
            Save client
          </button>
        </section>
      )}

      <div className="recent-invoices-card-group" role="list" aria-label="Clients directory">
        {rows.map(client => (
          <div key={client.email} className="recent-invoice-row" role="listitem">
            <div className="recent-invoice-left">
              <span className="client-name" style={{ fontSize: 14.5 }}>{client.name}</span>
              <span className="subtle" style={{ fontSize: 12.5 }}>{client.company} · {client.email}</span>
              <span className="invoice-date">Last invoice: {client.lastInvoice}</span>
            </div>
            <div className="recent-invoice-right">
              <span className="invoice-amount">
                {client.outstanding ? money(client.outstanding) : <span className="subtle" style={{ fontSize: 13 }}>$0.00</span>}
              </span>
              <span className="subtle" style={{ fontSize: 11.5 }}>
                {client.outstanding ? "Outstanding" : "Settled"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Settings({
  themeMode,
  setThemeMode,
}: {
  themeMode: "system" | "dark" | "light";
  setThemeMode: (mode: "system" | "dark" | "light") => void;
}) {
  const [notice, setNotice] = useState("");
  const save = (message: string) => setNotice(message);
  return (
    <>
      <header className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="subtle" style={{ marginTop: 6 }}>Keep your business details, appearance, and invoice defaults ready to go.</p>
        </div>
      </header>
      {notice && <div className="inline-notice" role="status">{notice}</div>}
      <div className="settings-grid">
        {/* Appearance / Theme Settings */}
        <section className="card">
          <h2>Appearance</h2>
          <p className="subtle" style={{ marginTop: 6 }}>
            Customize how minimo looks. Choose System to automatically follow your device settings.
          </p>
          <div className="theme-selector-grid" role="radiogroup" aria-label="Theme selection">
            <button
              className={`theme-option-btn ${themeMode === "system" ? "active" : ""}`}
              onClick={() => {
                setThemeMode("system");
                save("Appearance set to follow device theme.");
              }}
              role="radio"
              aria-checked={themeMode === "system"}
            >
              <IconMonitor />
              <span>System</span>
              <small className="subtle" style={{ fontSize: 11 }}>Follow device</small>
            </button>
            <button
              className={`theme-option-btn ${themeMode === "dark" ? "active" : ""}`}
              onClick={() => {
                setThemeMode("dark");
                save("Dark mode enabled.");
              }}
              role="radio"
              aria-checked={themeMode === "dark"}
            >
              <IconMoon />
              <span>Dark</span>
              <small className="subtle" style={{ fontSize: 11 }}>Obsidian emerald</small>
            </button>
            <button
              className={`theme-option-btn ${themeMode === "light" ? "active" : ""}`}
              onClick={() => {
                setThemeMode("light");
                save("Light mode enabled.");
              }}
              role="radio"
              aria-checked={themeMode === "light"}
            >
              <IconSun />
              <span>Light</span>
              <small className="subtle" style={{ fontSize: 11 }}>Crisp clean</small>
            </button>
          </div>
        </section>

        {/* Business Profile */}
        <section className="card">
          <h2>Business profile</h2>
          <p className="subtle" style={{ marginTop: 6 }}>Shown on your invoices and client payment pages.</p>
          <div className="form-section" style={{ marginTop: 20 }}>
            <div className="field">
              <label htmlFor="business-name">Business name</label>
              <input id="business-name" defaultValue="minimo Studio" />
            </div>
            <div className="field">
              <label htmlFor="support-email">Support email</label>
              <input id="support-email" defaultValue="hello@minimostudio.com" />
            </div>
            <button className="button primary" onClick={() => save("Business profile saved in this prototype.")}>
              Save profile
            </button>
          </div>
        </section>

        {/* Invoice Defaults */}
        <section className="card">
          <h2>Invoice defaults</h2>
          <p className="subtle" style={{ marginTop: 6 }}>Helpful starting points for every new invoice.</p>
          <div className="form-section" style={{ marginTop: 20 }}>
            <div className="field">
              <label htmlFor="terms">Default payment terms</label>
              <select id="terms" defaultValue="14">
                <option value="7">Due in 7 days</option>
                <option value="14">Due in 14 days</option>
                <option value="30">Due in 30 days</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="prefix">Invoice prefix</label>
              <input id="prefix" defaultValue="INV-" />
            </div>
            <button className="button primary" onClick={() => save("Invoice defaults saved in this prototype.")}>
              Save defaults
            </button>
          </div>
        </section>

        <ReminderSettings />

        <section className="card">
          <h2>Payments</h2>
          <p className="subtle" style={{ marginTop: 6 }}>Connect Stripe when you’re ready to accept online payments.</p>
          <div className="settings-status">
            <span className="status draft"><span className="status-dot" />Not connected</span>
            <button className="button secondary" onClick={() => save("Stripe connection will be enabled after payment setup decisions are finalized.")}>
              Connect Stripe
            </button>
          </div>
        </section>

        <DataPrivacySettings />
      </div>
    </>
  );
}

function InvoiceDetail({
  invoice,
  onBack,
  onVoid,
  onCorrect,
  onDuplicate,
}: {
  invoice: DemoInvoice;
  onBack: () => void;
  onVoid: () => void;
  onCorrect: () => void;
  onDuplicate: () => void;
}) {
  const [notice, setNotice] = useState("");
  const isPaid = invoice.status === "paid";
  const isOverdue = invoice.status === "overdue";
  const isVoid = invoice.status === "void";
  const timeline = isVoid
    ? [["Invoice voided", "Preserved for historical records", "overdue"]]
    : isPaid
    ? [
        ["Payment confirmed", "Aug 12, 2026 · Stripe webhook", "success"],
        ["Client opened the invoice page", "Aug 10, 2026 · 10:24 AM", "viewed"],
        ["Email provider accepted the message", "Jul 29, 2026 · 9:02 AM", "sent"],
      ]
    : [
        [isOverdue ? "Invoice is overdue" : "Invoice is open", isOverdue ? "Due Aug 20, 2026" : "Due Aug 28, 2026", isOverdue ? "overdue" : "sent"],
        ["Client opened the invoice page", "Aug 15, 2026 · 2:18 PM", "viewed"],
        ["Email provider accepted the message", `${invoice.date} · 9:02 AM`, "sent"],
      ];

  const voidInvoice = () => {
    if (window.confirm("Void this invoice? It will remain in your records, but the client will no longer be able to pay it.")) {
      onVoid();
      setNotice("Invoice voided. Its history has been preserved.");
    }
  };
  const downloadPdf = () => setNotice("PDF generation is not connected yet. Your invoice remains available in the hosted preview.");

  return (
    <>
      <header className="page-header">
        <div>
          <button className="button tertiary" onClick={onBack} style={{ marginBottom: 12, paddingLeft: 0 }}>← Back to invoices</button>
          <h1>{invoice.number}</h1>
          <p className="subtle" style={{ marginTop: 6 }}>{invoice.client} · {invoice.email}</p>
        </div>
        <div className="header-actions">
          <span className={`status ${invoice.status}`}>
            <span className="status-dot" />
            {invoiceStatusLabel(invoice.status)}
          </span>
          <button className="button secondary" onClick={downloadPdf}>Download PDF</button>
        </div>
      </header>
      {notice && <div className="inline-notice" role="status">{notice}</div>}
      {isVoid && (
        <div className="error-summary" role="status">
          <strong>This invoice was voided</strong>
          <span>It remains available for your records and no payment action is available.</span>
        </div>
      )}
      <div className="detail-layout">
        <div className="detail-main">
          <div className="card">
            <div className="detail-total">
              <span className="subtle">{isPaid ? "Paid" : isVoid ? "Voided amount" : "Amount due"}</span>
              <strong>{money(invoice.amount)}</strong>
            </div>
            <div className="invoice-preview">
              <div className="invoice-preview-top">
                <div>
                  <strong style={{ fontSize: 20 }}>minimo Studio</strong>
                  <p className="subtle" style={{ marginTop: 4 }}>hello@minimostudio.com</p>
                </div>
                <div className="invoice-title">
                  <strong>INVOICE</strong>
                  <span>{invoice.number}</span>
                </div>
              </div>
              <div className="preview-meta">
                <div>
                  <span>BILLED TO</span>
                  <strong>{invoice.client}</strong>
                  <strong style={{ color: "var(--ink-500)", fontWeight: 500 }}>{invoice.email}</strong>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span>ISSUED</span>
                  <strong>{invoice.date}</strong>
                  <span style={{ marginTop: 8 }}>DUE {invoice.due}</span>
                </div>
              </div>
              <table className="preview-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Brand strategy and creative direction</td>
                    <td>1</td>
                    <td>{money(invoice.amount)}</td>
                    <td>{money(invoice.amount)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="preview-totals">
                <div className="preview-total">
                  <span className="preview-total-label">Subtotal</span>
                  <span>{money(invoice.amount)}</span>
                </div>
                <div className="preview-total final">
                  <span>{isPaid ? "Paid" : isVoid ? "Voided" : "Total due"}</span>
                  <span>{money(invoice.amount)}</span>
                </div>
              </div>
              <div className="preview-note">Thank you for working with minimo Studio.</div>
            </div>
          </div>
          <div className="card">
            <div className="section-heading">
              <h2>Timeline</h2>
              <span className="subtle">Status history</span>
            </div>
            <div className="timeline">
              {timeline.map(([title, detail, kind]) => (
                <div className="timeline-item" key={title}>
                  <span className={`timeline-dot ${kind}`} />
                  <div>
                    <strong style={{ color: "var(--ink-950)" }}>{title}</strong>
                    <p className="subtle">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside className="detail-side">
          <div className="card">
            <h2>{isVoid ? "Invoice voided" : "Next step"}</h2>
            <p className="subtle" style={{ marginTop: 6 }}>
              {isVoid
                ? "This invoice is preserved for your records. Create a correction or duplicate if you need a new invoice."
                : isPaid
                ? "This invoice is complete. Download a copy for your records."
                : "A polite reminder can keep this invoice moving without awkward chasing."}
            </p>
            {!isPaid && !isVoid && (
              <button
                className="button primary"
                style={{ width: "100%", marginTop: 18 }}
                onClick={() => setNotice("Reminder preview ready. Sending will be connected to the delivery service in a later milestone.")}
              >
                Send reminder
              </button>
            )}
            {isVoid && (
              <button className="button primary" style={{ width: "100%", marginTop: 18 }} onClick={onCorrect}>
                Create correction
              </button>
            )}
            {!isVoid && (
              <button className="button secondary" style={{ width: "100%", marginTop: 10 }} onClick={() => setNotice("Secure invoice link copied in the production flow.")}>
                Copy secure link
              </button>
            )}
            {!isVoid && (
              <button className="button tertiary" style={{ width: "100%", marginTop: 10 }} onClick={onDuplicate}>
                Duplicate invoice
              </button>
            )}
            {!isPaid && !isVoid && (
              <button className="button tertiary" style={{ width: "100%", marginTop: 10, color: "var(--danger)" }} onClick={voidInvoice}>
                Void invoice
              </button>
            )}
          </div>
          <div className="card">
            <h2>Payment</h2>
            <div className="review-list" style={{ marginTop: 12 }}>
              <div className="review-row">
                <span>Method</span>
                <strong>{isVoid ? "Unavailable" : isPaid ? "Stripe" : "Online payment"}</strong>
              </div>
              <div className="review-row">
                <span>Balance</span>
                <strong>{isPaid || isVoid ? "$0.00" : money(invoice.amount)}</strong>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function Editor({
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
  onBack,
  onReview,
}: any) {
  const [saveState, setSaveState] = useState<"saved" | "saving">("saved");
  const errorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const savingTimer = window.setTimeout(() => setSaveState("saving"), 0);
    const savedTimer = window.setTimeout(() => setSaveState("saved"), 450);
    return () => {
      window.clearTimeout(savingTimer);
      window.clearTimeout(savedTimer);
    };
  }, [client, dates, items, notes]);
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  return (
    <>
      <header className="page-header">
        <div>
          <button className="button tertiary" onClick={onBack} style={{ marginBottom: 12, paddingLeft: 0 }}>← Back to invoices</button>
          <h1>Create invoice</h1>
          <p className="subtle" style={{ marginTop: 6 }}>Make it clear, then make getting paid easy.</p>
        </div>
        <button className="button primary" onClick={onReview}>
          Review and send
        </button>
      </header>
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
      <div className="editor-layout">
        <div className="card editor-card">
          <ClientSection client={client} setClient={setClient} />
          <section className="form-section">
            <div className="section-title">
              <h2>Line items</h2>
              <span className="subtle">USD</span>
            </div>
            <div className="line-items">
              {items.map((item: Item, index: number) => (
                <div className="line-item" key={index}>
                  <div className="field">
                    <label>{index === 0 ? "Description" : ""}</label>
                    <input
                      aria-label={`Item ${index + 1} description`}
                      value={item.description}
                      placeholder="What did you do?"
                      onChange={e => updateItem(index, "description", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>{index === 0 ? "Qty" : ""}</label>
                    <input
                      aria-label={`Item ${index + 1} quantity`}
                      inputMode="decimal"
                      value={item.quantity}
                      onChange={e => updateItem(index, "quantity", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>{index === 0 ? "Rate" : ""}</label>
                    <input
                      aria-label={`Item ${index + 1} rate`}
                      inputMode="decimal"
                      value={item.rate}
                      onChange={e => updateItem(index, "rate", e.target.value)}
                    />
                  </div>
                  <button className="remove" aria-label={`Remove item ${index + 1}`} onClick={() => removeItem(index)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button className="button tertiary" style={{ justifySelf: "start" }} onClick={addItem}>
              ＋ Add line item
            </button>
          </section>
          <section className="form-section">
            <div className="section-title">
              <h2>Dates</h2>
            </div>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="issue-date">Issue date</label>
                <input id="issue-date" type="date" value={dates.issue} onChange={e => setDates({ ...dates, issue: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="due-date">Due date</label>
                <input id="due-date" type="date" value={dates.due} onChange={e => setDates({ ...dates, due: e.target.value })} />
              </div>
            </div>
          </section>
          <section className="form-section">
            <div className="section-title">
              <h2>More options</h2>
            </div>
            <div className="field">
              <label htmlFor="notes">Note to client <span className="subtle">(Optional)</span></label>
              <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <label style={{ display: "flex", gap: 10, alignItems: "center", fontWeight: 600, color: "var(--ink-950)" }}>
              <input type="checkbox" defaultChecked style={{ width: 18, minHeight: 18, accentColor: "var(--brand-green)" }} />
              Offer online payment
            </label>
          </section>
          <div className="form-actions">
            <span className="subtle" role="status" aria-live="polite">
              {saveState === "saving" ? "Saving…" : "Saved just now"}
            </span>
            <strong className="editor-total">{money(subtotal)}</strong>
            <button className="button primary" onClick={onReview}>
              Review and send →
            </button>
          </div>
        </div>
        <Preview client={client} dates={dates} items={items} subtotal={subtotal} notes={notes} />
      </div>
    </>
  );
}

function Preview({ client, dates, items, subtotal, notes }: any) {
  return (
    <div className="preview-wrap">
      <div className="preview-label">Live preview</div>
      <div className="invoice-preview">
        <div className="invoice-preview-top">
          <div className="wordmark" style={{ padding: 0 }}>
            <span className="wordmark-mark" />
            minimo Studio
          </div>
          <div className="invoice-title">
            <strong>INVOICE</strong>
            <span>INV-1043</span>
          </div>
        </div>
        <div className="preview-meta">
          <div>
            <span>BILLED TO</span>
            <strong>{client.name || "Client Name"}</strong>
            <strong style={{ color: "var(--ink-500)", fontWeight: 500 }}>{client.email || "client@example.com"}</strong>
          </div>
          <div style={{ textAlign: "right" }}>
            <span>ISSUED</span>
            <strong>{new Date(dates.issue + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</strong>
            <span style={{ marginTop: 8 }}>
              DUE {new Date(dates.due + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>
        <table className="preview-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: Item, i: number) => (
              <tr key={i}>
                <td>{item.description || "Untitled item"}</td>
                <td>{item.quantity || "0"}</td>
                <td>{money(Number(item.rate || 0) * 100)}</td>
                <td>{money(Math.round(Number(item.quantity || 0) * Number(item.rate || 0) * 100))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="preview-totals">
          <div className="preview-total">
            <span className="preview-total-label">Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="preview-total final">
            <span>Total due</span>
            <span>{money(subtotal)}</span>
          </div>
        </div>
        {notes && <div className="preview-note">{notes}</div>}
      </div>
    </div>
  );
}

function Review({ client, items, subtotal, notes, onBack, onSend }: any) {
  return (
    <>
      <header className="page-header">
        <div>
          <button className="button tertiary" onClick={onBack} style={{ marginBottom: 12, paddingLeft: 0 }}>← Back to edit</button>
          <h1>Review and send</h1>
          <p className="subtle" style={{ marginTop: 6 }}>Make sure everything looks right before it goes to your client.</p>
        </div>
      </header>
      <div className="send-layout">
        <div className="card">
          <h2>Send details</h2>
          <div className="review-list" style={{ marginTop: 14 }}>
            <div className="review-row">
              <span>To</span>
              <strong>{client.name}<br /><span className="subtle">{client.email}</span></strong>
            </div>
            <div className="review-row">
              <span>Invoice</span>
              <strong className="invoice-number">INV-1043</strong>
            </div>
            <div className="review-row">
              <span>Amount</span>
              <strong>{money(subtotal)}</strong>
            </div>
            <div className="review-row">
              <span>Payment</span>
              <strong style={{ color: "var(--brand-green)" }}>Online payment enabled</strong>
            </div>
            <div className="review-row">
              <span>Reminders</span>
              <strong>Before due · On due · After due</strong>
            </div>
          </div>
          <div className="form-section" style={{ marginTop: 22 }}>
            <div className="field">
              <label htmlFor="subject">Email subject</label>
              <input id="subject" defaultValue="Invoice INV-1043 from minimo Studio" />
            </div>
            <div className="field">
              <label htmlFor="message">Personal message <span className="subtle">(Optional)</span></label>
              <textarea id="message" defaultValue={notes} />
            </div>
          </div>
          <button className="button primary" style={{ width: "100%", marginTop: 22 }} onClick={onSend}>
            Send invoice
          </button>
        </div>
        <div>
          <div className="preview-label">Invoice preview</div>
          <Preview client={client} dates={{ issue: "2026-08-18", due: "2026-09-01" }} items={items} subtotal={subtotal} notes={notes} />
        </div>
      </div>
    </>
  );
}

function Sent({ client, onDashboard, onCreate }: { client: { name: string; email: string }; onDashboard: () => void; onCreate: () => void }) {
  return (
    <>
      <header className="page-header">
        <div>
          <button className="button tertiary" onClick={onDashboard}>← Back to dashboard</button>
        </div>
      </header>
      <div className="card success-panel">
        <div className="success-icon">✓</div>
        <h2>Invoice sent to {client.email}</h2>
        <p className="subtle">We’ll update the timeline when delivery and payment events arrive.</p>
        <div className="button-row">
          <Link className="button secondary" href="/i/demo-inv-1043">View invoice</Link>
          <button className="button primary" onClick={onCreate}>Create another</button>
        </div>
      </div>
    </>
  );
}
