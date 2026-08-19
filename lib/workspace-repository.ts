import { randomBytes, randomUUID } from "node:crypto";
import type { NeonQueryFunction } from "@neondatabase/serverless";
import type { AuthenticatedIdentity } from "@/lib/server-auth";
import type { OnboardingInput } from "@/lib/onboarding";

export type WorkspaceRecord = {
  id: string;
  name: string;
  supportEmail: string;
  timezone: string;
  paymentTermsDays: number;
};

function createWorkspaceSlug(name: string) {
  const readable = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "workspace";
  return `${readable}-${randomBytes(5).toString("hex")}`;
}

export async function createOrGetWorkspace(
  sql: NeonQueryFunction<false, false>,
  identity: AuthenticatedIdentity,
  input: OnboardingInput,
): Promise<WorkspaceRecord> {
  const userId = randomUUID();
  const workspaceId = randomUUID();
  const slug = createWorkspaceSlug(input.businessName);
  const rows = await sql`
    WITH ensured_user AS (
      INSERT INTO users (id, auth_provider_user_id, email_normalized, email_verified_at)
      VALUES (${userId}, ${identity.authProviderUserId}, ${identity.email.trim().toLowerCase()}, now())
      ON CONFLICT (auth_provider_user_id) DO UPDATE
        SET email_normalized = EXCLUDED.email_normalized,
            updated_at = now()
      RETURNING id
    ), existing_workspace AS (
      SELECT w.id, w.name, w.support_email, w.timezone, w.default_payment_terms_days
      FROM workspaces w
      INNER JOIN workspace_members wm ON wm.workspace_id = w.id
      INNER JOIN ensured_user u ON u.id = wm.user_id
      WHERE wm.role = 'owner' AND w.closed_at IS NULL
      LIMIT 1
    ), created_workspace AS (
      INSERT INTO workspaces (id, name, slug, timezone, default_payment_terms_days, support_email)
      SELECT ${workspaceId}, ${input.businessName}, ${slug}, ${input.timezone}, ${input.paymentTermsDays}, ${input.supportEmail}
      WHERE NOT EXISTS (SELECT 1 FROM existing_workspace)
      RETURNING id, name, support_email, timezone, default_payment_terms_days
    ), created_membership AS (
      INSERT INTO workspace_members (workspace_id, user_id, role)
      SELECT ${workspaceId}, id, 'owner' FROM ensured_user
      WHERE NOT EXISTS (SELECT 1 FROM existing_workspace)
    )
    SELECT id, name, support_email, timezone, default_payment_terms_days FROM existing_workspace
    UNION ALL
    SELECT id, name, support_email, timezone, default_payment_terms_days FROM created_workspace
  `;

  const row = rows[0] as { id: string; name: string; support_email: string; timezone: string; default_payment_terms_days: number } | undefined;
  if (!row) throw new Error("Workspace could not be created.");
  return {
    id: row.id,
    name: row.name,
    supportEmail: row.support_email,
    timezone: row.timezone,
    paymentTermsDays: row.default_payment_terms_days,
  };
}
