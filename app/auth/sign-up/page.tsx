import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() { if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return <main className="auth-page"><p>Authentication is not configured for this environment.</p></main>; return <main className="auth-page"><SignUp routing="path" path="/auth/sign-up" signInUrl="/auth/sign-in" forceRedirectUrl="/onboarding" /></main>; }
