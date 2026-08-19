# Junvo Coding Agent Instructions

This file is the highest-priority project instruction for coding agents. Place a copy at the repository root.

## Required reading order

Before planning or editing, read:

1. `AGENTS.md`
2. `docs/PRD.md`
3. `docs/BUSINESS_RULES.md`
4. `docs/ARCHITECTURE.md`
5. `docs/DATABASE.md`
6. `docs/API_CONTRACTS.md`
7. `docs/DESIGN.md`
8. `docs/ERROR_STATES.md`
9. `docs/SECURITY.md`
10. `docs/TEST_PLAN.md`
11. `docs/ENVIRONMENT.md`
12. `docs/DECISIONS.md`
13. `docs/TASKS.md`

If a file does not exist, report it before implementation. Do not guess its contents.

## Source-of-truth order

When documents conflict, use this precedence:

1. Explicit current user instruction
2. `AGENTS.md`
3. Accepted entries in `DECISIONS.md`
4. `BUSINESS_RULES.md` and `SECURITY.md`
5. `PRD.md`
6. `DATABASE.md` and `API_CONTRACTS.md`
7. `ARCHITECTURE.md`
8. `DESIGN.md`
9. `TASKS.md`

Stop and report material conflicts. Do not silently choose.

## Mandatory behavior

- Implement only the requested task and its necessary tests.
- Do not invent features, routes, fields, dependencies, plans, prices, metrics, copy, or vendors.
- If a decision is missing and affects data, money, security, privacy, UX, or scope, ask before implementing.
- Prefer the simplest implementation consistent with the documents.
- Inspect existing code before creating a new pattern.
- Reuse existing components and dependencies where suitable.
- Do not rewrite unrelated code or perform drive-by refactors.
- Preserve user changes in a dirty worktree.
- Never disable, delete, weaken, or skip a failing test to claim success.
- Never hide errors with `any`, `@ts-ignore`, empty catches, fake data, or hard-coded success states.
- Never use placeholder authentication, authorization, payment, email, or webhook behavior in production paths.
- Do not declare completion from visual appearance alone.

## Financial invariants

- Money uses integer minor units and an explicit ISO currency.
- The server recalculates every total; browser totals are previews only.
- Sent invoice snapshots are immutable.
- Corrections create a new version/replacement; they never rewrite history.
- A browser redirect never marks a Stripe payment successful.
- Only verified, idempotently processed provider events or an audited manual action can change payment state.
- Duplicate sends, reminders, jobs, and webhooks must be safe no-ops.

## Security invariants

- Every tenant-owned query is scoped by authenticated `workspace_id`.
- Never trust resource ownership supplied by the client.
- Public invoice pages use high-entropy opaque tokens, not database IDs.
- Secrets remain server-only and never appear in logs or client bundles.
- Never store card numbers, CVV, bank credentials, identity documents, or Stripe secret keys in application tables.
- Validate at every trust boundary and encode output safely.
- Webhooks use the raw request body and verified provider signatures.
- Sensitive or destructive actions require authorization, confirmation, and an audit event.

## UI requirements

- Follow `DESIGN.md`; do not invent a separate design language.
- One dominant action per screen or decision point.
- Implement mobile and desktop together.
- Include loading, empty, validation, disabled, pending, failure, retry, and success states.
- Preserve keyboard navigation, labels, focus, semantic HTML, and sufficient contrast.
- Never use fake testimonials, fabricated metrics, or unearned security/compliance claims.

## Change workflow

Before editing:

1. Restate the requested outcome.
2. Identify affected requirements and business rules.
3. Inspect relevant code, schema, tests, and dependencies.
4. List a short implementation plan.
5. Note unresolved decisions or risks.

During editing:

1. Work in the smallest coherent vertical slice.
2. Keep domain rules in services/pure functions, not UI components.
3. Add or update tests alongside behavior.
4. Add migrations for schema changes; never mutate production schema manually.
5. Update affected contracts and documentation.

Before completion:

1. Format and lint.
2. Type-check.
3. Run relevant unit and integration tests.
4. Run relevant end-to-end tests.
5. Run the production build.
6. Inspect the diff for unrelated changes and leaked secrets.
7. Verify relevant mobile and desktop flows.
8. Report exactly what passed, failed, or was not run.

## Completion report

Every completion message must list:

- Outcome
- Changed files
- Database migrations
- New/changed environment variables
- Tests and checks actually executed
- Manual verification performed
- Remaining risks, assumptions, or follow-up work

Never say â€œfully tested,â€ â€œsecure,â€ or â€œproduction-readyâ€ unless the stated evidence proves it.

## Prohibited shortcuts

- No mock payment success in production code
- No shared global workspace ID
- No authorization only in the UI
- No floating-point totals
- No sequential public invoice URLs
- No raw provider errors shown to users
- No secrets in `NEXT_PUBLIC_*`
- No synchronous email call inside the invoice database transaction
- No destructive migration without an approved rollout/rollback plan
- No analytics containing client email, invoice description, notes, address, or secure URLs

## Stop conditions

Stop and request direction when:

- The requested feature conflicts with an accepted decision.
- Required legal/payment behavior is unspecified.
- A schema change risks irreversible data loss.
- A security control would need to be removed or bypassed.
- A real vendor account, live payment, or production mutation needs authority not provided.
- Tests reveal an unrelated pre-existing failure that blocks reliable verification.
