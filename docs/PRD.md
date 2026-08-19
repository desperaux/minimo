# Junvo — Product Requirements Document

> Version 1.0 · Build specification · US-first MVP  
> Working product name: **Junvo** (not yet trademark-cleared)  
> Companion files: [`ARCHITECTURE.md`](./ARCHITECTURE.md) and [`DESIGN.md`](./DESIGN.md)

## 1. Product summary

Junvo is a focused invoicing product for US freelancers and small service businesses. It helps a user create a professional invoice, deliver it reliably, see what happened, follow up without awkward manual chasing, and receive payment through the user's own connected Stripe account.

The product is not an accounting suite. Its core loop is:

**Create → Send → Track → Remind → Get paid**

### Product promise

Send a professional invoice in minutes, know whether the client received it, and make payment the easiest next step.

### Primary outcome

Increase the percentage of invoices paid on time while reducing the work and uncertainty between sending an invoice and receiving payment.

## 2. Problem

Invoice generation is widely available, but users still experience problems around the invoice:

- Products are overloaded with accounting features that make simple invoicing feel difficult.
- Freelancers manually chase overdue clients and worry about sounding aggressive.
- A sent email does not prove that a client received or opened the invoice.
- Invoice emails can land in spam or be overlooked.
- Client payment flows may require accounts, confusing portals, or too many steps.
- Users cannot always tell whether a payment failed, is pending, or was completed.
- Mobile invoice creation is often cramped or desktop-oriented.
- Some tools hide basic customization, exports, reminders, or payment features behind confusing plans.
- Users fear lock-in and want dependable PDF and data exports.

## 3. Evidence status

Current discovery is directional, not statistically conclusive. It includes competitor review and public user discussions. Before expanding scope, validate the highest-risk assumptions with:

- 10–15 interviews with US freelancers and small service-business owners.
- Five observed tests of the complete create-to-paid flow.
- A landing-page demand test focused on payment follow-up rather than invoice design.
- A concierge test in which reminders are manually supervised for early users.

Do not add major features solely because competitors have them.

## 4. Target market

### Initial geography

- United States
- USD invoices first
- English first
- US date, address, and currency conventions

### Primary customer

An independent service provider who sends roughly 1–30 invoices per month and wants a faster, less awkward way to get paid.

Examples include designers, developers, consultants, photographers, videographers, marketers, writers, coaches, cleaners, contractors, and small agencies.

### Secondary customer

A small service-business operator or administrator managing invoices for a team, without needing full accounting software.

### Not initially targeted

- Inventory-heavy businesses
- Retail point-of-sale
- Large finance teams
- Enterprises requiring approval chains
- Businesses needing full double-entry accounting
- Global tax-compliance automation

## 5. Jobs to be done

1. When I finish work, help me send a credible invoice quickly so billing does not become another project.
2. When I send an invoice, show me whether the client viewed it so I know what action to take.
3. When an invoice becomes due, follow up politely so I do not have to write uncomfortable messages.
4. When a client is ready to pay, remove unnecessary steps so payment can happen immediately.
5. When something goes wrong, tell me what happened in plain language and how to fix it.
6. When I leave Junvo, let me export my invoices and customer data.

## 6. Product principles

| Principle | Product implication |
|---|---|
| One obvious next action | Each primary screen has one dominant CTA. |
| Progressive disclosure | Advanced settings appear only when relevant. |
| Calm confidence | Friendly language without childish treatment of money. |
| Speed with control | Helpful defaults, visible review, undo where possible. |
| Status over guesswork | Show sent, viewed, due, overdue, paid, and failed states clearly. |
| Trust by design | Clear sender identity, fees, payment processor, privacy, and support. |
| Mobile-first completion | The complete core loop works comfortably on a phone. |
| Portability | Users can download invoices and export structured data. |

## 7. Goals and success metrics

### MVP goals

- A new user can create and send a valid invoice in under five minutes.
- A returning user can create one from an existing client in under two minutes.
- A client can view and pay without creating a Junvo account.
- Users can see an understandable invoice timeline.
- Automated reminders reduce manual chasing.
- Payment and email failures produce actionable recovery steps.

