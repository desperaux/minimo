# minimo

minimo is a focused invoicing product for freelancers and small service businesses.

This repository currently contains the first responsive UI prototype: dashboard, invoice editor, review/send flow, invoice detail timeline, client list, settings, and public invoice view.

Key routes include `/marketing`, `/onboarding`, `/auth/sign-in`, `/auth/sign-up`, `/auth/recover`, `/i/[token]`, and `/api/health`.

## Run locally

```bash
nvm install
nvm use
npm install
npm run dev
```

The repository pins Node.js in `.nvmrc`, npm through `package.json`, and shared editor defaults in `.editorconfig`.

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run check
```

Formatting uses ESLint's safe autofix mode:

```bash
npm run format
npm run format:check
```

## Current scope

Clerk authentication and Neon-backed workspace onboarding are now connected when the required environment variables are configured. Invoice persistence, email delivery, PDF generation, Stripe Connect, and background jobs remain intentionally unconnected. See [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) for local smoke testing and deployment setup.

Read the documentation in the order described by [`docs/README.md`](./docs/README.md) before adding production behavior.
