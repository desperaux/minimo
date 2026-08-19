import { SignIn } from "@clerk/nextjs";

export default function RecoveryPage() { if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return <main className="auth-page"><p>Authentication is not configured for this environment.</p></main>; return <main className="auth-page"><SignIn routing="path" path="/auth/recover" signUpUrl="/auth/sign-up" forceRedirectUrl="/onboarding" /></main>; }
