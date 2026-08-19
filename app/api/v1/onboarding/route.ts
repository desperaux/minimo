import { failure, success } from "@/lib/api-contracts";
import { getDatabase } from "@/lib/db";
import { parseOnboardingInput } from "@/lib/onboarding";
import { getAuthenticatedIdentity } from "@/lib/server-auth";
import { createOrGetWorkspace } from "@/lib/workspace-repository";
import { getRequestId } from "@/lib/request-id";

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const identity = await getAuthenticatedIdentity();
  if (!identity) return Response.json(failure("UNAUTHENTICATED", "Sign in to continue.", requestId), { status: 401 });
  if (!identity.emailVerified) return Response.json(failure("EMAIL_NOT_VERIFIED", "Verify your email before setting up your workspace.", requestId), { status: 403 });

  try {
    const input = parseOnboardingInput(await request.json());
    const workspace = await createOrGetWorkspace(getDatabase(), identity, input);
    return Response.json(success({ workspace }, requestId), { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) return Response.json(failure("VALIDATION_FAILED", "Enter valid onboarding details.", requestId), { status: 400 });
    if (error instanceof Error && (error.message.includes("valid") || error.message.includes("invalid"))) {
      return Response.json(failure("VALIDATION_FAILED", error.message, requestId), { status: 400 });
    }
    if (error instanceof Error && error.message.includes("DATABASE_URL")) {
      return Response.json(failure("PROVIDER_UNAVAILABLE", "Database configuration is missing. Add DATABASE_URL and redeploy.", requestId), { status: 503, headers: { "Retry-After": "60" } });
    }
    if (error instanceof Error && /relation \"(users|workspaces|workspace_members)\" does not exist/i.test(error.message)) {
      return Response.json(failure("PROVIDER_UNAVAILABLE", "Database setup is incomplete. Run the database migration and redeploy.", requestId), { status: 503, headers: { "Retry-After": "60" } });
    }
    return Response.json(failure("INTERNAL_ERROR", "We could not save your workspace. Try again.", requestId, { retryable: true }), { status: 500 });
  }
}
