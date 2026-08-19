import { describe, expect, it } from "vitest";
import { createLogger, redact } from "./logger";

describe("structured logger", () => {
  it("redacts sensitive fields recursively", () => {
    expect(redact({ requestId: "req_1", email: "maya@example.com", nested: { token: "secret" }, safe: "ok" })).toEqual({ requestId: "req_1", email: "[REDACTED]", nested: { token: "[REDACTED]" }, safe: "ok" });
  });

  it("emits JSON with a level, message, and timestamp", () => {
    const lines: string[] = [];
    createLogger(line => lines.push(line))("info", "invoice queued", { requestId: "req_1", email: "maya@example.com" });
    const entry = JSON.parse(lines[0]);
    expect(entry).toMatchObject({ level: "info", message: "invoice queued", requestId: "req_1", email: "[REDACTED]" });
    expect(new Date(entry.timestamp).toString()).not.toBe("Invalid Date");
  });
});
