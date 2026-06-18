# ADR-005: Add an evaluator quality gate

## Status

Accepted for DEV calibration.

## Context

LLM-generated operational reports can be useful but risky. The system needs a repeatable way to identify unsupported severity escalation, missed deterministic failures, unsafe recommendations, and formatting regressions.

Manual review alone is valuable but inconsistent over time.

## Decision

Add a separate evaluator workflow that reviews DEV audit artifacts and produces a structured scorecard.

The evaluator checks:

- grounding against deterministic evidence,
- severity accuracy,
- missed findings,
- false positives,
- unsupported recommendations,
- production-safety violations,
- report usefulness,
- email formatting,
- and runtime/model health evidence.

Golden fixtures are used to calibrate expected evaluator behavior.

## Consequences

### Positive

- Makes quality regressions visible earlier.
- Produces artifacts that can be reviewed across runs.
- Encourages explicit rubric design.
- Supports safer promotion from DEV to PROD.

### Negative

- Evaluator output is itself LLM-generated and needs calibration.
- Golden fixtures require maintenance.
- A scorecard should support, not replace, human judgment.

## Public documentation note

This is one of the strongest portfolio points: the project does not just use an LLM to generate a report; it also evaluates whether that report is grounded and safe.
