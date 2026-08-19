# Junvo Prototype Status

Updated: 2026-08-19

## Implemented in the local prototype

- Responsive dashboard with invoice summaries and recent invoices
- Invoice editor with live document preview
- Draft validation for client, dates, and line items
- Browser-local draft preservation and reset
- Review/send confirmation flow
- Invoice list search and status filters
- Invoice detail view and timeline
- Invoice duplication, correction, and confirmed void flow with preserved-history messaging
- Client list and client creation, including inline creation from the editor
- Payments view with explicit Stripe-not-connected state
- Reminder preference controls
- Data export and account-closure UI with safe confirmation language
- Public invoice open, paid, void, unavailable, processing, and failed-payment states
- Marketing page, onboarding flow, and draft legal pages
- Loading, not-found, error, security headers, robots, sitemap, and health endpoint
- Shared API, invoice-document, state-machine, token, idempotency, and rate-limit primitives
- Policy-parameterized exact minor-unit invoice calculation primitive with tests
- Accepted invoice calculation policy with four-decimal quantities, basis-point discounts/taxes, and largest-remainder allocation
- Invoice-number formatting and validation primitive with the accepted `INV-000001` default
- Automatic reminder schedule and eligibility primitive with idempotent event identity rules
- Free/Pro plan catalog and server-side entitlement primitive with export access preserved for both plans
- Updated responsive visual system with accessibility skip link, design tokens, mobile editor action bar, pricing cards, and FAQ content
- Structured JSON logger primitive with recursive sensitive-field redaction
- Public token issue/rotation primitives with hash-only verification
- Bounded request-ID extraction for safe API tracing
- Tested browser security-header policy including CSP frame protection
- Production-only HSTS policy with regression coverage
- Tokenized invoice route policy for no-store caching, referrer suppression, and noindex responses
- Settings save and payment-connection actions now show explicit prototype feedback
- Invoice PDF action now explains its pending renderer state instead of silently doing nothing
- Public payment action now explains unavailable prototype connectivity after click
- Payments screen connection action now explains its pending Stripe setup state
- Marketing invoice demo now links through to the public invoice experience
- Invoice editor validation now moves focus to errors and announces autosave status
- Marketing page now has explicit search and social-preview metadata
- Onboarding now validates required business details and focuses its error summary
- Auth forms now expose appropriate email and password-manager autocomplete hints
- Invoice draft autosave now reports local-storage failures without losing in-page edits
- Resetting a draft now handles local-storage removal failures safely
- Rate limiter now rejects ineffective limit and window configurations
- Reminder toggles now expose explicit accessible labels and state
- Inline client creation now focuses and clears validation errors accessibly
- Tenant-scoping primitive requires bounded workspace IDs before query construction
- Tenant-scoping tests prevent query input from overriding the trusted workspace
- Idempotency payloads now have deterministic SHA-256 fingerprints for conflict detection
- Shared email lookup normalization trims, lowercases, and validates addresses
- Inline client creation uses the shared email normalization rule
- Clients screen creation uses the same shared email normalization rule
- Onboarding uses the same shared email normalization rule for support email
- Auth submission uses shared email validation and focuses invalid-input feedback
- Invoice draft validation uses the same shared email normalization rule
- Shared email validation rejects oversized addresses
- Invoice draft validation bounds client, description, quantity, and rate input lengths
- Invoice input limits are centralized for future UI field constraints
- Email normalization safely rejects non-string runtime input
- Invoice draft validation now rejects malformed calendar dates
- Invoice line-item validation now rejects non-decimal and empty numeric values
- Invoice calculation rejects unsafe integer overflow before converting totals
- Public token verification fails closed for malformed runtime inputs
- Rate limiter rejects empty, non-string, and oversized keys
- Public token verification rejects oversized token candidates before hashing
- Invoice hashes and idempotency fingerprints share canonical JSON serialization
- Canonical serialization handles undefined payloads deterministically
- Invoice state checks fail closed for unknown runtime statuses
- Idempotency key generation now validates prefixes before creating keys
- Invoice documents now support deterministic SHA-256 content hashing
- Invoice document snapshots are deeply frozen after cloning

## Verification currently passing

```text
67 unit tests
npm run check
```

## Intentionally not production-connected

- Authentication and verified email
- Workspace/database persistence
- Production issuance wiring for server-authoritative calculation and persisted breakdown
- Invoice numbering transactions
- PDF generation and object storage
- Email provider, deliverability webhooks, and transactional outbox
- Stripe Connect onboarding, checkout, and verified payment webhooks
- Reminder scheduler and background workers
- Export/deletion execution and retention enforcement
- Monitoring, backups, restore drills, and support tooling

These remain gated by the unresolved entries in [`DECISIONS.md`](./DECISIONS.md). Owner options and approval fields are collected in [`DECISION_REQUESTS.md`](./DECISION_REQUESTS.md). The prototype must not be presented as a live invoicing or payment system until those decisions and launch gates are completed.
