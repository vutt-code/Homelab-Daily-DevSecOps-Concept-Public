# ADR-003: Use RAG plus case-card memory

## Status

Accepted.

## Context

The audit needs both current documentation context and historical incident context.

The Markdown knowledge base contains service runbooks, inventory, and concepts. Historical audit logs contain useful recurrence patterns, but raw logs are too large and noisy to inject into every prompt.

## Decision

Use two related retrieval patterns:

1. **Knowledge-base RAG** over approved Markdown documentation.
2. **Case-card memory** over compact daily audit summaries.

The knowledge-base index answers questions such as:

- Which service owns this port?
- What is the runbook for this component?
- Is this error already documented?

The case-card memory answers questions such as:

- Have we seen this issue before?
- Was it recurring?
- What action was recommended last time?
- Was a similar finding previously resolved?

## Consequences

### Positive

- Keeps prompts smaller than raw history injection.
- Separates durable documentation from operational memory.
- Makes recurrence detection more useful.
- Allows approved wiki content and audit memory to evolve independently.

### Negative

- Requires collection naming and environment separation discipline.
- Requires chunking/embedding/index refresh logic.
- Retrieval quality depends on good summaries and metadata.

## Public documentation note

Show the retrieval pattern and a sanitized query example, but do not publish the full private vault or case history.
