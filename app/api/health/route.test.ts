import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/health", () => {
  it("returns an uncached healthy response with the request ID", async () => {
    const response = GET(new Request("http://localhost/api/health", { headers: { "x-request-id": "req_health" } }));
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({ ok: true, data: { status: "ok", service: "minimo-web" }, requestId: "req_health" });
  });
});
