import { describe, expect, it } from "vitest";
import { requireWorkspaceScope, scopeQuery } from "./tenant-scope";

describe("tenant scope", () => {
  it("requires a bounded workspace identifier and scopes queries", () => {
    const scope = requireWorkspaceScope("workspace_123");
    expect(scopeQuery(scope, { status: "open" })).toEqual({ status: "open", workspaceId: "workspace_123" });
  });

  it("rejects missing or unsafe workspace identifiers", () => {
    expect(() => requireWorkspaceScope("")).toThrow("workspace scope");
    expect(() => requireWorkspaceScope("workspace with spaces")).toThrow("workspace scope");
    expect(() => requireWorkspaceScope("x".repeat(129))).toThrow("workspace scope");
  });

  it("never lets query input override the trusted workspace", () => {
    const scope = requireWorkspaceScope("workspace_a");
    expect(scopeQuery(scope, { workspaceId: "workspace_b", invoiceId: "invoice_1" })).toEqual({ workspaceId: "workspace_a", invoiceId: "invoice_1" });
  });
});
