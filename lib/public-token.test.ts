import { describe, expect, it } from "vitest";
import { generatePublicToken, hashPublicToken, issuePublicToken, rotatePublicToken, verifyPublicToken } from "./public-token";

describe("public invoice tokens", () => {
  it("generates a high-entropy token that verifies from its hash", () => {
    const token = generatePublicToken();
    const hash = hashPublicToken(token);
    expect(token.length).toBeGreaterThan(30);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(verifyPublicToken(token, hash)).toBe(true);
  });

  it("rejects altered tokens and hashes", () => {
    const token = generatePublicToken();
    const hash = hashPublicToken(token);
    expect(verifyPublicToken(`${token}x`, hash)).toBe(false);
    expect(verifyPublicToken(token, hashPublicToken("different-token"))).toBe(false);
    expect(verifyPublicToken(token, "not-a-hash")).toBe(false);
    expect(verifyPublicToken(null as unknown as string, hash)).toBe(false);
    expect(verifyPublicToken("x".repeat(257), hash)).toBe(false);
  });

  it("issues and rotates credentials as token/hash pairs", () => {
    const issued = issuePublicToken();
    const rotated = rotatePublicToken();
    expect(verifyPublicToken(issued.token, issued.tokenHash)).toBe(true);
    expect(verifyPublicToken(rotated.token, rotated.tokenHash)).toBe(true);
    expect(rotated.token).not.toBe(issued.token);
    expect(rotated.tokenHash).not.toBe(issued.tokenHash);
  });
});
