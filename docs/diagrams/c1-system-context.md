# C1 — System Context

This context diagram frames the project as a combined **Daily DevSecOps + Homelab LLM Wiki Knowledge Stack**, not only as a daily audit workflow.

Generated/maintained using the project `c4-diagram` skill conventions with C4-style Mermaid flowchart notation.

```mermaid
flowchart LR
    %% 1. Actors
    Operator["<b>Homelab Operator</b><br/><i>[Person]</i><br/><br/>Reviews reports, change requests, and evaluator output"]
    Reader["<b>Technical Reader</b><br/><i>[Person]</i><br/><br/>Reads the public concept on GitHub/LinkedIn"]

    %% 2. Central system
    System["<b>Daily DevSecOps Concept</b><br/><i>[Software System]</i><br/><br/>Audit loop, knowledge refresh, RAG, memory, evaluator"]

    %% 3. External systems
    Observability["<b>Observability Sources</b><br/><i>[External System]</i><br/><br/>Logs, metrics, backup and service checks"]
    SourceConfig["<b>Source Configuration Systems</b><br/><i>[External System]</i><br/><br/>OPNsense XML and TrueNAS middleware facts"]
    LLMRuntime["<b>LLM Runtime(s)</b><br/><i>[External System]</i><br/><br/>Auditor and evaluator inference endpoints"]
    Publication["<b>Publication Channels</b><br/><i>[External System]</i><br/><br/>GitHub repository and LinkedIn post"]

    %% Relationships
    Operator -->|"Reviews, approves, tunes<br/>[Reports + change requests]"| System
    Reader -->|"Studies concept<br/>[Markdown docs]"| Publication
    System -->|"Publishes sanitized docs<br/>[Git/Markdown]"| Publication
    System -->|"Queries telemetry<br/>[LogQL/PromQL/API]"| Observability
    System -->|"Imports and validates facts<br/>[XML/Python/SSH midclt]"| SourceConfig
    System -->|"Calls models<br/>[OpenAI-compatible API]"| LLMRuntime
    System -->|"Produces reports and review artifacts<br/>[Markdown/HTML/JSON]"| Operator

    %% C4 Styling
    classDef person fill:#08427B,stroke:#052E56,color:#fff
    classDef system fill:#1168BD,stroke:#0B4884,color:#fff
    classDef external fill:#999999,stroke:#6B6B6B,color:#fff

    class Operator,Reader person
    class System system
    class Observability,SourceConfig,LLMRuntime,Publication external
```

## Context explanation

### Primary actor

The primary actor is the homelab operator. The operator wants a concise daily answer to:

- What broke?
- What is recurring?
- What changed in infrastructure state?
- Which wiki/runbook facts are stale?
- What needs human approval?
- Can I trust the generated report?

### Secondary audience

The public documentation audience is a technical reader who wants to understand the architecture pattern, not deploy the private environment.

### External systems

| External system | Role |
|---|---|
| Observability Sources | Provide operational evidence: logs, metrics, backup markers, service health, and runtime signals. |
| Source Configuration Systems | Provide source-of-truth configuration and live facts: OPNsense XML export and TrueNAS middleware queries. |
| LLM Runtime(s) | Provide local audit analysis and evaluator scoring through OpenAI-compatible interfaces. |
| Publication Channels | Host sanitized architecture documentation and code snippets. |

## Boundary note

The public concept intentionally abstracts away exact hostnames, IPs, credentials, workflow IDs, and private operational data.
