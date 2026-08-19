# Junvo Decision Log

This file freezes choices so coding agents do not repeatedly redesign the product. Only entries marked **Accepted** are authoritative.

## Status values

- Proposed
- Accepted
- Superseded
- Rejected
- Deferred

## Decision template

```md
## ADR-XXX â€” Title
Status:
Date:
Owner:
Context:
Decision:
Consequences:
Alternatives considered:
Affected documents/code:
Supersedes:
```

## Accepted decisions

## ADR-001 â€” Product market and scope

**Status:** Accepted  
**Decision:** US-first invoicing SaaS for freelancers and small service businesses. USD and English first. Not full accounting, payroll, inventory, expense management, or CRM.

## ADR-002 â€” Core product loop

**Status:** Accepted  
**Decision:** Create â†’ Send â†’ Track â†’ Remind â†’ Get paid. New features require evidence that they improve this loop.

## ADR-003 â€” Client accounts

**Status:** Accepted  
**Decision:** Clients do not need Junvo accounts to view or pay invoices.

## ADR-004 â€” Historical integrity

**Status:** Accepted  
**Decision:** Issued invoice snapshots are immutable. Corrections create linked replacements/versions; voiding preserves history.

## ADR-005 â€” Financial representation

**Status:** Accepted  
**Decision:** Money uses integer minor units and server-authoritative calculations. Browser totals are display previews.

## ADR-006 â€” Application shape

**Status:** Accepted  
**Decision:** Begin as a TypeScript modular monolith using Next.js and PostgreSQL, with background workers/jobs and vendor adapters. No microservices without measured need.

## ADR-007 â€” Payments

**Status:** Accepted  
**Decision:** Junvo subscription billing and seller invoice payments are separate. Seller payments use Stripe Connect and Stripe-hosted collection. Verified webhooks are authoritative; Junvo does not store raw payment credentials or pool funds.

## ADR-008 â€” Design direction

**Status:** Accepted  
**Decision:** Consumer-simple, friendly and credible; progressive disclosure and one dominant action. Inspired by easeâ€”not copied trade dressâ€”from consumer money/learning apps.

## ADR-009 â€” MVP exclusions

**Status:** Accepted  
**Decision:** Partial payments, recurring invoices, multi-currency, native mobile apps, complex roles, custom sending domains, and global tax automation are outside MVP unless explicitly promoted through a later decision.

## ADR-010 â€” Data minimization

**Status:** Accepted  
**Decision:** Store only data required for account, business, client, invoice, delivery, payment state, audit and operations. Keep client PII out of analytics/logs. Provide export and documented closure/deletion.

## ADR-011 — Brand and trademark

**Status:** Accepted with pre-launch verification gate  
**Decision:**

- Product name: Junvo.
- Display name: Junvo.
- Do not use the ® symbol.
- Junvo may use ™ before registration.
- Record the final production domain after the owner purchases it.
- Do not launch publicly or spend heavily on branding until a professional US trademark clearance search is complete.
- The clearance search must cover similar names and relevant software, financial-service, invoicing, and SaaS classes—not only exact matches.
- Junvo must not be represented as trademark-registered unless registration is separately verified and approved.

## ADR-012 — Legal entity and operating structure

**Status:** Accepted with launch gate  
**Decision:**

- Junvo will be operated through a US legal entity before paid launch.
- Stripe, banking, hosting, and contractual accounts must use truthful, matching business information.
- An eligible adult authorized representative must complete agreements and regulated account verification where required.
- Nigerian development or management activity must be documented truthfully; Junvo must not pretend that its team is located entirely in the US.
- The product may be developed privately before entity formation.
- Live seller onboarding, paid Junvo subscriptions, and production payment processing are blocked until the entity and representative are verified.
- A qualified US/Nigerian professional must confirm tax and cross-border obligations before commercial launch.

## ADR-015 — Precision and rounding

**Status:** Accepted  
**Decision:**

- Store monetary amounts as integer minor units.
- Quantity supports up to 4 decimal places.
- Unit price is entered in the currency's minor unit precision.
- Use decimal arithmetic—never JavaScript floating-point arithmetic.
- Use `ROUND_HALF_UP` when conversion to minor units is required.
- Round each discounted line subtotal to minor units.
- Round tax for each line to minor units.
- Invoice subtotal, tax, and total are sums of the rounded line values.
- Currency metadata determines whether a currency uses 0, 2, or 3 minor digits.
- Persist the calculated breakdown on issuance.

