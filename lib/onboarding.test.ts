import { describe, expect, it } from "vitest";
import { parseOnboardingInput } from "@/lib/onboarding";

describe("parseOnboardingInput", () => {
  it("normalizes valid onboarding details", () => {
    expect(parseOnboardingInput({ businessName: "  Studio North ", supportEmail: " OWNER@EXAMPLE.COM ", paymentTermsDays: 14, timezone: "America/New_York" })).toEqual({ businessName: "Studio North", supportEmail: "owner@example.com", paymentTermsDays: 14, timezone: "America/New_York" });
  });

  it("rejects missing support email and unsupported terms", () => {
    expect(() => parseOnboardingInput({ businessName: "Studio North", paymentTermsDays: 14, timezone: "UTC" })).toThrow("support email");
    expect(() => parseOnboardingInput({ businessName: "Studio North", supportEmail: "owner@example.com", paymentTermsDays: 10, timezone: "UTC" })).toThrow("payment terms");
  });
});
