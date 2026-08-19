import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { failure, success } from "@/lib/api-contracts";
import { getDatabase } from "@/lib/db";
import { validateLogo } from "@/lib/logo";
import { getAuthenticatedIdentity } from "@/lib/server-auth";
import { getObjectStorage } from "@/lib/storage";
import { getRequestId } from "@/lib/request-id";
import { randomUUID } from "node:crypto";

async function getWorkspace(identity: NonNullable<Awaited<ReturnType<typeof getAuthenticatedIdentity>>>) {
  const rows = await getDatabase()`
    SELECT w.id, w.logo_object_key
    FROM workspaces w
    INNER JOIN workspace_members wm ON wm.workspace_id = w.id AND wm.role IN ('owner', 'admin')
    INNER JOIN users u ON u.id = wm.user_id
    WHERE u.auth_provider_user_id = ${identity.authProviderUserId} AND w.closed_at IS NULL
    LIMIT 1
  `;
  return rows[0] as { id: string; logo_object_key: string | null } | undefined;
}

export async function PUT(request: Request) {
  const requestId = getRequestId(request);
  const identity = await getAuthenticatedIdentity();
  if (!identity) return Response.json(failure("UNAUTHENTICATED", "Sign in to continue.", requestId), { status: 401 });

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return Response.json(failure("VALIDATION_FAILED", "Choose a logo image.", requestId), { status: 400 });
    const bytes = new Uint8Array(await file.arrayBuffer());
    const metadata = validateLogo(bytes);
    const workspace = await getWorkspace(identity);
    if (!workspace) return Response.json(failure("NOT_FOUND", "Workspace not found.", requestId), { status: 404 });
    const storage = getObjectStorage();
    const key = `${workspace.id}/logo-${randomUUID()}.${metadata.extension}`;
    await storage.client.send(new PutObjectCommand({ Bucket: storage.bucket, Key: key, Body: bytes, ContentType: metadata.contentType, CacheControl: "private, max-age=3600" }));
    await getDatabase()`UPDATE workspaces SET logo_object_key = ${key}, updated_at = now() WHERE id = ${workspace.id}`;
    return Response.json(success({ logoUrl: `/api/v1/workspace/logo?version=${encodeURIComponent(key)}` }, requestId), { status: 200 });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("valid") || error.message.includes("smaller") || error.message.includes("image"))) return Response.json(failure("VALIDATION_FAILED", error.message, requestId), { status: 400 });
    if (error instanceof Error && error.message.includes("not configured")) return Response.json(failure("PROVIDER_UNAVAILABLE", "Logo storage is not configured. Add the R2 storage variables and redeploy.", requestId), { status: 503 });
    return Response.json(failure("INTERNAL_ERROR", "We could not upload your logo. Try again.", requestId, { retryable: true }), { status: 500 });
  }
}

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const identity = await getAuthenticatedIdentity();
  if (!identity) return Response.json(failure("UNAUTHENTICATED", "Sign in to continue.", requestId), { status: 401 });
  try {
    const workspace = await getWorkspace(identity);
    if (!workspace?.logo_object_key) return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
    const storage = getObjectStorage();
    const object = await storage.client.send(new GetObjectCommand({ Bucket: storage.bucket, Key: workspace.logo_object_key }));
    if (!object.Body) return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
    const body = await object.Body.transformToByteArray();
    const contentType = object.ContentType || "application/octet-stream";
    return new Response(new Blob([body.buffer as ArrayBuffer], { type: contentType }), { status: 200, headers: { "Content-Type": contentType, "Cache-Control": "private, max-age=3600", "X-Content-Type-Options": "nosniff" } });
  } catch {
    return Response.json(failure("INTERNAL_ERROR", "We could not load your logo.", requestId, { retryable: true }), { status: 500 });
  }
}
