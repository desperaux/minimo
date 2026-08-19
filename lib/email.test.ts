import { describe, expect, it } from "vitest";
import { normalizeEmailForLookup } from "./email";

describe("email normalization", () => {
  it("normalizes lookup values without changing display inputs", () => {
    expect(normalizeEmailForLookup("  Maya@Northstar.CO ")).toBe("maya@northstar.co");
  });

  it("rejects malformed addresses", () => {
    expect(() => normalizeEmailForLookup("not-an-email")).toThrow("valid email");
    expect(() => normalizeEmailForLookup(`${"a".repeat(310)}@example.com`)).toThrow("valid email");
    expect(() => normalizeEmailForLookup(null as unknown as string)).toThrow("valid email");
  });
});
