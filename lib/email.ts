export function normalizeEmailForLookup(email: string): string {
  if (typeof email !== "string") throw new Error("A valid email address is required.");
  const normalized = email.trim().toLowerCase();
  if (normalized.length > 320 || !/^\S+@\S+\.\S+$/.test(normalized)) throw new Error("A valid email address is required.");
  return normalized;
}