### North-star metric

**Percentage of sent invoices paid within the seller's selected payment terms.**

### Supporting metrics

| Metric | Initial target or use |
|---|---|
| Activation | First invoice sent within 24 hours of signup |
| Time to first invoice | Median under 5 minutes |
| Delivery success | Monitor accepted, bounced, deferred, and suppressed email |
| View rate | Invoice viewed within 72 hours |
| Payment conversion | Viewed invoices that become paid |
| Time to payment | Median time from sent to paid |
| Reminder recovery | Overdue invoices paid after a reminder |
| Connected-account completion | Users completing Stripe onboarding |
| Support rate | Tickets per 100 sent invoices |
| Retention | Monthly active invoice senders |

Targets should become numeric only after baseline beta data exists.

## 8. MVP scope

### Included

- Email/password or secure magic-link authentication
- Email verification and password reset if passwords are used
- Business profile, logo, address, contact details, default terms, and invoice numbering
- Client create, edit, archive, and search
- Invoice draft creation with line items, quantity, rate, tax, discount, notes, and due date
- Live invoice preview and downloadable PDF
- Save draft, duplicate, send, resend, void, and mark paid manually
- Hosted public invoice page with secure opaque link
- Invoice emails sent through Junvo's delivery provider
- Delivery, bounce, view, reminder, and payment timeline
- Manual and scheduled reminders
- Stripe Connect onboarding for seller payments
- Stripe-hosted client checkout/payment experience
- Card payment in MVP; other methods only when supported and intentionally enabled
- Payment receipt and invoice status synchronization
- Dashboard for outstanding, overdue, and recently paid invoices
- Basic search and filters
- Account export and deletion request
- Admin/support tools with audited access

### Explicit non-goals

- Bookkeeping or ledger
- Bank reconciliation
- Payroll
- Inventory
- Expense tracking
- Full CRM or sales pipeline
- Proposals and contracts
- Time tracking
- Purchase orders
- Complex role permissions
- Multi-entity consolidation
- Automatic tax filing or tax advice
- Cryptocurrency
- Holding or pooling customer funds
- Native mobile apps during MVP
- Custom email domain setup during MVP

## 9. Key product decisions

| Decision | MVP choice |
|---|---|
| Market | US first |
| Currency | USD only at launch; data model remains currency-aware |
| Payments | Stripe Connect; seller is the merchant receiving funds |
| Client account | Not required |
| Invoice delivery | Junvo email plus shareable secure link |
| Invoice mutability | Sent financial snapshot is immutable; corrections create a revision or replacement |
| Payment truth | Verified Stripe webhook events are authoritative |
| Manual payment | Supported with actor and timestamp in audit trail |
| Tax | User-entered rate/amount; Junvo does not calculate legal tax obligations |
| Numbering | Sequential per workspace; uniqueness enforced server-side |
| Deletion | Financial records follow disclosed retention requirements; account access can be removed earlier |
| Brand | Standalone Junvo product; brand system can later support sibling products |

## 10. Information architecture

### Public

- Marketing home
- Pricing
- Sign in / create account
- Terms, Privacy, Cookies, Acceptable Use, Subprocessors
- Public invoice page
- Payment success/failure page

### Authenticated app

- Home
- Invoices
  - All invoices
  - Drafts
  - Outstanding
  - Overdue
  - Paid
  - Invoice details/timeline
- Clients
- Payments
- Settings
  - Business profile
  - Invoice defaults
  - Payments
  - Notifications
  - Billing
  - Data and privacy

## 11. Core user flows

### 11.1 First-run activation

1. Create account.
2. Verify email.
3. Enter business/display name and country.
4. Choose default payment terms.
5. Optionally upload logo.
6. Land on an empty dashboard with **Create invoice** as the primary action.
7. Prompt for Stripe connection when enabling online payment, not before the user understands the value.

### 11.2 Create and send invoice

1. Select or create client.
2. Add one or more line items.
3. Set issue date and due date/terms.
4. Add optional tax, discount, note, and memo.
5. Choose accepted payment option.
6. Review live preview.
7. Select **Send invoice**.
8. Confirm recipient, subject, message, reminder schedule, and payment availability.
9. Server validates, reserves invoice number, creates immutable snapshot, queues email, and records event.
10. User sees confirmation and invoice timeline.

