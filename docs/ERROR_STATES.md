# Junvo Error and Recovery States

Every workflow must define what failed, what is safely preserved, and the next action. Never use “Something went wrong” when a more useful safe message exists.

## 1. Error anatomy

Each user-facing error includes:

1. Short problem statement
2. Current known state
3. One primary recovery action
4. Secondary help/reference when useful

Internal exception text, stack traces, SQL/provider codes, and secrets are never displayed.

## 2. Global states

| Condition | User message | Recovery |
|---|---|---|
| Offline | “You're offline. Your latest changes may not be saved yet.” | Preserve local input; retry when online |
| Session expired | “Your session expired. Sign in again to continue.” | Reauthenticate, then return safely |
| Unauthorized | “You don't have access to this.” | Back to workspace/home |
| Not found | “We couldn't find that page.” | Safe navigation; no existence leak |
| Rate limited | “Too many attempts. Try again shortly.” | Disable action until retry time |
| Provider unavailable | “This service is temporarily unavailable.” | Preserve state and retry later |
| Unknown server failure | “We couldn't complete that action. Your reference is {{requestId}}.” | Retry when safe/contact support |

## 3. Draft and autosave

| Condition | Required behavior |
|---|---|
| Initial load fails | Show retry; do not show an editable blank draft that could overwrite data |
| Autosave in progress | Non-blocking “Saving…” |
| Autosave fails | Keep local changes and show “Couldn't save — retrying” |
| Stale version conflict | Stop autosave; explain another version exists; offer reload/review, never overwrite silently |
| Invalid line item | Inline field error; retain all items |
| Client creation fails | Keep invoice draft and entered client data |
| PDF preview fails | Editor remains usable; show preview retry |

## 4. Sending

| Condition | Message/behavior |
|---|---|
| Validation failure | Focus summary and first invalid field; do not queue send |
| Email unverified | Explain verification requirement and resend verification action |
| Double click/retry | Return same queued result through idempotency |
| Request times out after submission | Show “Checking send status…”; do not encourage immediate resend |
| PDF generation fails | Keep issued snapshot/queued state; retry job; do not send inconsistent attachment |
| Provider temporarily rejects | Keep queued/retrying state with plain explanation |
| Hard bounce | “Delivery failed. Check the email address or copy the secure link.” |
| Complaint/suppression | Do not permit resend; explain recipient cannot be emailed through Junvo |

## 5. Public invoice

| Condition | Required state |
|---|---|
| Invalid/expired token | Generic unavailable page; no seller/client/invoice data |
| Invoice void | Clearly “This invoice was voided”; remove pay action |
| Already paid | Paid confirmation; remove pay action |
| Content/PDF unavailable | Show core invoice if safe; PDF retry/download later |
| Network loss | Keep document visible; disable payment initiation until connected |

## 6. Payments

| Condition | Required state |
|---|---|
| Seller not connected | Seller sees onboarding action; client sees payment unavailable/contact seller |
| Connected account restricted | Seller sees action required; no misleading client pay button |
| Checkout creation fails | Balance unchanged; safe retry |
| Checkout cancelled | Return to open invoice; “Payment wasn't completed” |
| Payment failed | Safe reason category if available; retry action; no raw decline details |
| Payment pending | “Payment is processing. You don't need to try again.” |
| Redirect says success but webhook absent | Pending, never paid |
| Duplicate webhook | Safe no-op |
| Out-of-order webhook | Apply transition rules without regression |
| Duplicate payment | Preserve both records; flag reconciliation/support |
| Manual payment conflict | Recalculate current balance; reject stale/excess action safely |

## 7. Reminders

| Condition | Required behavior |
|---|---|
| Invoice became paid before job | Skip and record safe reason |
| Invoice void/suppressed | Skip |
| Duplicate scheduled job | Process once |
| Provider temporary failure | Retry with backoff |
| Hard bounce/complaint | Stop future reminders |
| Manual reminder too soon | Explain safety interval and next allowed time |

## 8. Destructive actions

- Void: state consequence; preserve invoice.
- Client archive: state that historical invoices remain.
- Disconnect payments: explain future invoices/pay buttons affected; do not imply Stripe account deletion.
- Account closure: require recent authentication, explicit phrase/confirmation, and show retention/export information.
- Never use optimistic success for destructive or financial actions.

## 9. Support diagnostics

Every actionable failure should provide a safe request/event reference. Support tools may inspect internal IDs and state through audited access. Do not ask users to send tokens, passwords, card details, webhook secrets, or full private invoice data.

## 10. Accessibility

- Error summary receives focus after failed submission.
- Field messages use `aria-describedby` and are not color-only.
- Async status uses restrained live regions.
- Focus moves only when helpful and predictable.
- Retry buttons have specific labels.
- Toast-only errors are prohibited for actions requiring resolution.

