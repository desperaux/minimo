import { describe, expect, it } from "vitest";
import { getRequestId } from "./request-id";

describe("request ids", () => {
  it("accepts bounded trace identifiers", () => {
    expect(getRequestId(new Request("http://localhost", { headers: { "x-request-id": "req_health-1" } }))).toBe("req_health-1");
  });

  it("replaces malformed or oversized identifiers", () => {
    const request = new Request("http://localhost", { headers: { "x-request-id": "x".repeat(129) } });
    expect(getRequestId(request)).toMatch(/^[0-9a-f-]{36}$/);
  });
});