### 11.3 Client view and payment

1. Client opens secure invoice link.
2. Junvo records a privacy-conscious view event.
3. Client reviews seller identity, items, total, due date, and status.
4. Client selects **Pay invoice**.
5. Junvo creates or retrieves an idempotent Stripe payment session for the connected seller.
6. Client completes Stripe-hosted payment.
7. Stripe webhook updates payment and invoice state.
8. Client and seller receive confirmation.

### 11.4 Reminder

1. Scheduler finds eligible open invoices.
2. System checks due date, balance, reminder policy, suppression/bounce state, and recent activity.
3. Reminder is queued exactly once using an idempotency key.
4. Timeline records scheduled, sent, delivered, or failed.
5. Paid or void invoices never receive reminders.

### 11.5 Correction after sending

1. User opens sent invoice.
2. Editable financial fields are locked.
3. User selects **Correct invoice**.
4. System duplicates values into a new revision/draft linked to the original.
5. User sends replacement and optionally voids the original.
6. Both documents remain in the audit history.

## 12. Invoice lifecycle

```text
draft → queued → sent → viewed → paid
                    ↘ overdue → paid
draft/sent/viewed/overdue → void
payment attempt → pending → succeeded | failed | refunded
```

### Status definitions

| Status | Meaning |
|---|---|
| Draft | Editable and not delivered |
| Queued | Send request accepted, delivery pending |
| Sent | Email provider accepted the message |
| Viewed | Public invoice page opened through a valid link |
| Due soon | Optional computed presentation state |
| Overdue | Open balance remains after due date in workspace timezone |
| Paid | Balance due is zero through verified online or recorded manual payment |
| Void | Intentionally cancelled and no longer collectible |
| Refunded | Payment was returned; invoice balance treatment follows refund rules |

## 13. Functional requirements

Priority: **P0** required for launch, **P1** shortly after launch, **P2** later.

### Accounts and workspace

- **ACC-001 P0:** A user can register, authenticate, sign out, and recover access.
- **ACC-002 P0:** Email ownership must be verified before invoice sending.
- **ACC-003 P0:** Authentication and sensitive actions are rate-limited.
- **ACC-004 P0:** A workspace stores business identity separately from user identity.
- **ACC-005 P0:** Users can edit invoice defaults without changing historical snapshots.
- **ACC-006 P1:** Support passkeys or MFA.
- **ACC-007 P1:** Invite a second workspace member with a simple role.

### Clients

- **CLI-001 P0:** Create client with name and email; company, phone, and address are optional.
- **CLI-002 P0:** Validate and normalize email without silently altering it.
- **CLI-003 P0:** Edit or archive a client.
- **CLI-004 P0:** Search clients and reuse them on new invoices.
- **CLI-005 P0:** Historical invoice snapshots do not change when a client record changes.
- **CLI-006 P1:** Import/export clients using CSV.

### Invoice creation

- **INV-001 P0:** Invoice must have a client, at least one valid line item, issue date, due date, and currency.
- **INV-002 P0:** Monetary values are stored as integer minor units, never floats.
- **INV-003 P0:** Totals are calculated server-side and mirrored client-side for preview.
- **INV-004 P0:** Quantity, rate, tax, and discount constraints reject invalid or unsafe values.
- **INV-005 P0:** Invoice numbers are unique within a workspace and reserved transactionally.
- **INV-006 P0:** Drafts can be saved and autosaved.
- **INV-007 P0:** User can duplicate a draft or historical invoice into a new draft.
- **INV-008 P0:** Sending creates a versioned immutable snapshot and PDF.
- **INV-009 P0:** PDF and hosted page show the same financial values.
- **INV-010 P0:** Sent invoices can be voided or corrected but not silently rewritten.
- **INV-011 P1:** Partial payments and deposits.
- **INV-012 P1:** Recurring invoice schedules.
- **INV-013 P2:** Multi-currency display and settlement rules.

