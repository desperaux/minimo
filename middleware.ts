import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/", "/onboarding(.*)", "/api/v1(.*)"]);

const clerk = clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) await auth.protect();
});

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  if (!hasClerkKey && process.env.NODE_ENV !== "production") return NextResponse.next();
  return clerk(request, event);
}

export const config = {
  matcher: ["/((?!_next|__clerk|.*\\..*).*)", "/api/(.*)", "/__clerk/:path*"],
};
