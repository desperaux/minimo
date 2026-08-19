# Owner Decision Requests

This is a historical owner-review brief. The authoritative status and decision for each ADR is maintained in [`DECISIONS.md`](./DECISIONS.md). Accepted ADRs—including ADR-018, ADR-019, and ADR-020—must not be reopened based on the alternatives below. A provider may be reconsidered only if a verified technical incompatibility is discovered and documented in a new or superseding ADR.

## ADR-011 — minimo brand, domain, and trademark clearance

1. **Decision requested:** May minimo use the name and selected domain for public launch?
2. **Options:** (A) Proceed with minimo after trademark/domain clearance; (B) choose a replacement name before launch; (C) use minimo only as an internal prototype name.
3. **Recommendation:** A, subject to documented clearance.
4. **Benefits / risks / cost:** A preserves current product identity; risk is rebrand exposure if clearance fails; cost is legal search and domain registration. B reduces trademark risk but creates rework. C minimizes launch risk but delays public branding.
5. **Implementation consequences:** Freeze brand tokens, domains, metadata, email sender identity, legal pages, and redirects only after selection.
6. **Owner selection:** ____________________

## ADR-012 — Legal entity and operating structure

1. **Decision requested:** Which legal entity and authorized representative will contract with vendors and operate the service, including the US/Nigeria structure?
2. **Options:** (A) One US entity; (B) one Nigerian entity; (C) a documented US/Nigeria parent-subsidiary or contractor structure after legal advice.
3. **Recommendation:** C if both jurisdictions are genuinely involved; otherwise select the single jurisdiction where the operating entity is established.
4. **Benefits / risks / cost:** A may simplify US vendor access but can create Nigerian tax/compliance exposure. B may simplify local operations but can complicate US vendors and payments. C matches cross-border reality but has the highest legal and accounting cost.
5. **Implementation consequences:** Determines contracts, tax treatment, payment-account ownership, privacy notices, support disclosures, and authorized-user controls.
6. **Owner selection:** ____________________

## ADR-015 — Quantity precision and rounding

1. **Decision requested:** What quantity scale, accepted input format, and rounding mode govern invoice calculations?
2. **Options:** (A) Quantity up to 2 decimal places, half-up rounding; (B) quantity up to 3 decimal places, half-up rounding; (C) arbitrary bounded decimal quantity with explicit per-line half-even or half-up rounding.
3. **Recommendation:** A for the US-first MVP unless target customers require fractional labor/material quantities.
4. **Benefits / risks / cost:** A is easiest to explain, test, and display; risk is insufficient precision for some trades. B supports more use cases with modest complexity. C is flexible but increases validation, UI, support, and audit cost.
5. **Implementation consequences:** Fixes database precision, parser rules, minor-unit calculation, display formatting, API schemas, migration constraints, and exhaustive cents tests.
6. **Owner selection:** ____________________

## ADR-016 — Discount and tax rules

1. **Decision requested:** How are discounts and taxes represented, ordered, rounded, and applied?
2. **Options:** (A) No tax/discount in MVP; (B) one invoice-level percentage discount followed by one tax percentage; (C) line-level and invoice-level rules with configurable tax-on-discount behavior.
3. **Recommendation:** A for MVP, unless validated customer demand requires B.
4. **Benefits / risks / cost:** A avoids incorrect tax advice and calculation disputes. B adds useful functionality but creates ordering and disclosure obligations. C is most capable but has high legal, calculation, UI, and testing cost.
5. **Implementation consequences:** Defines invoice schema, calculation order, rounding, labels, PDF/email output, API contracts, and tax disclaimers.
6. **Owner selection:** ____________________

## ADR-017 — Invoice-number allocation timing

1. **Decision requested:** When is an invoice number reserved and what happens to gaps?
2. **Options:** (A) Allocate only at issuance; (B) allocate at draft creation and retain gaps; (C) allocate from a draft sequence and assign a final sequence at issuance.
3. **Recommendation:** A, with an immutable issuance transaction.
4. **Benefits / risks / cost:** A minimizes unused numbers and keeps numbering tied to issued records; drafts do not have final numbers. B is simpler but creates visible gaps. C is flexible but increases audit and concurrency complexity.
5. **Implementation consequences:** Determines transaction boundaries, uniqueness constraints, concurrency handling, correction/void numbering, UI labels, and audit events.
6. **Owner selection:** ____________________