### Delivery and public invoice

- **DEL-001 P0:** Send invoice email using an authenticated sending domain.
- **DEL-002 P0:** Include a secure opaque public link; never expose sequential database IDs.
- **DEL-003 P0:** Record provider acceptance, delivery, bounce, complaint, and suppression events when available.
- **DEL-004 P0:** Public page is usable without a Junvo account.
- **DEL-005 P0:** Link access is rate-limited and does not reveal other customer data.
- **DEL-006 P0:** User can copy the public link and download the PDF.
- **DEL-007 P0:** Resend requires confirmation and is throttled.
- **DEL-008 P1:** Optional link expiry/regeneration for sensitive invoices.

### Views and timeline

- **EVT-001 P0:** Record first and latest public-page views using minimal metadata.
- **EVT-002 P0:** Do not claim an email was read solely from an email tracking pixel.
- **EVT-003 P0:** Display a chronological timeline of meaningful events.
- **EVT-004 P0:** Every administrative/manual financial-state change records actor, time, and reason.

### Reminders

- **REM-001 P0:** User can send a manual reminder.
- **REM-002 P0:** User can enable a simple default schedule: before due, on due, and after due.
- **REM-003 P0:** Automated reminders stop when paid, void, bounced, complained, or manually paused.
- **REM-004 P0:** Scheduler and worker must be idempotent.
- **REM-005 P0:** Reminder copy remains polite, factual, and editable before manual sends.
- **REM-006 P0:** Avoid multiple reminders within a configurable safety window.
- **REM-007 P1:** Per-client reminder preferences.

### Payments

- **PAY-001 P0:** Seller completes Stripe-hosted Connect onboarding.
- **PAY-002 P0:** Junvo stores Stripe identifiers and status, never raw card or bank credentials.
- **PAY-003 P0:** Online payment is disabled until the connected account is eligible.
- **PAY-004 P0:** Checkout clearly identifies seller, amount, currency, and invoice.
- **PAY-005 P0:** Webhook signatures are verified using the raw request body.
- **PAY-006 P0:** Webhook processing is idempotent and replay-safe.
- **PAY-007 P0:** The database is updated from verified webhook events, not browser redirects.
- **PAY-008 P0:** Failed and pending payments show plain-language status without exposing processor internals.
- **PAY-009 P0:** Manual payment recording requires confirmation, date, method, and optional note.
- **PAY-010 P1:** Refund state synchronization.
- **PAY-011 P1:** Partial payments.

### Dashboard and reporting

- **DASH-001 P0:** Show outstanding total, overdue total, paid recently, and invoice counts.
- **DASH-002 P0:** Filter invoices by status, date, client, and search term.
- **DASH-003 P0:** Values link to the filtered invoice list that produced them.
- **DASH-004 P1:** Cash-collected trend and average time to payment.

### Data and privacy

- **DAT-001 P0:** User can download individual invoice PDFs.
- **DAT-002 P0:** User can request structured export of account, clients, invoices, and payments.
- **DAT-003 P0:** User can request account deletion and see the applicable retention explanation.
- **DAT-004 P0:** Marketing consent is separate from transactional email.
- **DAT-005 P0:** Analytics avoids invoice descriptions, client names, email addresses, and notes.

## 14. Validation and calculation rules

- All money uses integer minor units and explicit ISO currency code.
- Quantity uses bounded decimal precision defined by the implementation.
- Line total = rounded quantity × unit price according to a single documented rounding policy.
- Subtotal = sum of line totals.
- Discount is applied according to its declared type and ordering.
- Tax is calculated only from user-supplied settings; Junvo does not determine legal nexus or rates.
- Amount due = subtotal − discount + tax − successful/recorded payments + applicable adjustments.
- Due date cannot precede issue date.
- Email addresses are length-limited and normalized for comparison.
- Text inputs have explicit maximum sizes and are encoded safely on output.
- Server calculations are authoritative; the client cannot submit a trusted total.

## 15. Notifications

### Transactional email set

- Verify email
- Password/magic-link access
- Invoice sent
- Invoice reminder
- Payment receipt
- Payment failed or pending action
- Connected-account action required
- Invoice voided or corrected
- Export ready
- Security-sensitive account change