## ADR-016 — Discount and tax ordering

**Status:** Accepted  
**Decision:**

1. Calculate quantity × unit price.
2. Apply line discount.
3. Allocate any invoice-level discount proportionally across eligible lines.
4. Calculate tax on the post-discount taxable amount.
5. Add tax to produce the final total.

**Rules:**

- Percentage values are stored in basis points.
- Maximum discount is 100%.
- The MVP supports tax-exclusive pricing only.
- The MVP supports one manually entered tax rate per line.
- Automatic tax determination, tax-inclusive pricing, and compound taxes are outside MVP scope.
- Junvo does not provide tax advice; sellers are responsible for selecting correct tax rates.
- Proportional discount rounding remainders use the largest-remainder method.

## ADR-017 — Invoice numbering

**Status:** Accepted  
**Decision:**

- Drafts use internal UUIDs and do not consume invoice numbers.
- Allocate the human-readable invoice number atomically when issued.
- Number sequences are unique per workspace.
- Default format: `INV-000001`.
- Issued numbers cannot be reused, changed, or deleted.
- Voided invoices retain their original number.
- Issuance uses a database transaction and sequence lock to prevent duplicates.

## ADR-018 — PDF renderer

**Status:** Accepted  
**Decision:** Use `@react-pdf/renderer` for server-side invoice PDF generation.

**Requirements:**

- Generate PDFs from immutable issued-invoice snapshots.
- Use the same calculation results stored during issuance.
- Support US Letter, multi-page invoices, and repeated table headers.
- PDFs must never be the financial source of truth.

## ADR-019 — Email provider

**Status:** Accepted  
**Decision:** Use Resend for transactional email.

**Requirements:**

- Send invoice and reminder emails through background jobs.
- Configure SPF, DKIM, and DMARC.
- Process delivery, bounce, and complaint webhooks idempotently.
- Never mark an invoice delivered merely because the API accepted it.
- Keep authentication email separate under Clerk.

## ADR-020 — Job and scheduler provider

**Status:** Accepted  
**Decision:** Use Trigger.dev Cloud for background jobs and schedules.

**Requirements:**

- Handle invoice email delivery, reminders, PDF work, and retries.
- Every task must be idempotent.
- Use deterministic concurrency keys per invoice and operation.
- Apply bounded retries with backoff.
- Stop reminders for paid, voided, or cancelled invoices.
- Store authoritative job outcomes in PostgreSQL.

## ADR-021 — Stripe Connect model

**Status:** Accepted  
**Decision:**

- Use Stripe Connect with Stripe-hosted onboarding.
- Use direct charges on connected seller accounts.
- The connected seller is merchant of record.
- Funds move directly to the seller's connected Stripe account.
- Junvo never stores card details or holds client funds.
- Stripe Checkout or another Stripe-hosted payment surface collects payment.
- Sellers handle processing fees, disputes, refunds, and negative balances according to their Stripe agreement.
- Junvo receives payment state through verified, idempotent Stripe webhooks.
- Sellers who cannot obtain an eligible Stripe connected account may still create invoices and record external/manual payments.

## ADR-022 — Junvo fees

**Status:** Accepted  
**Decision:**

- Junvo charges no percentage or application fee on client payments at MVP.
- Junvo earns revenue through Pro subscriptions only.
- Sellers pay Stripe's normal processing fees directly.
- Do not silently add a convenience, payment, or platform fee.
- Introducing transaction fees later requires a new ADR and advance notice.

## ADR-023 — Automatic reminders

**Status:** Accepted  
**Decision:**

- Default schedule:
  - 3 days before the due date.
  - On the due date.
  - 3 days overdue.
  - 7 days overdue.
- Minimum interval between automated reminders: 72 hours.
- Maximum: 4 automatic reminders per invoice.
- Sellers can disable or customize reminders before issuance.
- Stop reminders immediately when an invoice is paid, voided, or cancelled.
- Never send multiple reminders for the same scheduled event.
- Trigger.dev jobs and Resend sends require idempotency keys.

## ADR-024 — Pricing and plan limits

**Status:** Accepted  
**Decision:**

**Free:**

