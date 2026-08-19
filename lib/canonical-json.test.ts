import { describe, expect, it } from "vitest";
import { canonicalJson } from "./canonical-json";

describe("canonical JSON", () => {
  it("sorts object keys recursively while preserving array order", () => {
    expect(canonicalJson({ z: { b: 2, a: 1 }, a: [{ d: 4, c: 3 }] })).toBe('{"a":[{"c":3,"d":4}],"z":{"a":1,"b":2}}');
  });

  it("represents undefined deterministically", () => {
    expect(canonicalJson(undefined)).toBe("null");
  });
});
