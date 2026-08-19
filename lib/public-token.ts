import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

const TOKEN_BYTES = 32;
const MAX_TOKEN_LENGTH = 256;

export type PublicTokenCredential = { token: string; tokenHash: string };

export function generatePublicToken(): string {
  return randomBytes(TOKEN_BYTES).toString("base64url");
}

export function hashPublicToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function issuePublicToken(): PublicTokenCredential {
  const token = generatePublicToken();
  return { token, tokenHash: hashPublicToken(token) };
}

// Rotation creates a replacement credential. Persistence must atomically replace
// the stored hash so the previous token stops working.
export function rotatePublicToken(): PublicTokenCredential {
  return issuePublicToken();
}

export function verifyPublicToken(token: string, expectedHash: string): boolean {
  if (typeof token !== "string" || token.length === 0 || token.length > MAX_TOKEN_LENGTH || typeof expectedHash !== "string" || !/^[a-f0-9]{64}$/.test(expectedHash)) return false;
  const actual = Buffer.from(hashPublicToken(token), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
