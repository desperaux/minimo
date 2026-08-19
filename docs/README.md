# minimo Build Documentation

This folder is the source of truth for product and implementation.

## Read order

1. `AGENTS.md` — coding-agent rules; mirrored at repository root
2. `PRD.md` — users, scope, requirements and acceptance
3. `BUSINESS_RULES.md` — exact financial/workflow behavior
4. `ARCHITECTURE.md` — system structure and vendor boundaries
5. `DATABASE.md` — schema invariants and transactions
6. `API_CONTRACTS.md` — typed request/response/error contracts
7. `DESIGN.md` — brand, screens, components and responsive UX
8. `ERROR_STATES.md` — failure and recovery behavior
9. `SECURITY.md` — security/privacy baseline
10. `TEST_PLAN.md` — required verification evidence
11. `ENVIRONMENTS.md` — setup, variables and environment separation
12. `DECISIONS.md` — accepted and blocking decisions
13. `DECISION_REQUESTS.md` — owner-facing options and approval fields for proposed ADRs
14. `TASKS.md` — milestone build order
15. `PROTOTYPE_STATUS.md` — current implementation boundary and verification evidence

## Rule

If implementation behavior is not specified and the choice affects money, data, security, privacy, scope, legal obligations, or user trust, stop and add/resolve a decision instead of guessing.
