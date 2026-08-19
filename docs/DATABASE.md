# minimo Database Contract

This document defines database invariants. `ARCHITECTURE.md` explains context; this file governs schema implementation.

## 1. Conventions

- PostgreSQL in a US region.
- Opaque UUIDv7 or equivalent sortable IDs.
- `timestamptz` for instants; `date` for invoice calendar dates.
- `char(3)`/validated text for ISO currency.
- Money columns use `bigint` integer minor units.
- Tenant-owned tables include non-null `workspace_id` and an index beginning with it.
- Table/column names use `snake_case`.
- Soft closure/archive timestamps use `*_at`; avoid ambiguous booleans.
- Migrations are version-controlled, forward-safe, reviewed, and tested.

## 2. Tables

### users

| Column | Type | Constraint |
|---|---|---|
| id | uuid | PK |
| auth_provider_user_id | text | UNIQUE NOT NULL |
| email_normalized | text | NOT NULL |
| display_name | text | NULL |
| email_verified_at | timestamptz | NULL |
| disabled_at | timestamptz | NULL |
| created_at | timestamptz | NOT NULL DEFAULT now() |
| updated_at | timestamptz | NOT NULL |

Do not store raw passwords when authentication is delegated.

### workspaces

| Column | Type | Constraint |
|---|---|---|
| id | uuid | PK |
| name | text | NOT NULL |
| slug | text | UNIQUE NOT NULL |
| country_code | char(2) | NOT NULL DEFAULT 'US' |
| currency_code | char(3) | NOT NULL DEFAULT 'USD' |
| timezone | text | NOT NULL |
| invoice_prefix | text | NULL |
| next_invoice_sequence | bigint | NOT NULL, positive |
| logo_object_key | text | NULL |
| support_email | text | NULL |
| stripe_customer_id | text | UNIQUE NULL |
| stripe_connected_account_id | text | UNIQUE NULL |
| stripe_connect_status | text | NOT NULL |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |
| closed_at | timestamptz | NULL |

### workspace_members

Composite PK `(workspace_id, user_id)`. Role is an enum/check of `owner`, `admin`, `member`. Foreign keys cascade only where explicitly safe; closing a workspace should not automatically delete financial history.

### clients

Required: `id`, `workspace_id`, `display_name`, `email`, `email_normalized`, timestamps. Optional: company, phone, structured address JSON, internal notes, `archived_at`.

Indexes:

- `(workspace_id, email_normalized)`
- `(workspace_id, display_name)`
- `(workspace_id, archived_at)`

Client notes are never copied to public snapshots.

### invoices

| Column | Type | Constraint |
|---|---|---|
| id | uuid | PK |
| workspace_id | uuid | FK NOT NULL |
| client_id | uuid | FK NULL; same workspace enforced in service/test |
| invoice_number | text | NULL until reserved, then permanent |
| status | text/enum | NOT NULL |
| currency_code | char(3) | NOT NULL |
| issue_date | date | NOT NULL |
| due_date | date | NOT NULL; `due_date >= issue_date` |
| subtotal_minor | bigint | NOT NULL CHECK >= 0 |
| discount_minor | bigint | NOT NULL CHECK >= 0 |
| tax_minor | bigint | NOT NULL CHECK >= 0 |
| total_minor | bigint | NOT NULL CHECK >= 0 |
| amount_paid_minor | bigint | NOT NULL CHECK >= 0 |
| amount_due_minor | bigint | NOT NULL CHECK >= 0 |
| current_version_id | uuid | NULL |
| public_token_hash | text | UNIQUE NULL |
| sent_at | timestamptz | NULL |
| first_viewed_at | timestamptz | NULL |
| paid_at | timestamptz | NULL |
| voided_at | timestamptz | NULL |
| void_reason | text | NULL |
| replaces_invoice_id | uuid | NULL self-FK |
| created_by_user_id | uuid | FK NOT NULL |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints/indexes:

- Unique partial/index `(workspace_id, invoice_number)` where invoice number is not null.
- `(workspace_id, status, due_date)` for list/reminder queries.
- `(workspace_id, client_id, created_at desc)`.
- `amount_due_minor = total_minor - amount_paid_minor` only if adjustment/refund model preserves that formula; otherwise enforce in service until model is finalized.

### invoice_draft_items

Fields: ID, workspace/invoice IDs, position, description, decimal quantity, unit price cents, calculated line total cents, timestamps.

Unique `(invoice_id, position)`. Description length and decimal precision are validated in schema/service.

### invoice_versions

