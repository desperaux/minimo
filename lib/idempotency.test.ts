import { describe, expect, it } from "vitest";
import { createIdempotencyKey, fingerprintIdempotencyPayload, isValidIdempotencyKey } from "./idempotency";

describe("idempotency keys", () => {
  it("creates valid unique keys", () => {
    const first = createIdempotencyKey("send");
    const second = createIdempotencyKey("send");
    expect(first).not.toBe(second);
    expect(first).toMatch(/^send_/);
    expect(isValidIdempotencyKey(first)).toBe(true);
  });

  it("rejects empty, oversized, and unsafe keys", () => {
    expect(isValidIdempotencyKey("")).toBe(false);
    expect(isValidIdempotencyKey("a".repeat(129))).toBe(false);
    expect(isValidIdempotencyKey("send key")).toBe(false);
    expect(isValidIdempotencyKey("send_123")).toBe(true);
  });

  it("rejects unsafe key prefixes before generating a key", () => {
    expect(() => createIdempotencyKey("send key")).toThrow("prefix is invalid");
    expect(() => createIdempotencyKey("a".repeat(33))).toThrow("prefix is invalid");
  });

  it("fingerprints equivalent payloads consistently", () => {
    expect(fingerprintIdempotencyPayload({ amount: 100, recipient: "client_1" })).toBe(fingerprintIdempotencyPayload({ recipient: "client_1", amount: 100 }));
    expect(fingerprintIdempotencyPayload({ amount: 101, recipient: "client_1" })).not.toBe(fingerprintIdempotencyPayload({ amount: 100, recipient: "client_1" }));
  });
});
