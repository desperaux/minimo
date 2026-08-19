# Junvo Business Rules

These rules are deterministic product behavior. Changes require an accepted entry in `DECISIONS.md` and corresponding tests.

## 1. Terms

- **Workspace:** seller business account and tenant boundary.
- **Seller:** workspace using Junvo to issue invoices.
- **Client:** recipient of an invoice; no Junvo account required.
- **Draft:** editable invoice not yet issued.
- **Issued version:** immutable financial/document snapshot.
- **Open balance:** total minus successful or recorded payments and applicable adjustments.
- **Provider event:** verified Stripe or email-provider webhook.

## 2. Money

- Currency is USD in MVP.
- Store amounts in integer cents.
- Store quantity with up to 4 decimal places; never use binary floating-point for final calculations.
- Unit prices use the currency's minor-unit precision.
- Use decimal arithmetic and `ROUND_HALF_UP` when conversion to minor units is required.
- Server calculation is authoritative.
- Negative quantity, rate, tax, discount, payment, and total values are rejected unless a later credit-note feature explicitly permits them.
- Total cannot exceed implementation safety limits documented in validation schemas.
- Formatting occurs only at display boundaries.

### Calculation order

1. Calculate quantity Ã— unit rate.
2. Apply line discount and round each discounted line subtotal to minor units.
3. Allocate any invoice-level discount proportionally across eligible lines using largest-remainder rounding.
4. Calculate one manually entered tax rate per line on the post-discount taxable amount and round tax per line to minor units.
5. Subtotal, tax, and total are sums of the rounded line values.
6. Total = subtotal − discount + tax.
7. Amount due = total − successful/recorded payments + valid adjustments.

The MVP supports tax-exclusive pricing only. Automatic tax determination, tax-inclusive pricing, and compound taxes are outside MVP scope. Sellers are responsible for selecting correct tax rates; Junvo does not provide tax advice.

## 3. Invoice numbering

- Invoice numbers are unique per workspace.
- A workspace has a configurable prefix and server-managed sequence.
- Sequence allocation is atomic and concurrency-safe.
- Numbers are never reused after issuing, voiding, or deletion.
- Draft display IDs may be temporary; the issued invoice number is permanent.
- Changing a workspace prefix affects future invoices only.

## 4. Draft rules

- A draft belongs to exactly one workspace.
- Required to send: verified seller email, seller display name, client name/email, at least one valid line, issue date, due date, currency, and valid totals.
- Due date cannot precede issue date.
- Drafts may be autosaved, duplicated, archived, or deleted.
- Updating a reusable client/business profile may update a draft until issuance.
- Client/browser-provided totals are discarded and recalculated.

## 5. Issuance and immutability

- Sending creates an immutable version containing all seller, client, item, date, note, payment, template, and calculation data required for rendering.
- The public page and PDF render from the same versioned snapshot.
- A sent snapshot cannot be edited, even by support staff.
- Non-financial delivery metadata and status can change without changing the snapshot.
- A correction creates a new draft/version linked to the original.
- Voiding does not delete the original record.
- Historical invoices remain unchanged when business or client records change.

## 6. Invoice statuses

Persisted canonical states:

- `draft`
- `queued`
- `sent`
- `paid`
- `void`

Supporting state may include `delivery_failed` or be derived from events. `viewed`, `due_soon`, and `overdue` may be presentation states derived from events/dates unless `DECISIONS.md` accepts persistence.

### Allowed transitions

```text
draft â†’ queued
queued â†’ sent
queued â†’ delivery_failed
delivery_failed â†’ queued
sent â†’ paid
sent â†’ void
delivery_failed â†’ void
paid â†’ refunded/partially_refunded (P1 decision)
```

- `paid` and `void` are terminal for reminder eligibility.
- State transitions are enforced server-side.
- Invalid transitions return a stable conflict error.

## 7. Delivery

- â€œSentâ€ means the email provider accepted the send request; it does not guarantee inbox placement or human reading.
- â€œDeliveredâ€ means the provider reported delivery.
- â€œViewedâ€ means the secure hosted invoice page was opened with a valid token.
- Do not label tracking-pixel activity as definitive reading.
- Hard-bounced and complained recipients are suppressed.
- A resend is throttled and uses a new message record with its own idempotency key.
- Copying the secure link is available even if email delivery fails.