- $0.
- Maximum 5 newly issued invoices per calendar month.
- Unlimited drafts.
- Unlimited clients.
- PDF download.
- Stripe payment links.
- Manual payment recording.
- One automatic reminder schedule.
- Junvo branding on invoices.

**Pro:**

- $9 per month or $90 per year.
- Unlimited reasonable invoice issuance under fair-use rules.
- Remove Junvo invoice branding.
- Custom reminder schedules.
- Recurring invoices when that feature is released.
- Priority support.

**Data rules:**

- Both plans can download PDFs and export their data.
- Never hold export access hostage behind Pro.
- Downgrading does not delete invoices or clients.
- Do not promise “unlimited” in the UI without a documented abuse policy.

## ADR-025 — Refunds, overpayments and duplicates

**Status:** Accepted  
**Decision:**

- Junvo does not automatically refund payments.
- Stripe refunds are initiated by the seller through an authorized workflow.
- Refund status is synchronized through Stripe webhooks.
- All payment creation and webhook processing is idempotent.
- Stripe payments are for an exact amount; arbitrary overpayment is disabled.
- Partial Stripe payments are outside MVP scope.
- Manual payments may produce an overpaid balance, which Junvo displays clearly.
- Duplicate payments are flagged for seller review.
- Junvo never silently applies an overpayment to another invoice.
- Every refund and payment-state change creates an audit event.

## ADR-026 — Data retention

**Status:** Accepted  
**Decision:**

- Active-account invoices, payment records, and audit events remain available until the account is deleted.
- Users must be offered a full export before deletion.
- Account deletion has a 30-day recovery period.
- After that period, customer content is deleted or irreversibly anonymized.
- Deleted data expires from backups within 35 additional days.
- Security logs: 12 months.
- Email delivery-event metadata: 90 days.
- Support conversations: 24 months after closure.
- Junvo's own billing, tax, and accounting records: 7 years.
- Legal holds override normal deletion only where legally necessary.
- Junvo never stores full card numbers, CVCs, government IDs, or client banking credentials.

## ADR-027 — Infrastructure, storage and regions

**Status:** Accepted  
**Decision:**

- Application/API: Vercel, US region.
- Production PostgreSQL: Neon, US region.
- Authentication: Clerk.
- Jobs and schedules: Trigger.dev Cloud.
- Transactional email: Resend.
- Payments: Stripe and Stripe Connect.
- Object storage: Cloudflare R2.
- PDFs: generated using `@react-pdf/renderer`.
- DNS and edge protection: Cloudflare.
- Do not use cPanel for Junvo.
- Keep production and staging databases, buckets, and credentials separate.
- Encrypt traffic in transit and use vendor encryption at rest.
- Store secrets only in provider environment-variable/secret systems.
- Vercel Hobby is allowed only for private development; use a commercial plan before running Junvo as a paid production service.

## ADR-028 — Analytics, monitoring and consent

**Status:** Accepted  
**Decision:**

- Error monitoring: Sentry.
- Product analytics: PostHog US Cloud.
- Disable session replay for MVP.
- Disable automatic text/input capture.
- Never send invoice contents, client names, addresses, emails, payment details, or access tokens to analytics or monitoring.
- Use internal random identifiers instead of email addresses in telemetry.
- Track only an approved event allowlist.
- Disable advertising trackers and cross-site marketing cookies at MVP.
- Publish vendors and purposes in the Privacy Policy.
- Honor Global Privacy Control and applicable deletion/access requests.
- A cookie banner is required before introducing non-essential cookies, advertising pixels, or session replay.

## ADR-013 — Authentication provider

**Status:** Accepted  
**Decision:** Clerk

## ADR-014 — ORM/migration tool

**Status:** Accepted  
**Decision:** Drizzle ORM with PostgreSQL

## Blocking proposed decisions

No blocking ADRs remain in this decision range. All decisions currently recorded in this file are accepted unless explicitly marked otherwise.

## Decision rules

- A coding agent may analyze alternatives but cannot mark a business/legal decision accepted without owner approval.
- Accepted decisions include consequences and affected documents.
- Superseding an entry references the prior ID; never silently edit history to hide a change.
- Code and docs are updated together after acceptance.
- Temporary implementation assumptions are labeled, time-bounded, and must not affect live money/legal behavior.