## ADR-018 — PDF renderer

1. **Decision requested:** Which renderer and rendering boundary produce invoice PDFs?
2. **Options:** (A) `@react-pdf/renderer`; (B) server-side HTML/CSS to headless-browser PDF; (C) managed PDF service.
3. **Recommendation:** A for deterministic invoice layouts if its supported CSS/layout is sufficient.
4. **Benefits / risks / cost:** A keeps rendering in the application with lower vendor cost but has layout limitations. B offers browser fidelity but adds runtime size and operational complexity. C reduces operations work but adds recurring cost, data transfer, and vendor dependency.
5. **Implementation consequences:** Requires an immutable snapshot renderer, authorization, storage, font/assets policy, regression fixtures, download headers, and failure/retry handling.
6. **Owner selection:** ____________________

## ADR-019 — Email provider

1. **Decision requested:** Which provider sends invoice, reminder, recovery, and transactional email?
2. **Options:** (A) Resend; (B) Postmark; (C) Amazon SES.
3. **Recommendation:** A for fastest integration, subject to deliverability, regional, and contractual review.
4. **Benefits / risks / cost:** A has a simple developer experience but creates provider dependency and usage cost. B is strong for transactional deliverability but may cost more. C is cost-efficient at scale but requires more operational setup.
5. **Implementation consequences:** Determines API adapter, sending-domain authentication, templates, webhook verification, suppression handling, retention, and outbox retries.
6. **Owner selection:** ____________________

## ADR-020 — Job and scheduler provider

1. **Decision requested:** Where should delivery, reminders, reconciliation, and other background jobs run?
2. **Options:** (A) Trigger.dev; (B) managed queue plus worker, such as SQS and a deployed worker; (C) database-backed jobs with a managed cron/worker.
3. **Recommendation:** A for MVP if its region, reliability, and data-processing terms are acceptable.
4. **Benefits / risks / cost:** A reduces custom worker operations but adds vendor dependency. B provides mature control and scale with higher setup cost. C minimizes vendors but increases operational and concurrency responsibility.
5. **Implementation consequences:** Defines job idempotency, retry/dead-letter behavior, secrets, observability, scheduling, replay controls, and data residency.
6. **Owner selection:** ____________________

## ADR-021 — Stripe Connect account and charge model

1. **Decision requested:** Which Connect account type and charge model represent seller payments?
2. **Options:** (A) Standard accounts with direct charges; (B) Express accounts with destination charges; (C) Custom accounts with destination or separate charges and transfers.
3. **Recommendation:** B if minimo needs controlled onboarding and application fees without becoming the merchant of record; legal/payment review is required.
4. **Benefits / risks / cost:** A lowers platform responsibility but limits control. B balances control and implementation effort but adds platform obligations. C offers maximum control but has the highest compliance, support, and engineering cost.
5. **Implementation consequences:** Determines onboarding, capability checks, checkout creation, fee collection, refunds, disputes, webhook events, KYC responsibilities, and ledger/reconciliation design.
6. **Owner selection:** ____________________

## ADR-022 — Platform and transaction fees

1. **Decision requested:** Will minimo charge platform fees, and who pays them?
2. **Options:** (A) No minimo fee during MVP; (B) transparent percentage fee paid by the seller; (C) transparent fixed/percentage fee passed to the client where legally and commercially permitted.
3. **Recommendation:** A during MVP unless revenue validation requires B.
4. **Benefits / risks / cost:** A simplifies disclosure and reconciliation but delays revenue. B creates predictable revenue with seller pricing sensitivity. C may improve seller economics but risks client surprise, legal limits, and checkout complexity.
5. **Implementation consequences:** Affects Stripe application fees, invoice/payment totals, pricing pages, receipts, refunds, tax treatment, and plan enforcement.
6. **Owner selection:** ____________________

## ADR-023 — Reminder schedule and safety interval

1. **Decision requested:** What reminders are sent, when, and with what minimum interval?
2. **Options:** (A) One reminder 3 days after due date, minimum 7-day interval; (B) reminders 3 and 14 days after due date, minimum 7-day interval; (C) seller-configurable schedule with bounded defaults and a minimum interval.
3. **Recommendation:** A for MVP.
4. **Benefits / risks / cost:** A is predictable and low-abuse but less flexible. B may improve collections while increasing annoyance and deliverability risk. C serves more sellers but requires settings, timezone, validation, and support complexity.
5. **Implementation consequences:** Defines eligibility, timezone boundaries, scheduler jobs, idempotency keys, suppression rules, UI copy, and timeline events.
6. **Owner selection:** ____________________

