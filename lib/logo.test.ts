import { describe, expect, it } from "vitest";
import { validateLogo } from "@/lib/logo";

describe("validateLogo", () => {
  it("accepts a valid PNG signature and dimensions", () => {
    const bytes = new Uint8Array(24);
    bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    bytes.set([0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52], 8);
    new DataView(bytes.buffer).setUint32(16, 800);
    new DataView(bytes.buffer).setUint32(20, 400);
    expect(validateLogo(bytes)).toMatchObject({ contentType: "image/png", width: 800, height: 400 });
  });

  it("rejects unsupported file content", () => {
    expect(() => validateLogo(new TextEncoder().encode("not an image"))).toThrow("valid PNG");
  });
});
