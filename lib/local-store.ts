/**
 * local-store.ts
 * Thin helpers to persist saved clients and past line-item descriptions
 * (services) in localStorage so users can pick existing ones when creating
 * a new invoice.
 *
 * NOTE: This is prototype / local storage only. These are NOT synced to any
 * backend and should not be presented as production data.
 */

const CLIENTS_KEY = "junvo-saved-clients";
const SERVICES_KEY = "junvo-saved-services";

export type SavedClient = {
  id: string;
  name: string;
  email: string;
  company: string;
};

/** Read the saved client list from localStorage. Returns [] on error. */
export function getSavedClients(): SavedClient[] {
  try {
    const raw = window.localStorage.getItem(CLIENTS_KEY);
    if (!raw) return defaultClients();
    return JSON.parse(raw) as SavedClient[];
  } catch {
    return defaultClients();
  }
}

/** Upsert a client by email (deduped). Saves back to localStorage. */
export function upsertSavedClient(client: Omit<SavedClient, "id">): SavedClient {
  const existing = getSavedClients();
  const idx = existing.findIndex(
    (c) => c.email.toLowerCase() === client.email.toLowerCase()
  );
  const entry: SavedClient = {
    id: idx >= 0 ? existing[idx].id : crypto.randomUUID(),
    ...client,
  };
  const updated =
    idx >= 0
      ? existing.map((c, i) => (i === idx ? entry : c))
      : [entry, ...existing];
  try {
    window.localStorage.setItem(CLIENTS_KEY, JSON.stringify(updated));
  } catch {
    // Best effort
  }
  return entry;
}

/** Read past service descriptions from localStorage. Returns [] on error. */
export function getSavedServices(): string[] {
  try {
    const raw = window.localStorage.getItem(SERVICES_KEY);
    if (!raw) return defaultServices();
    return JSON.parse(raw) as string[];
  } catch {
    return defaultServices();
  }
}

/** Add a service description if not already present (deduped, trimmed). */
export function addSavedService(description: string): void {
  const trimmed = description.trim();
  if (!trimmed) return;
  const existing = getSavedServices();
  if (existing.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;
  const updated = [trimmed, ...existing].slice(0, 50); // cap at 50
  try {
    window.localStorage.setItem(SERVICES_KEY, JSON.stringify(updated));
  } catch {
    // Best effort
  }
}

/* ── Seed data so new users see realistic options immediately ── */

function defaultClients(): SavedClient[] {
  return [
    {
      id: "seed-1",
      name: "Maya Chen",
      email: "maya@northstar.co",
      company: "Northstar Studio",
    },
    {
      id: "seed-2",
      name: "Oak & Finch",
      email: "hello@oakandfinch.com",
      company: "Oak & Finch",
    },
    {
      id: "seed-3",
      name: "Jon Bell",
      email: "jon@bellstudio.co",
      company: "Bell Studio",
    },
  ];
}

function defaultServices(): string[] {
  return [
    "Brand strategy and creative direction",
    "Logo design",
    "UI/UX design",
    "Web development",
    "Copywriting",
    "Photography",
    "Video editing",
    "Social media management",
    "Consulting",
  ];
}
