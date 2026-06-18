# ADR-002: Keep knowledge-base updates human-reviewed

## Status

Accepted.

## Context

The knowledge base is the source of truth for homelab services, inventory, runbooks, and troubleshooting guidance. The LLM can help prepare documentation updates when recurring issues are detected, but direct autonomous edits could pollute trusted documentation.

## Decision

The workflow may prepare change candidates, but approved knowledge-base pages are changed only after human review.

The pattern is:

```text
recurring finding -> documentation change request -> human review -> merge/reject -> re-index approved knowledge
```

## Consequences

### Positive

- Preserves trust in the knowledge base.
- Makes recurring operational learning visible without granting blind write authority.
- Allows humans to reject hallucinated, redundant, or low-quality change requests.
- Creates a clear audit trail for durable documentation changes.

### Negative

- Requires human time to review change requests.
- Some good improvements may remain pending until reviewed.
- The workflow must distinguish review artifacts from approved knowledge.

## Public documentation note

This is one of the key safety patterns worth highlighting publicly: the system can assist with learning, but humans approve changes to the source of truth.
