# minimo API Contracts

These are implementation contracts. Server actions may replace internal HTTP routes, but inputs, outputs, authorization, errors, and idempotency remain equivalent.

## 1. Conventions

- Base: `/api/v1`
- JSON UTF-8 except raw webhook bodies and PDF downloads.
- Authenticated requests derive user/workspace from secure session; never accept trusted `workspaceId` from browser payload.
- IDs are opaque strings.
- Dates use `YYYY-MM-DD`; instants use ISO 8601 UTC.
- Money uses `{ amountMinor: integer, currency: "USD" }`.
- Unknown input fields are rejected for financial mutations.
- Every response includes `requestId`.

## 2. Response envelope

```ts
type Success<T> = { ok: true; data: T; requestId: string };

type Failure = {
  ok: false;
  error: {
    code: ErrorCode;
    message: string;
    fieldErrors?: Record<string, string[]>;
    retryable?: boolean;
  };
  requestId: string;
};
```

## 3. Stable error codes

```text
UNAUTHENTICATED
FORBIDDEN
NOT_FOUND
VALIDATION_FAILED
CONFLICT
RATE_LIMITED
IDEMPOTENCY_CONFLICT
INVOICE_NOT_EDITABLE
INVALID_STATUS_TRANSITION
PLAN_LIMIT_REACHED
EMAIL_NOT_VERIFIED
DELIVERY_SUPPRESSED
PAYMENTS_NOT_READY
PAYMENT_ALREADY_PROCESSING
PAYMENT_NOT_ALLOWED
PROVIDER_UNAVAILABLE
INTERNAL_ERROR
```

Raw database/provider errors never cross the API boundary.

## 4. Pagination

Cursor pagination:

```ts
type Page<T> = {
  items: T[];
  nextCursor: string | null;
};
```

Default limit 25; maximum 100. Cursor is opaque and validated.

## 5. Client contracts

### `POST /clients`

```ts
type CreateClientInput = {
  displayName: string;
  email: string;
  companyName?: string;
  phone?: string;
  address?: PostalAddress;
};
```

Returns `201` with safe client view. Rejects invalid email/lengths. Duplicate emails may be allowed with an explicit warning policy; do not merge automatically.

### `GET /clients`

Query: `q`, `cursor`, `limit`, `archived`. Workspace scoped.

### `GET|PATCH /clients/:clientId`

Patch uses partial allowed fields and optimistic `version`/`updatedAt` if implemented. Historical snapshots remain unchanged.

### `POST /clients/:clientId/archive`

Idempotent. Archived clients remain on historical invoices.

## 6. Invoice contracts

### Draft input

```ts
type InvoiceDraftInput = {
  clientId?: string;
  client?: { displayName: string; email: string; companyName?: string; address?: PostalAddress };
  issueDate: string;
  dueDate: string;
  currency: "USD";
  items: Array<{
    id?: string;
    description: string;
    quantity: string;
    unitPriceMinor: number;
  }>;
  discount?: { type: "fixed" | "percentage"; value: string | number };
  tax?: { label: string; rate: string };
  notes?: string;
  paymentEnabled: boolean;
  reminderPolicy?: ReminderPolicyInput;
};
```

The server ignores any submitted subtotal/total and returns calculated values.

### `POST /invoices`

Creates draft. Returns `201 InvoiceDetail`.

### `PATCH /invoices/:invoiceId`

Draft only. Requires `If-Match`/version token or accepted concurrency mechanism. Returns conflict if stale.

### `GET /invoices`

Query: `status`, `q`, `clientId`, `dateFrom`, `dateTo`, `cursor`, `limit`. Status filters may include derived `overdue`.

### `GET /invoices/:invoiceId`

Returns seller/admin view with safe timeline. Workspace scoped.

### `POST /invoices/:invoiceId/send`

Headers: `Idempotency-Key` required.

Input:

```ts
type SendInvoiceInput = {
  recipientEmail: string;
  subject?: string;
  message?: string;
  attachPdf?: boolean;
};
```

Returns `202`:

