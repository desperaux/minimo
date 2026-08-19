# Junvo Test Plan

This plan defines evidence required before code can be called complete. Tests must verify behavior, security, accessibility, and recoveryâ€”not only the happy path.

## 1. Test layers

| Layer | Tool | Responsibility |
|---|---|---|
| Static | TypeScript, ESLint, formatter | Type and code-quality defects |
| Unit | Vitest | Pure calculations, rules, helpers |
| Component | Testing Library | UI behavior and accessibility semantics |
| Integration | Vitest + real test PostgreSQL | Transactions, repositories, webhooks, jobs |
| Contract | Zod/OpenAPI tests | Request/response compatibility |
| E2E | Playwright | Complete seller/client workflows |
| Visual | Playwright screenshots | Invoice/PDF/responsive regressions |
| Security | Automated + targeted manual | Tenant isolation, injection, auth, secrets |
| Operational | Staging drills | Retry, reconciliation, backup/restore, alerts |

Mock vendor networks at unit level; use official test/sandbox modes for integration/E2E. Do not mock away the behavior under test.

## 2. Required CI checks

Every pull request:

1. Dependency/lockfile install
2. Format check
3. Lint
4. Type-check
5. Unit tests
6. Integration tests against isolated database
7. Production build
8. Migration-from-empty check
9. Secret scan
10. Relevant Playwright smoke tests

Main/staging additionally runs full E2E and visual suite.

## 3. Unit suites

### Invoice calculation

- Single/multiple items
- Decimal quantities
- Zero and allowed boundary values
- Discount/tax combinations after policy is accepted
- Rounding boundaries
- Large valid amounts
- Negative/overflow/invalid precision rejection
- Client-submitted total ignored
- Stable calculation version

Use table-driven tests with expected cents, not approximate equality.

### State machine

- Every allowed transition succeeds
- Every disallowed transition fails
- Paid/void reminder ineligibility
- Delivery failure/retry
- Pending payment cannot become paid from redirect
- Out-of-order provider events cannot regress confirmed state

### Reminders

- Before/on/after due evaluation in timezone
- Paid/void/bounced/complained/paused skip
- Minimum safety interval
- Duplicate schedule/job sends once
- State change between scheduling and execution skips safely

### Authorization

- Role permissions
- Closed/disabled user/workspace behavior
- Public-safe serialization excludes private fields

## 4. Integration suites

### Tenant isolation

For every repository/service endpoint:

- Workspace A can access its resource.
- Workspace B using A's resource ID receives safe not-found/forbidden behavior.
- Search, list, aggregate, export, job, and admin paths are included.
- Nested IDs such as client/invoice/payment cannot cross workspaces.

### Invoice issuance

- Valid draft creates one snapshot, event, and send job atomically.
- Failure rolls back all database changes.
- Concurrent sends/number allocation remain unique.
- Double request with same idempotency key returns one logical send.
- Same key/different payload conflicts.
- Issued snapshot remains unchanged after profile/client edits.

### Payments

- Valid signature accepted; invalid rejected.
- Duplicate event processed once.
- Out-of-order events handled.
- Successful payment and invoice balance update atomically.
- Delayed webhook leaves browser redirect in pending state.
- Wrong amount/currency/account is flagged, not blindly applied.
- Manual payment is audited and cannot exceed defined balance rules.
- Reconciliation resolves/alerts stuck processing payments.

### Email

- Send job renders expected safe template.
- Provider IDs correlate to message/invoice.
- Delivery, bounce, complaint and suppression update timeline.
- Hard bounce stops retry/reminders.
- Provider timeout retries without duplicate logical message.

### Database

- Constraints from `DATABASE.md` enforced.
- Migrations apply from empty and from previous release fixture.
- Deletion/closure does not cascade financial history unexpectedly.

## 5. End-to-end scenarios

### Seller happy path

1. Register and verify email.
2. Complete business profile.
3. Create client.
4. Create invoice with multiple items.
5. Review exact totals/PDF.
6. Send once.
7. See delivery and client-view timeline.
8. Client pays in Stripe test mode.
9. Seller sees paid after webhook.

### Recovery paths

- Autosave network failure and recovery
- Stale edit conflict
- Double-click send
- Delivery hard bounce and corrected recipient/resend policy
- Stripe onboarding incomplete/restricted
- Checkout cancelled
- Payment failed
- Payment pending/delayed webhook
- Reminder job skipped because invoice became paid
- PDF generation retry

### Historical integrity

- Change seller/client after sending; historical document unchanged.
- Correct sent invoice; original remains accessible and linked.
- Void invoice; payment action disappears and timeline persists.

### Export and closure

- Request export, authorize download, verify documented data.
- Account closure requires recent auth and preserves disclosed retained records.

## 6. Responsive matrix

Verify core flows at:

- 360 Ã— 800 mobile
- 390 Ã— 844 mobile
- 768 Ã— 1024 tablet
- 1024 Ã— 768 small desktop
- 1440 Ã— 900 desktop

No horizontal page scrolling, covered sticky controls, tiny targets, or desktop-only hover actions.

## 7. Accessibility tests

Automated accessibility checks plus manual verification:

- Keyboard-only core seller and client flows
- Focus order/visibility and modal focus trap/return
- Labels, descriptions and error associations
- Error summary navigation
- Status not color-only
- Screen-reader announcement for autosave/payment processing without noise
- 200% zoom/reflow
- Reduced motion
- Contrast and 44 px targets
- Invoice table semantics and PDF accessibility where supported

## 8. Security tests

- Change every resource ID to another workspace's ID.
- Tamper with totals, currency, status, seller account, recipient, and return URL.
- Replay send/reminder/manual-payment/webhook requests.
- Guess/rate-limit public tokens.
- Submit scripts/markup/oversized input in all text fields.
- CSRF attempt on cookie-authenticated mutations.
- Invalid/old session and permission downgrade.
- Invalid webhook signatures and payload shapes.
- Logo file type/signature/size abuse.
- Scan client bundles/logs/errors for secrets and PII.

## 9. PDF/document tests

Golden/visual cases:

- Minimal invoice
- Long seller/client names and addresses
- Long descriptions
- 1, 10 and 50+ line items
- Multi-page repeated header/page number
- Tax/discount/payment rows
- Large values
- Paid/void status
- PDF and hosted page totals exactly match snapshot

## 10. Operational tests

Before beta:

- Kill/restart worker during job; idempotent recovery
- Provider outage simulation
- Queue backlog and alert
- Webhook delay and reconciliation
- Database point-in-time restore into isolated environment
- Restore one complete invoice/payment/event/PDF flow
- Rotate a non-production secret
- Verify support diagnostic path and audit log

## 11. Test data rules

- Synthetic data only outside production.
- At least two workspaces in isolation tests.
- No real card details; official Stripe test methods only.
- No real uninvolved client addresses/emails.
- Fixtures contain no secrets or public invoice tokens from production.

## 12. Definition of passing

- No failing required check.
- No unresolved critical/high security defect.
- P0 acceptance scenarios pass.
- No known money mismatch between editor, database, snapshot, PDF, public page, and checkout.
- Flaky tests are fixed or quarantined transparently with owner/task; never silently retried until green.
- Any unrun check is reported as unverified.

## 13. Release evidence template

```md
## Release verification
- Commit:
- Environment:
- Migrations tested:
- Static checks:
- Unit/integration tests:
- E2E scenarios:
- Accessibility checks:
- Security checks:
- Manual device/browser checks:
- Known issues:
- Approver:
```
