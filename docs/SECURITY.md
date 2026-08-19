# Junvo Security and Privacy Requirements

This is an engineering baseline, not a certification claim. Final legal/privacy policies require qualified review.

## 1. Data classification

| Class | Examples | Handling |
|---|---|---|
| Public | Marketing pages, published policies | Normal integrity controls |
| Internal | Feature flags, non-sensitive metrics | Authenticated staff access |
| Confidential | Client emails, addresses, invoices, support records | Encryption, least privilege, redaction |
| Restricted | Secrets, session tokens, webhook secrets | Secret manager, never logged/client-exposed |
| Prohibited | Raw card/CVV, bank credentials, identity documents in MVP | Must not enter Junvo storage/logs |

## 2. Authentication

- Use a maintained authentication system; do not design password crypto casually.
- Verify email before invoice sending.
- Secure, HttpOnly, SameSite cookies over TLS.
- Rotate sessions after authentication/security changes.
- Rate-limit login, signup, verification, and recovery.
- Recovery response does not reveal account existence.
- Require recent authentication for account closure and other sensitive changes.
- MFA/passkeys are P1 but architecture must not block them.

## 3. Authorization

- Deny by default.
- Resolve membership on every protected request.
- Scope every tenant query by `workspace_id`.
- Check permissions server-side, including server actions.
- Return generic not-found for cross-tenant resources where appropriate.
- Admin/support uses separate roles and audited access.
- No â€œsupport impersonationâ€ without explicit controls, visibility, and logs.

## 4. Public links

- At least 128 bits of cryptographic entropy.
- Prefer storing token hashes.
- Rate-limit access and payment-session creation.
- Redact tokens from logs, referrers, analytics, monitoring breadcrumbs, and support screenshots.
- Use `noindex`, safe caching headers, and restrictive referrer policy.
- Provide rotation/revocation.

## 5. Payments and Stripe

- Use Stripe-hosted onboarding and payment collection.
- Secret keys are server-only and environment-specific.
- Verify webhooks using raw request bytes.
- Enforce unique event IDs and idempotent processing.
- Do not trust redirect parameters.
- Store safe provider IDs/statuses only.
- Separate Junvo subscription billing from connected-seller payments.
- Do not claim Junvo is PCI certified merely because Stripe is used; document actual responsibility accurately.

## 6. Input and output

- Validate shape, type, length, range, and allowed values at each boundary.
- Parameterized queries/typed ORM.
- React escaping by default; sanitize any future rich text.
- Reject dangerous file formats; validate logo signature, size, dimensions, and decoded content.
- Normalize email for lookup while preserving display value.
- Prevent mass assignment with explicit allowed fields.
- Add CSRF protection/origin checks for cookie-authenticated mutations.

## 7. Headers and transport

- TLS only and HSTS in production.
- Content Security Policy appropriate to Stripe/auth/analytics integrations.
- `X-Content-Type-Options: nosniff`.
- Frame protections via CSP `frame-ancestors`.
- Restrictive `Permissions-Policy`.
- Secure caching rules for authenticated and public-token pages.
- CORS deny by default; allow only required origins/routes.

## 8. Secrets

- Use environment/platform secret manager.
- Separate local, preview, staging, production secrets.
- Never commit `.env`, keys, provider payload samples containing secrets, or production data.
- Rotate exposed or departing-person credentials immediately.
- Restrict production secret access to necessary operators.
- CI performs secret scanning.

## 9. Logging and analytics

Allowed: safe opaque IDs, action names, latency, safe error codes, request/job IDs.

Prohibited: passwords, cookies, authorization headers, tokens, public invoice URLs, webhook signatures, raw card/bank data, full email bodies, invoice notes/descriptions, full addresses, unredacted provider payloads.

Analytics uses pseudonymous IDs and never client PII.

## 10. Abuse and deliverability

- Verified seller email.
- New-account sending limits and gradual reputation increase.
- Per-user/workspace/IP rate limits.
- Bounce, complaint, and suppression handling.
- Acceptable Use Policy and suspension path.
- Monitor unusual recipient volume, repeated bounces, and template abuse.
- Do not allow Junvo to become a bulk-marketing sender.

## 11. Storage, backups and retention

- Encryption in transit and at rest through managed services.
- Private object buckets; access through authorized/short-lived URLs.
- Managed database backups/PITR.
- Restore tests in isolated environment.
- Retention per documented category; deletion jobs are auditable.
- Production data is not copied into local/preview environments without approved anonymization.

## 12. Dependencies and supply chain

- Lockfile committed.
- Automated vulnerability/dependency updates reviewed.
- Minimize packages and verify ownership/maintenance before adding.
- CI runs static analysis, dependency audit, tests, and build.
- Pin deployment actions/tool versions where practical.
- Generate SBOM if required later.

## 13. Incident response

Prepare before beta:

1. Detection and alerting
2. Named response contacts
3. Containment and credential rotation
4. Evidence preservation with access controls
5. Impact/data assessment
6. Required provider/legal/customer notifications
7. Recovery and validation
8. Post-incident review and corrective work

Do not make notification promises without legal review.

## 14. Security tests and launch gates

- Tenant ID substitution/cross-workspace access tests
- Public token entropy/guessing/rate-limit tests
- CSRF and session tests
- Stored/reflected injection tests for all text fields
- File-upload validation tests
- Webhook invalid-signature, replay, duplicate and ordering tests
- Client-total/status tampering tests
- Secret/log/client-bundle scans
- Dependency audit
- Backup restoration drill
- Access review for production/admin tools

No unresolved critical/high security finding at public launch.

## 15. Age and authority note

Where contracts, company formation, Stripe, banking, or legal approvals require an adult or authorized business representative, use one transparently. Do not misrepresent age, identity, ownership, or authority to a provider.