```json
{"ok":true,"data":{"invoiceId":"...","status":"queued"},"requestId":"..."}
```

Repeated identical key/request returns original outcome. Same key with different payload returns `409 IDEMPOTENCY_CONFLICT`.

### `POST /invoices/:invoiceId/reminders`

Manual reminder. Idempotency key required. Reject paid/void/suppressed/rate-limited invoice with stable error.

### `POST /invoices/:invoiceId/void`

Input `{ "reason": "..." }`. Confirmation happens in UI; authorization and transition enforced on server. Returns updated state.

### `POST /invoices/:invoiceId/corrections`

Creates a new draft linked to the issued invoice. Does not mutate original.

### `POST /invoices/:invoiceId/manual-payments`

Input:

```ts
type ManualPaymentInput = {
  amountMinor: number;
  currency: "USD";
  paidAt: string;
  method: "cash" | "check" | "bank_transfer" | "other";
  note?: string;
};
```

Idempotency key required. Returns payment and updated invoice balance.

### `GET /invoices/:invoiceId/pdf`

Authenticated seller download. Returns PDF or `202` with generation state if not ready. Never expose object-storage keys.

## 7. Public invoice contracts

Public token appears in path and must be redacted from logs/analytics.

### `GET /public/invoices/:token`

Returns only client-safe immutable invoice presentation and current safe payment status. No internal IDs, notes, audit data, reusable client record, or seller admin data.

### `POST /public/invoices/:token/views`

Optional explicit event endpoint or server-render event. Rate-limited and deduplicated to avoid inflated counts. No invasive fingerprinting.

### `POST /public/invoices/:token/payment-sessions`

Idempotency key required.

Input may contain only approved return context; amount, currency, account, and invoice come from server state.

Returns:

```ts
{ checkoutUrl: string; paymentState: "created" | "existing" }
```

Rejects paid, void, zero-balance, pending-duplicate, or seller-not-ready states.

## 8. Stripe Connect

### `POST /connect/onboarding`

Authenticated owner/admin. Creates/resumes Stripe-hosted onboarding. Return/refresh URLs are server allowlisted.

### `GET /connect/status`

Returns safe capabilities/status only:

```ts
{
  state: "not_connected" | "incomplete" | "restricted" | "ready";
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  requirementsDue: boolean;
}
```

## 9. Webhooks

### `POST /webhooks/stripe`

- Raw body, provider signature verification, no user session.
- Reject invalid signature.
- Insert unique provider event.
- Return success for known duplicates.
- Acknowledge quickly and enqueue processing.
- Never log raw body or signature.

### `POST /webhooks/email`

- Verify provider signature/authentication.
- Map provider message ID to known message.
- Accept delivery, deferred, bounce, complaint, suppression events.
- Unknown valid events may be recorded/ignored safely without leaking details.

## 10. Account and data

### `POST /data-requests/exports`

Creates idempotent export job. Returns `202` with request ID and state.

### `GET /data-requests/:id`

Requester-only state. Completed download uses short-lived authorized URL.

### `POST /account/closure`

Requires recent authentication and explicit confirmation. Returns disclosed retention/deletion process; does not promise instant hard deletion.

## 11. Dashboard

### `GET /dashboard/summary`

Returns server-calculated USD summary and counts. Every aggregate is workspace scoped and links conceptually to a reproducible list filter.

## 12. Rate-limit groups

Exact thresholds belong in configuration/decision log.

- Authentication/recovery
- Client/invoice writes
- Send/resend/remind
- Public token views
- Payment-session creation
- Webhooks by provider verification and infrastructure controls
- Export/account closure

Rate-limit responses use `429`, safe retry guidance, and `Retry-After` where appropriate.

## 13. Contract testing

- Zod/OpenAPI schemas are generated from or tested against implementation.
- Every route tests authentication, authorization, validation, success, conflict, rate limit, and provider failure where applicable.
- Public response snapshots verify that private fields never appear.
- Frontend consumes typed contracts; it does not duplicate handwritten incompatible types.
