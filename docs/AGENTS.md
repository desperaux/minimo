# Junvo coding rules

Read the PRD, business rules, architecture, database, API contracts, design, error states, security, test plan, environments, decisions, and tasks documents before implementing production behavior.

## Non-negotiable rules

- Implement only the requested vertical slice; do not invent features or vendors.
- Treat unresolved entries in `DECISIONS.md` as blockers when they affect money, data, security, privacy, legal obligations, scope, or user trust.
- Never trust client-provided totals, statuses, ownership, workspace IDs, or payment outcomes.
- Keep all tenant-owned access workspace-scoped.
- Store money as integer minor units and keep server calculations authoritative.
- Sent invoice snapshots are immutable; corrections create new linked versions.
- Payment state comes from verified provider webhooks, never browser redirects.
- Never store card credentials, bank credentials, secrets, or raw passwords delegated to an auth provider.
- Use opaque public tokens and never expose internal IDs in public invoice URLs.
- Add loading, empty, validation, failure, retry, and success states.
- Keep analytics, logs, and audit metadata free of client PII, secrets, tokens, and full invoice content.
- Add tests for business rules, idempotency, state transitions, and tenant isolation where applicable.
- Run `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` before declaring work complete.

## Prototype boundary

The current repository is a local UI prototype. Do not represent mock data, local storage, placeholder payment actions, or prototype auth as production behavior. Production integrations require accepted decisions and corresponding backend tests.
