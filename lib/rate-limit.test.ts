import { describe, expect, it } from "vitest";
import { MemoryRateLimiter } from "./rate-limit";

describe("memory rate limiter", () => {
  it("allows up to the configured limit and reports remaining attempts", () => {
    let now = 1000;
    const limiter = new MemoryRateLimiter(2, 1000, () => now);
    expect(limiter.check("workspace:1")).toMatchObject({ allowed: true, remaining: 1 });
    expect(limiter.check("workspace:1")).toMatchObject({ allowed: true, remaining: 0 });
    expect(limiter.check("workspace:1")).toMatchObject({ allowed: false, remaining: 0 });
  });

  it("expires hits after the window and isolates keys", () => {
    let now = 1000;
    const limiter = new MemoryRateLimiter(1, 1000, () => now);
    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("b").allowed).toBe(true);
    now = 2001;
    expect(limiter.check("a").allowed).toBe(true);
  });

  it("rejects ineffective configurations", () => {
    expect(() => new MemoryRateLimiter(0, 1000)).toThrow("positive integer");
    expect(() => new MemoryRateLimiter(1.5, 1000)).toThrow("positive integer");
    expect(() => new MemoryRateLimiter(1, 0)).toThrow("positive");
  });

  it("rejects empty, non-string, and oversized keys", () => {
    const limiter = new MemoryRateLimiter(1, 1000);
    expect(() => limiter.check("")).toThrow("key is invalid");
    expect(() => limiter.check(null as unknown as string)).toThrow("key is invalid");
    expect(() => limiter.check("x".repeat(257))).toThrow("key is invalid");
  });
});
