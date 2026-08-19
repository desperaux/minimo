# Deploying minimo

The current deployable backend slice is Clerk identity plus Neon PostgreSQL workspace onboarding. Invoices, email, PDF generation, Stripe Connect, and background jobs remain prototype-only.

## Local onboarding smoke test

```bash
cp .env.example .env.local
# Set DATABASE_URL to a disposable Neon database.
DEV_AUTH_BYPASS_USER_ID=local_smoke_user
DEV_AUTH_BYPASS_EMAIL=owner@example.com
npm run db:migrate
npm run dev -- --hostname 127.0.0.1
```

Open `/onboarding`, complete the four steps, and confirm the workspace is persisted before the dashboard opens. The development bypass is rejected when `NODE_ENV=production`; never copy it to a deployed environment.

## Clerk

Create a Clerk application and configure email verification. Set these variables in the deployment environment:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up`

The sign-in and sign-up pages use Clerk-hosted flows and redirect verified users to `/onboarding`.

## Neon and Vercel

Create separate Neon databases for preview, staging, and production. Run the migration against the intended database:

```bash
DATABASE_URL="..." npm run db:migrate
```

In Vercel, configure `DATABASE_URL` and the Clerk variables separately for each environment. Vercel uses the repository's `vercel-build` script, which applies the idempotent foundation migration before building the serverless output. A deployment therefore fails before serving traffic if its database is unavailable or the migration cannot be applied.

For an existing deployment that already shows a missing-schema error, redeploy after setting `DATABASE_URL` for the same Vercel environment. The build will apply `migrations/0001_identity_workspace.sql` before the new application code goes live.

No live payment, email, storage, or job credentials are required for this slice.
