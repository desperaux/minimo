import { auth, currentUser } from "@clerk/nextjs/server";

export type AuthenticatedIdentity = {
  authProviderUserId: string;
  email: string;
  emailVerified: boolean;
};

export async function getAuthenticatedIdentity(): Promise<AuthenticatedIdentity | null> {
  const devUserId = process.env.DEV_AUTH_BYPASS_USER_ID;
  const devEmail = process.env.DEV_AUTH_BYPASS_EMAIL;
  if (process.env.NODE_ENV !== "production" && devUserId && devEmail) {
    return { authProviderUserId: devUserId, email: devEmail, emailVerified: true };
  }

  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) return null;
  return { authProviderUserId: userId, email, emailVerified: user.primaryEmailAddress?.verification?.status === "verified" };
}