## ADR-024 — Pricing and plan limits

1. **Decision requested:** What are Free/Pro prices, limits, branding rules, reminder access, and export access?
2. **Options:** (A) Free plan with limited monthly invoices and branded PDFs; Pro removes limits/branding; (B) free trial followed by one paid plan; (C) no Free plan, paid-only beta.
3. **Recommendation:** A if acquisition is the priority; B if support and abuse costs must be constrained.
4. **Benefits / risks / cost:** A lowers adoption friction but increases free-tier abuse and support cost. B simplifies monetization but may reduce conversion. C is operationally simplest but narrows learning and reach.
5. **Implementation consequences:** Requires billing provider separation, server-side entitlement checks, downgrade/export behavior, UI, invoices, cancellation, and usage metering.
6. **Owner selection:** ____________________

## ADR-025 — Refunds, overpayments, and duplicate payments

1. **Decision requested:** How are refunds, excess payments, and duplicate webhook/payment events handled?
2. **Options:** (A) Manual review and seller-initiated refunds only; (B) automatic full refund for duplicate/excess payments; (C) retain excess as account credit with seller approval.
3. **Recommendation:** A for MVP, with clear support procedures and immutable audit records.
4. **Benefits / risks / cost:** A avoids unsafe automation but costs support time. B improves speed but risks incorrect refunds and fraud. C supports future workflows but creates credit accounting and legal complexity.
5. **Implementation consequences:** Defines payment state transitions, idempotency, ledger records, refund authorization, notifications, reconciliation, and customer support tooling.
6. **Owner selection:** ____________________

## ADR-026 — Retention periods

1. **Decision requested:** How long are account, client, invoice, delivery, payment, audit, and support records retained?
2. **Options:** (A) Category-specific minimum retention with deletion/anonymization afterward; (B) fixed seven-year financial retention plus shorter operational retention; (C) jurisdiction-specific schedules after qualified legal review.
3. **Recommendation:** C, implemented as a documented category-specific schedule.
4. **Benefits / risks / cost:** A minimizes data but may conflict with legal/accounting needs. B is simple but over-retains some data. C is defensible but requires legal work and more policy automation.
5. **Implementation consequences:** Affects schema flags, deletion/anonymization jobs, exports, backups, logs, legal notices, access controls, and vendor deletion requests.
6. **Owner selection:** ____________________

## ADR-027 — Hosting, database, storage, and regions

1. **Decision requested:** Which vendors and geographic regions host application, database, object storage, and jobs?
2. **Options:** (A) One managed US stack; (B) managed US application/data stack with documented vendor subprocessors; (C) region-selectable deployment for US and Nigeria data.
3. **Recommendation:** B for the US-first MVP, subject to entity, privacy, and vendor review.
4. **Benefits / risks / cost:** A is simplest but can create concentration risk. B balances simplicity and operational transparency. C supports residency needs but substantially increases architecture, support, and cost.
5. **Implementation consequences:** Determines environment provisioning, secrets, backups, disaster recovery, data-processing agreements, latency, residency disclosures, and migration strategy.
6. **Owner selection:** ____________________

## ADR-028 — Analytics, monitoring, and consent

1. **Decision requested:** Which analytics and monitoring vendors are used, what data is collected, and what consent is required?
2. **Options:** (A) Privacy-minimal product analytics and error monitoring with no client PII; (B) consent-gated analytics plus error monitoring; (C) no product analytics, operational monitoring only.
3. **Recommendation:** A, with explicit data minimization and a consent review before any optional tracking.
4. **Benefits / risks / cost:** A supports product learning with moderate compliance work. B gives stronger consent control but reduces data and adds UX complexity. C minimizes privacy risk but limits behavioral insight.
5. **Implementation consequences:** Defines SDKs, event schemas, PII redaction, retention, consent state, CSP, privacy/cookie pages, access controls, and alerting.
6. **Owner selection:** ____________________

## Approval rule

The blank selections and alternatives above are retained for decision history only. Do not use them to override `DECISIONS.md`; implementation follows the accepted ADRs and remains mock-backed only where the corresponding production integration has not yet been built.
