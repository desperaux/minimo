# Environments

minimo uses separate local, preview, staging, and production environments. Data, secrets, cookies, databases, storage, jobs, and vendor accounts must never be shared across environments.

## Environment boundaries

| Environment | Purpose | Data policy | Deployments |
|---|---|---|---|
| Local | Developer work and UI prototype | Disposable local data; no production records | Manual |
| Preview | Pull-request review | Disposable isolated data; safe test credentials only | Per pull request |
| Staging | Release verification and vendor test mode | Non-production seeded data; test-mode vendors | Controlled promotion |
| Production | Real customer service | Real customer data; production vendors and secrets | Approved release only |

## Variables

`.env.example` is the inventory of integration variables. Values are supplied by the environment owner and must never be committed.

| Variable | Local prototype | Preview/staging | Production | Purpose |
|---|---|---|---|---|
| `APP_URL` | Optional | Required | Required | Canonical application URL |
| `DATABASE_URL` | Not required yet | Required when persistence is enabled | Required | Environment-specific PostgreSQL connection |
| `AUTH_PROVIDER_KEY` | Not required yet | Test credential | Production credential | Authentication provider access |
| `STRIPE_SECRET_KEY` | Not required yet | Stripe test mode | Stripe production mode | Server-side Stripe access |
| `STRIPE_WEBHOOK_SECRET` | Not required yet | Test webhook signing secret | Production webhook signing secret | Webhook verification |
| `EMAIL_PROVIDER_API_KEY` | Not required yet | Test/sandbox credential | Production credential | Transactional delivery |
| `OBJECT_STORAGE_BUCKET` | Not required yet | Isolated bucket | Production bucket | PDFs, logos, and exports |
| `SENTRY_DSN` | Optional | Staging project | Production project | Error monitoring |
| `POSTHOG_KEY` | Not required yet | Non-production project | Production project after consent review | Product analytics |

## Rules

- Do not copy production data into local, preview, or staging environments.
- Do not use production secrets in a developer shell, pull request, or test suite.
- Staging must use test-mode payment and email providers.
- Public URLs, cookies, webhook endpoints, storage buckets, and job queues are environment-specific.
- Missing integration variables should fail the affected production path clearly; the local prototype remains runnable without them.
- Secrets are injected by the deployment environment or a local untracked `.env.local` file.

## Local setup

```bash
cp .env.example .env.local
nvm install
npm install
npm run dev
```

The current prototype requires no non-commented values in `.env.local`. Production integrations remain gated by the unresolved decisions in [`DECISIONS.md`](./DECISIONS.md).
