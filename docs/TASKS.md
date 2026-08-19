# minimo Build Plan

This is the execution order. A task is not complete until its definition of done and required tests pass. Do not start later payment/reminder work on an unstable invoice core.

## Status legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete with evidence
- `[!]` Blocked; reason recorded

## Milestone 0 â€” Decisions and foundation

- [!] Resolve blocking entries in `DECISIONS.md` — product, vendor, legal, and launch decisions remain open.
- [x] Create repository and place `AGENTS.md` at root; remaining docs in `/docs`
- [x] Pin Node/package-manager versions
- [x] Configure TypeScript strict mode, lint, format and test tools — strict TypeScript, ESLint autofix, Vitest, and EditorConfig are present.
- [x] Configure CI checks
- [x] Create local/preview/staging/production separation
- [x] Add `.env.example` matching `ENVIRONMENTS.md`
- [~] Configure error monitoring and structured logging with redaction — structured logging/redaction is present; monitoring is not connected.
- [x] Establish migration workflow for identity/workspace foundation; seed data remains intentionally out of scope

Exit: fresh clone can install, migrate, seed, test and build using documented commands.

## Milestone 1 â€” Identity and workspace

- [~] Authentication and email verification — Clerk boundary connected; deployment configuration and verification settings remain
- [~] Secure sessions/recovery/rate limits — Clerk sessions connected; app-specific limits remain
- [x] Workspace and membership model — first migration and owner membership path connected
- [x] Business profile and invoice defaults — onboarding persistence connected
- [x] Logo upload validation/storage — authenticated R2 upload and retrieval path with PNG/JPEG/WebP validation.
- [ ] Tenant-scoped repository pattern and isolation tests
- [ ] Onboarding UI and empty dashboard

Exit: verified user can complete profile; Workspace B cannot access Workspace A data.

## Milestone 2 â€” Clients

- [ ] Client schema/migration
- [ ] Create/edit/archive/search services and contracts
- [ ] Client UI and inline creation in invoice editor
- [ ] Validation, empty/error/loading states
- [ ] Tenant-isolation and historical-snapshot tests

Exit: seller can manage reusable clients without cross-tenant leakage.

## Milestone 3 â€” Invoice core

- [x] Finalize calculation/rounding decisions
- [x] Pure calculation engine with policy-aware rounding and discount/tax tests
- [ ] Invoice/item schema and constraints
- [ ] Draft create/edit/autosave with concurrency control
- [ ] Transactional invoice-number allocation
- [ ] Immutable snapshot and hash
- [ ] Invoice editor responsive UI
- [ ] Invoice list/search/filter
- [ ] Correction, duplicate and void services

Exit: draft-to-issued snapshot works and remains unchanged after profile/client edits.

## Milestone 4 â€” Document and public view

- [ ] Shared invoice presentation model
- [ ] Hosted client invoice page
- [ ] High-entropy public tokens, hashing, rotation and rate limits
- [ ] PDF renderer/object storage/download authorization
- [ ] Visual regression cases
- [ ] `noindex`, caching and referrer controls
- [ ] Paid/void/unavailable public states

Exit: public page and PDF exactly match immutable snapshot across edge cases.

## Milestone 5 â€” Delivery and timeline

- [ ] Select/configure email provider and authenticated sending domain
- [ ] Transactional outbox/job system
- [ ] Invoice email templates
- [ ] Idempotent send endpoint/job
- [ ] Verified delivery webhook
- [ ] Delivery/bounce/complaint/suppression states
- [ ] Seller timeline and resend/link recovery
- [ ] Abuse limits/monitoring

Exit: duplicate send is impossible, delivery failures are actionable, suppressed recipients stop.

## Milestone 6 â€” Stripe Connect and payments

- [ ] Adult/authorized business representative and legal/payment-account requirements resolved where applicable
- [ ] Accept Stripe Connect account/charge model decision
- [ ] Stripe-hosted onboarding and capability status
- [ ] Client payment-session creation from server balance
- [ ] Verified raw-body webhook ingestion
- [ ] Idempotent payment application/state transitions
- [ ] Pending/failure/cancel/success UI
- [ ] Reconciliation job and alerts
- [ ] Audited manual payment
- [ ] Full Stripe test-mode E2E suite

Exit: client payment cannot mark paid through redirect/tampering; duplicate events/payments are handled safely.

## Milestone 7 â€” Reminders

- [ ] Accept default schedule/safety interval decision
- [ ] Reminder rules/settings UI
- [x] Eligibility pure function
- [ ] Scheduler and idempotent job
- [ ] Manual reminder rate limits
- [ ] Stop/suppression conditions
- [ ] Email content and timeline
- [ ] Timezone/boundary tests

Exit: eligible invoice gets one reminder; paid/void/bounced/suppressed invoice gets none.

## Milestone 8 â€” Dashboard and operations

- [ ] Outstanding/overdue/recently-paid aggregates
- [ ] Filters reproduce aggregate source
- [ ] Payment list
- [ ] Support search/diagnostics with audited access
- [ ] Safe job replay and abuse suspension
- [ ] Metrics, alerts and runbooks
- [ ] Backup/restore drill

Exit: operators can diagnose core failures without exposing or editing financial data.

## Milestone 9 â€” Privacy, export and closure

- [ ] Finalize retention schedule with qualified review
- [ ] Structured export and PDF availability
- [ ] Account closure/deletion/anonymization workflow
- [ ] Data-request authentication and expiry
- [ ] Privacy/Terms/AUP/Subprocessors/Cookies pages
- [ ] Analytics privacy audit

Exit: export and closure work exactly as disclosed; retained data is justified and restricted.

## Milestone 10 â€” Pricing and public beta

- [ ] Accept pricing/plan-limit decisions
- [ ] minimo subscription billing separated from seller payments
- [ ] Server-side plan enforcement
- [ ] Pricing/billing/cancellation UI
- [ ] Preserve export/download after downgrade according to policy
- [ ] Public launch checklist from PRD
- [ ] 20â€“50 user beta and weekly feedback review

Exit: no hidden fees/limits; P0 gates, legal pages and operational drills complete.

## Per-task template

```md
### TASK-ID â€” Title
Status: [ ]
Requirements: PRD IDs/sections
Rules: BUSINESS_RULES sections
Contracts: API/database references
Design: screens/components/states
Dependencies:
Out of scope:
Implementation steps:
Tests:
Definition of done:
Evidence:
Open questions:
```

## Scope-change rule

New feature requests go to the backlog until they include evidence, user outcome, MVP impact, data/security implications, acceptance criteria, and an accepted decision. Coding agents must not add them opportunistically.
