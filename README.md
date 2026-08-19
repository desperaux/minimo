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

The prototype is local and mock-backed. Authentication, PostgreSQL persistence, email delivery, PDF generation, Stripe Connect, and background jobs are intentionally not connected while the corresponding decisions in [`docs/DECISIONS.md`](./docs/DECISIONS.md) remain unresolved.

Read the documentation in the order described by [`docs/README.md`](./docs/README.md) before adding production behavior.
