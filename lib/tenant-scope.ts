export type WorkspaceScope = { workspaceId: string };

export function requireWorkspaceScope(workspaceId: string): WorkspaceScope {
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(workspaceId)) throw new Error("A valid workspace scope is required.");
  return { workspaceId };
}

export function scopeQuery<T extends object>(scope: WorkspaceScope, query: T): T & WorkspaceScope {
  return { ...query, workspaceId: scope.workspaceId };
}