## 8. Reminders

- Reminder eligibility requires an issued open invoice with positive balance.
- Paid, void, hard-bounced, complained, suppressed, paused, or deleted/closed-account invoices are ineligible.
- A reminder job rechecks eligibility immediately before sending.
- One logical scheduled reminder is sent at most once.
- Manual reminders are rate-limited and require confirmation.
- Automatic reminders use workspace timezone.
- If the due date changes through a replacement invoice, the original schedule does not mutate silently.
- Automatic reminders use the accepted schedule: 3 days before due, on the due date, 3 days overdue, and 7 days overdue.
- Automated reminders have a 72-hour minimum interval and a maximum of 4 events per invoice.
- Each scheduled event has one idempotent logical send; paid, void, cancelled, disabled, and zero-balance invoices are ineligible.

## 9. Online payments

- A seller must complete required Stripe Connect onboarding before offering online payment.
- Junvo does not pool seller funds.
- Client payment credentials are collected by Stripe-hosted interfaces.
- Payment amount and currency are created from server-side invoice balance.
- Payment session creation is idempotent.
- Redirect success/cancel parameters never determine payment state.
- A verified Stripe webhook is authoritative for online-payment state.
- Duplicate/out-of-order events must not duplicate payments or regress a terminal success state.
- An invoice becomes paid only when confirmed payments cover its payable balance.
- Pending payments show â€œprocessingâ€ and do not invite immediate duplicate payment.

## 10. Manual payments

- Seller may record an external payment.
- Required: amount, date, method/category, and confirmation.
- Actor, timestamp, and optional note are audited.
- Manual payment cannot exceed allowed balance unless overpayment behavior is later defined.
- Reversal/correction requires a separate audited action; never edit the original payment silently.

## 11. Refunds, duplicates, disputes and partial payments

These are not fully supported in MVP unless explicitly enabled.

- Duplicate successful online payments require support/reconciliation handling and must never be discarded.
- Refund status follows verified provider events.
- Partial-payment and deposit behavior is P1 and must not be simulated through incorrect `paid` status.
- Client invoice disputes are handled through seller contact/support; Junvo does not adjudicate the underlying service dispute.
- The UI must not promise a refund Junvo cannot execute.

## 12. Client access

- Clients do not create accounts in MVP.
- A valid high-entropy token grants access only to its invoice presentation/payment actions.
- Public access never reveals admin notes, other invoices, reusable client data, internal IDs, or workspace controls.
- A rotated/revoked token stops working.
- Paid and void invoices remain viewable according to retention policy but cannot accept another payment.

## 13. Deletion and retention

- Drafts may be deleted according to product rules.
- Issued financial/audit records are not silently hard-deleted on ordinary account closure.
- Account closure removes access and starts documented deletion/anonymization workflows.
- Export should be offered before closure.
- Final retention periods require legal approval and must be represented in `DECISIONS.md` and policy documents.
- Support cannot promise immediate destruction when lawful retention applies.

## 14. Subscription and plan limits

- Plan enforcement occurs server-side.
- Reaching a plan limit never deletes or hides existing invoices.
- Users retain download/export access after downgrade or cancellation according to policy.
- All fees and limits appear before the affected action.
- Free permits five newly issued invoices per calendar month; Pro permits reasonable fair-use issuance.
- Both plans retain PDF download and data-export access; downgrade never deletes invoices or clients.
- Free includes Junvo branding and one automatic reminder schedule; Pro removes branding and permits custom reminder schedules.
- Junvo charges no transaction/application fee at MVP; sellers pay Stripe's processing fees directly.

## 15. Time and dates

- Store instants in UTC.
- Store invoice issue/due dates as calendar dates.
- Evaluate due/overdue/reminder schedules in workspace timezone.
- Display dates using US conventions for MVP while preserving unambiguous machine formats.
- Changing timezone affects future schedule evaluation, not already-recorded event timestamps.

## 16. Auditability

Append events for issuance, delivery changes, public view, reminder, payment changes, manual payment, void, correction, token rotation, export, closure, and support actions.

Audit records are append-only and contain safe metadata, not secrets or full invoice/client content.
