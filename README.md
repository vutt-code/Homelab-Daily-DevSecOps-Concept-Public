# Daily DevSecOps Concept Architecture

> A hands-on homelab architecture concept combining scheduled DevSecOps telemetry review, Homelab LLM Wiki knowledge-base updates, RAG-assisted analysis, long-term case memory, and an evaluation quality gate.

This repository is intended as a **portfolio-style architecture and implementation note**, not a turnkey open-source product. It explains the architecture, selected decisions, and representative sanitized snippets behind a Daily DevSecOps workflow built with n8n, observability telemetry, a Markdown knowledge base, source-configuration import/update flows, vector search, and LLM-based evaluation.

## What this is

- A readable C4 Lite architecture package.
- A practical concept walkthrough for a real homelab automation use case.
- A description of the information stack behind the audit loop, including OPNsense XML import and TrueNAS live correctness checks.
- A set of Architecture Decision Records (ADRs) explaining why the design looks the way it does.
- Sanitized code/prompt/config snippets that show implementation patterns without exposing private infrastructure.

## What this is not

- A full n8n workflow export.
- A production deployment guide.
- A complete homelab inventory.
- A public incident, credential, IP, hostname, workflow ID, or topology dump.
- A generic commercial product template.

## Core idea

The system runs a daily DevSecOps audit over homelab telemetry, but the audit is only one loop. The broader concept has three connected loops:

```text
source config/live facts -> knowledge-base change requests -> approved wiki/RAG index
approved knowledge + telemetry -> daily audit report -> case memory
DEV artifacts -> evaluator scorecard -> human promotion/review decision
```

In other words: the knowledge base is not static background documentation. It is actively refreshed from source systems, reviewed by a human, indexed for RAG, and then used to ground the daily audit.

## Documentation model

This package uses **C4 Lite + ADRs + hands-on walkthrough**:

1. **C1 System Context**: who uses the system and which external systems it interacts with.
2. **C2 Container View**: the major runtime/storage building blocks and technology stack.
3. **C3 Component Views**: selected deeper flows, including knowledge-base import/update and evaluator quality gate.
4. **ADRs**: short records for key architecture decisions.
5. **Walkthrough**: a concrete end-to-end story for readers who want implementation intuition.

The diagrams are maintained with the project `c4-diagram` skill conventions. The structured C4 source note is [`docs/System - Daily DevSecOps Concept.md`](docs/System%20-%20Daily%20DevSecOps%20Concept.md).

## Suggested reading order

1. [`docs/architecture.md`](docs/architecture.md)
2. [`docs/technology-stack.md`](docs/technology-stack.md)
3. [`docs/knowledge-base-update-flow.md`](docs/knowledge-base-update-flow.md)
4. [`docs/diagrams/c1-system-context.md`](docs/diagrams/c1-system-context.md)
5. [`docs/diagrams/c2-containers.md`](docs/diagrams/c2-containers.md)
6. [`docs/diagrams/c3-knowledge-base-update-flow.md`](docs/diagrams/c3-knowledge-base-update-flow.md)
7. [`docs/diagrams/c3-evaluation-flow.md`](docs/diagrams/c3-evaluation-flow.md)
8. [`docs/walkthrough.md`](docs/walkthrough.md)
9. [`docs/demo-dataset.md`](docs/demo-dataset.md)
10. [`docs/decisions/`](docs/decisions/)
11. [`snippets/`](snippets/)

## Repository structure

```text
daily-devsecops-concept/
├── README.md
├── PUBLISHING.md
├── USAGE-NOTICE.md
├── docs/
│   ├── System - Daily DevSecOps Concept.md
│   ├── architecture.md
│   ├── technology-stack.md
│   ├── knowledge-base-update-flow.md
│   ├── demo-dataset.md
│   ├── redaction-guide.md
│   ├── walkthrough.md
│   ├── diagrams/
│   │   ├── c1-system-context.md
│   │   ├── c2-containers.md
│   │   ├── c3-knowledge-base-update-flow.md
│   │   └── c3-evaluation-flow.md
│   └── decisions/
│       ├── ADR-001-n8n-orchestration.md
│       ├── ADR-002-human-review-gate.md
│       ├── ADR-003-rag-and-case-memory.md
│       ├── ADR-004-dev-prod-separation.md
│       ├── ADR-005-evaluator-quality-gate.md
│       └── ADR-006-source-derived-knowledge-refresh.md
└── snippets/
    ├── evaluator-rubric.md
    ├── evaluator-scorecard-example.json
    ├── knowledge-update-pipeline.md
    ├── n8n-code-node-example.js
    ├── rag-query-example.json
    └── report-template.md
```

## Example LinkedIn positioning

> I have been building a hands-on Daily DevSecOps concept for my homelab: source-configuration imports into a Markdown knowledge base, scheduled telemetry review, RAG-assisted audit analysis, case-card memory, human-reviewed wiki change requests, and an evaluator workflow that checks grounding and safety before reports are trusted. I documented the architecture using a lightweight C4 model plus ADRs so it is readable without becoming a full product release.

## Publication status

Status: **ready for manual GitHub publishing**.

Before publishing, complete the checklist in [`PUBLISHING.md`](PUBLISHING.md) and review [`docs/redaction-guide.md`](docs/redaction-guide.md). This repository is shared as source-available portfolio/reference material; see [`USAGE-NOTICE.md`](USAGE-NOTICE.md).