Every email must have a text and HTML version, recognizable sender identity, support contact, and only the minimum necessary client data.

## 16. Error and recovery requirements

| Failure | Required experience |
|---|---|
| Network fails while editing | Preserve local/draft state and allow retry |
| Send request times out | Show pending state; do not invite repeated sends until status resolves |
| Email bounces | Explain that delivery failed and offer address correction/link copy |
| Stripe onboarding incomplete | Show requirements and resume hosted onboarding |
| Checkout cancelled | Return client to invoice with balance unchanged |
| Webhook delayed | Show payment processing, never mark failed prematurely |
| Duplicate webhook/job | Process once and return safely |
| PDF generation fails | Keep invoice snapshot, surface retry, do not send inconsistent output |
| Unauthorized link | Generic not-found/expired experience without data leakage |
| Destructive action | Confirmation explaining consequences; audit event after completion |

## 17. Admin and support

MVP support tools should allow authorized staff to:

- Search by workspace ID, invoice number, or Stripe/email event identifier.
- Inspect invoice state and event timeline without exposing unnecessary sensitive content.
- See delivery/bounce and webhook-processing status.
- Requeue safe idempotent jobs.
- Suspend abusive sending.
- Record support notes and audited administrative actions.
- Never alter invoice totals or mark payments silently.

Support access must use least privilege and be logged.

## 18. Legal and trust deliverables

Required before public launch:

- Terms of Service
- Privacy Policy
- Cookie notice/preferences when non-essential cookies are used
- Data Processing Addendum for eligible business customers
- Acceptable Use Policy, including spam and prohibited invoicing
- Subprocessor list
- Retention/deletion schedule
- Incident-response plan
- Data-subject request process
- Refund/cancellation policy for Junvo subscriptions
- Clear disclosure that payments are processed for sellers through Stripe

Because the founder may be under the age required to enter platform, banking, or company agreements independently, an authorized adult or business representative must handle contracts and accounts wherever legally required. Obtain professional legal/tax review for the operating structure and launch documents.

## 19. Non-functional requirements

| Area | Requirement |
|---|---|
| Availability | Target 99.9% monthly after stable launch; publish honest incidents |
| Performance | Core authenticated pages target LCP under 2.5s at p75 on realistic mobile conditions |
| API | p95 reads under 500 ms and writes under 800 ms excluding third-party latency |
| Accessibility | WCAG 2.2 AA target; keyboard, focus, labels, contrast, reduced motion |
| Responsive | Fully functional from 360 px mobile through desktop |
| Security | TLS, secure cookies, CSRF protection, rate limits, input validation, dependency scanning |
| Reliability | Idempotent email/payment jobs, retries with backoff, dead-letter handling |
| Recovery | Document RPO/RTO before beta; test database restore before launch |
| Observability | Structured logs, request IDs, metrics, traces, and actionable alerts |
| Privacy | Data minimization, retention enforcement, access logging, export/delete workflow |

## 20. Analytics events

Use pseudonymous workspace/user identifiers. Never place client PII, invoice descriptions, notes, or raw URLs in analytics properties.

- `account_created`
- `onboarding_completed`
- `client_created`
- `invoice_draft_created`
- `invoice_previewed`
- `invoice_sent`
- `invoice_send_failed`
- `invoice_viewed`
- `reminder_scheduled`
- `reminder_sent`
- `stripe_connect_started`
- `stripe_connect_completed`
- `payment_started`
- `payment_succeeded`
- `payment_failed`
- `invoice_marked_paid_manual`
- `invoice_voided`
- `export_requested`
- `account_deletion_requested`

## 21. Release plan

### Phase 0 — Prototype

- Clickable responsive prototype
- Five usability tests
- Validate invoice creation, client view, and reminder language

### Phase 1 — Private alpha

- Accounts, clients, drafts, PDF, sending, public pages
- Test data only or tightly controlled real invoices
- Instrument complete funnel

### Phase 2 — Private beta

- Stripe Connect and live payments
- Reminders and delivery events
- 20–50 selected US users
- Manual support and weekly interviews

