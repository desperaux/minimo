import { describe, expect, it } from "vitest";
import { failure, success } from "./api-contracts";

describe("API contracts", () => {
  it("creates a success envelope with a request ID", () => {
    expect(success({ status: "queued" }, "req_123")).toEqual({ ok: true, data: { status: "queued" }, requestId: "req_123" });
  });

  it("creates a safe failure envelope with optional field errors", () => {
    expect(failure("VALIDATION_FAILED", "Check the highlighted fields.", "req_456", { fieldErrors: { email: ["Enter a valid email."] } })).toEqual({ ok: false, error: { code: "VALIDATION_FAILED", message: "Check the highlighted fields.", fieldErrors: { email: ["Enter a valid email."] } }, requestId: "req_456" });
  });
});
