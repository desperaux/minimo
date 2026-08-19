import { createHash, randomUUID } from "node:crypto";
import { canonicalJson } from "./canonical-json";

const MAX_KEY_LENGTH = 128;
const PREFIX_PATTERN = /^[A-Za-z0-9._:-]{1,32}$/;

export function createIdempotencyKey(prefix = "req"): string {
  if (!PREFIX_PATTERN.test(prefix)) throw new Error("Idempotency key prefix is invalid.");
  return `${prefix}_${randomUUID()}`;
}

export function isValidIdempotencyKey(key: string): boolean {
  return key.length > 0 && key.length <= MAX_KEY_LENGTH && /^[A-Za-z0-9._:-]+$/.test(key);
}

export function fingerprintIdempotencyPayload(payload: unknown): string {
  return createHash("sha256").update(canonicalJson(payload), "utf8").digest("hex");
}