### Phase 3 — Public beta

- Pricing/billing
- Export/deletion flow
- Legal pages and operational readiness
- Gradual sending limits to protect deliverability

### Phase 4 — General availability

- Reliability targets met
- Restore and incident drills completed
- Support documentation ready
- Launch/growth experiments begin

## 22. Launch gates

Do not launch publicly until:

- All P0 acceptance tests pass.
- Stripe Connect live onboarding and webhook paths are verified.
- No raw payment credentials touch Junvo systems.
- Email domain authentication and bounce/complaint handling are active.
- Invoice totals match between editor, stored snapshot, PDF, public page, and checkout.
- Authorization/tenant-isolation tests pass.
- Rate limits and abuse controls are enabled.
- Backups exist and a restore has been tested.
- Privacy, terms, retention, support, and incident documents are approved.
- Account export and deletion request paths work.
- Accessibility testing covers keyboard and mobile screen-reader basics.
- Monitoring and on-call contact paths are active.

## 23. Acceptance scenarios

1. A new user can sign up, create a client, create an invoice, preview it, and send it.
2. Refreshing or double-clicking send never delivers duplicate invoice emails.
3. A client can open the secure link on mobile and understand the total and due date.
4. A client can pay without creating a Junvo account.
5. The seller is not marked paid until a verified Stripe webhook confirms success.
6. A duplicate Stripe webhook does not create duplicate payments.
7. A bounced invoice shows a recovery action to the seller.
8. A paid, void, or suppressed invoice receives no automated reminder.
9. Updating a client does not change a historical sent invoice.
10. Correcting a sent invoice preserves the old snapshot and records the relationship.
11. One workspace cannot read or mutate another workspace's data by changing an ID.
12. Invoice PDFs and structured exports remain available according to the stated policy.
13. A support action is attributable to an authorized actor.
14. Keyboard-only users can complete the core seller and client flows.
15. Mobile users encounter no horizontal scrolling in core screens.

## 24. Pricing hypotheses

Validate rather than hard-code the model into product architecture.

- Free: limited sent invoices, Junvo branding, essential payment collection.
- Pro: unlimited or higher limits, custom branding, automated reminders, richer insights.
- Optional transaction-based revenue must be disclosed before payment and evaluated against trust and Stripe Connect economics.
- Do not surprise users with fees or lock export behind cancellation.

## 25. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Crowded market | Position around payment follow-through and consumer-simple UX |
| Weak research sample | Conduct direct interviews and instrument beta behavior |
| Email spam/abuse | Verified senders, quotas, rate limits, suppression, abuse monitoring |
| Payment-state errors | Verified idempotent webhooks and reconciliation jobs |
| Stripe dependency | Clear boundaries, event ledger, graceful unavailable states |
| Legal/privacy mistakes | Minimize data and obtain qualified review before launch |
| Cross-tenant leak | Workspace-scoped authorization at repository/service layer plus tests |
| Scope creep | Require evidence and explicit approval for every scope addition |
| Brand conflict | Complete trademark/domain review before committing marketing spend |
| Minor founder authority | Use authorized adult/business representative where required |

## 26. Open decisions

- Final legal entity and contracting party
- Trademark/domain clearance for Junvo
- Exact authentication provider and method
- Exact hosting region and infrastructure vendors
- Stripe Connect account type and charge model after legal/financial review
- Whether Junvo charges a platform fee at launch
- Free-plan invoice limit and paid price
- Default reminder schedule and maximum frequency
- Refund and partial-payment behavior
- Final retention durations by record category
- Whether PDF attachments are sent by default or accessed by secure link

## 27. Definition of done

A feature is complete only when:

- Product acceptance criteria pass.
- Authorization and validation are implemented server-side.
- Loading, empty, error, retry, offline/degraded, and success states exist.
- Mobile, keyboard, and accessibility behavior is verified.
- Analytics and operational events contain no prohibited PII.
- Logs, metrics, alerts, and support diagnostics are available where needed.
- Unit/integration/end-to-end tests cover critical behavior.
- Documentation and migrations are updated.
- Security and privacy implications have been reviewed.

