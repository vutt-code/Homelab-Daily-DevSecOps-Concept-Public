# ADR-001: Use n8n as the orchestration layer

## Status

Accepted for concept implementation.

## Context

The Daily DevSecOps workflow needs to coordinate scheduled execution, telemetry APIs, file artifacts, LLM agent calls, vector search tools, report rendering, and notification behavior.

A custom service could provide tighter control, but would require more boilerplate for scheduling, retries, credential handling, node-level observability, and visual workflow review.

## Decision

Use **n8n** as the orchestration layer for both the production daily audit and the DEV/evaluator workflows.

n8n owns:

- schedule/manual triggers,
- telemetry collection sub-workflows,
- deterministic JavaScript code nodes,
- LLM agent/tool wiring,
- report rendering,
- artifact persistence,
- and environment-specific side-effect routing.

## Consequences

### Positive

- Fast iteration on workflow structure.
- Visual node graph makes the automation easier to explain and review.
- Sub-workflows keep checks modular.
- Credentials and integrations can be managed through the workflow platform.
- Manual DEV runs are easy to trigger during calibration.

### Negative

- Complex workflows can become hard to diff compared with normal source code.
- Some logic still needs disciplined code snippets and artifact versioning.
- Public sharing should use architecture docs and sanitized snippets rather than raw workflow exports.

## Public documentation note

The public repository should show patterns and selected snippets, not the full production workflow export.