- Unique `(invoice_id, version_number)`.
- Contains immutable `snapshot_json`, canonical `snapshot_hash`, template/calculation version, optional PDF object key, creator and timestamp.
- Application permissions allow insert/read, never update/delete in ordinary paths.
- Database trigger preventing update/delete is recommended after migration workflow is proven.

### invoice_events

Append-only event timeline with invoice/workspace ID, type, actor type/ID, provider/source event ID, safe JSON metadata, `occurred_at`, and `created_at`.

Indexes:

- `(workspace_id, invoice_id, occurred_at)`
- Unique `(event_type, source_event_id)` when source event exists

### email_messages

Contains workspace/invoice IDs, type, normalized recipient, provider ID, state, unique idempotency key, attempts, safe error code, scheduling/sent timestamps.

Do not store full rendered email indefinitely unless approved by retention rules.

### reminder_rules

Workspace default or invoice-specific rule with timing type, day offset, enabled flag, and approved template fields. Add a check preventing both missing workspace and invoice association.

### payments

Contains workspace/invoice IDs, source (`stripe` or `manual`), provider IDs, status, amount/currency, safe method display, manual actor/note, paid time, timestamps.

Constraints:

- Unique Stripe provider payment ID when non-null.
- Unique provider session ID where applicable.
- Amount positive.
- Currency matches invoice for MVP.
- Manual source requires actor; Stripe source requires provider ID.

### webhook_events

Unique `(provider, provider_event_id)`. State: received, processing, processed, failed, ignored. Payload is redacted JSON or short-retention encrypted object reference. Store attempts and error classification.

### audit_logs

Append-only privileged/security events. Contains safe IDs, action, target, request ID, optional IP hash, safe metadata, timestamp. Never log secrets, tokens, invoice notes, card data, full addresses, or email bodies.

### outbox_jobs

Recommended for transactional consistency:

| Column | Purpose |
|---|---|
| id | Job ID |
| workspace_id | Tenant scope where relevant |
| type | Versioned job type |
| entity_id | Related resource |
| payload_json | Minimal IDs only |
| idempotency_key | UNIQUE |
| state | pending/processing/completed/failed |
| available_at | Scheduling |
| attempts | Retry count |
| locked_at/locked_by | Worker lease |
| last_error_code | Safe diagnostic |
| timestamps | Auditability |

### data_requests

Tracks export/deletion requests, requester, state, completion/expiry, object key, failure code, and timestamps.

## 3. Tenant isolation

- Repositories require `workspace_id` as a parameter.
- Foreign references between tenant-owned records must belong to the same workspace; enforce through composite foreign keys where practical, otherwise transactionally plus tests.
- Background jobs carry workspace/entity IDs and re-resolve authorization/state.
- Admin queries use separate audited services.
- Consider PostgreSQL row-level security as defense in depth, not a replacement for application authorization.

## 4. Transactions and locks

Required transactions:

- Invoice issuance: sequence allocation, snapshot, state, event, outbox.
- Payment application: payment upsert, invoice balance/status, event, receipt job.
- Manual payment: payment, balance/status, audit/event.
- Void/correction linking.
- Token rotation.

Use row locking or optimistic versioning for concurrent invoice/payment changes. Never hold a DB transaction open while calling Stripe, email, storage, or PDF services.

## 5. Idempotency

Unique database constraints are the final defense:

- Send/reminder job idempotency keys
- Provider webhook IDs
- Stripe payment/session IDs
- Invoice event source IDs
- Export request IDs where retries occur

Do not rely only on an in-memory check.

## 6. Immutability and deletion

- Issued versions and financial/audit events are append-only.
- Ordinary account deletion must not cascade-delete them accidentally.
- Object deletion follows the same retention state as the database record.
- Hard deletion/anonymization runs only through a documented retention job.
- Every destructive migration includes a backup, verification query, rollout steps, and rollback/restore plan.

## 7. Migration rules

- One purpose per migration where practical.
- Add nullable/defaulted columns before backfilling and enforcing non-null.
- Create large indexes concurrently where supported.
- Avoid table rewrites during peak production use.
- Migrations must be repeatable in a fresh test database.
- Production application deployment must remain compatible during rolling change.
- Never edit a migration already applied to shared environments; create a new one.

## 8. Required database tests

- Duplicate invoice numbers rejected per workspace but allowed across workspaces.
- Cross-workspace relationships rejected or blocked in service transaction.
- Invalid dates/statuses/negative amounts rejected.
- Concurrent invoice issuance produces unique sequential numbers.
- Duplicate webhook/payment/job IDs become safe no-ops.
- Issued snapshots cannot change through application paths.
- Payment transaction updates balance/status atomically.
- Account closure does not erase retained financial history.
