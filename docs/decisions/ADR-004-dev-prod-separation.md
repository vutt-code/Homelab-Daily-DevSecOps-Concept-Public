# ADR-004: Separate DEV and PROD side effects

## Status

Accepted.

## Context

The workflow is useful only if it can be safely changed, tested, and evaluated. Running experimental prompt changes or evaluator fixtures against production write targets would pollute production memory, logs, email recipients, and knowledge-base change requests.

A fully separate stack would provide strong isolation but would add operational overhead.

## Decision

Use separate workflow identities and explicit environment configuration for side-effect targets.

DEV may read production-like telemetry for realistic evaluation, but DEV writes must go to DEV-only targets.

Examples:

| Concern | Production | DEV |
|---|---|---|
| Case-card memory | production collection | DEV collection |
| Email | real recipients | preview files only |
| Wiki change requests | production review inbox | disabled or evaluator artifacts |
| Run artifacts | production artifact paths | DEV artifact paths |
| Golden fixtures | disabled | enabled |

## Consequences

### Positive

- Enables realistic testing without polluting production outputs.
- Makes evaluator calibration practical.
- Allows promotion to remain a deliberate step.
- Avoids the cost of running a fully duplicated platform stack.

### Negative

- Requires careful configuration hygiene.
- Some accidental write risks remain if a node bypasses the environment config.
- Tests should include safety checks for production side-effect paths.

## Public documentation note

This is a useful lesson for readers: separate side effects before adding synthetic issues, evaluator loops, or prompt experiments.
