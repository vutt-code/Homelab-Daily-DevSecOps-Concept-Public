# C4 Lite Architecture

## 1. Purpose

The Daily DevSecOps concept automates a daily operational and security review of a homelab environment while keeping human control over documentation changes and production side effects.

The design combines three connected loops:

1. **Knowledge-base refresh loop**: imports and correctness checks keep the Homelab LLM Wiki aligned with source infrastructure facts.
2. **Daily audit loop**: telemetry and approved wiki/RAG context feed a daily DevSecOps report and case-card memory.
3. **Evaluation loop**: DEV artifacts are checked for grounding, severity, safety, formatting, and usefulness before promotion decisions.

## 2. Architecture style

This documentation uses **C4 Lite** rather than a heavy enterprise method.

| C4 level | Purpose in this repo |
|---|---|
| C1 System Context | Explain the concept to a broad technical audience. |
| C2 Container View | Show the runtime/storage building blocks and technology stack. |
| C3 Component Views | Drill into selected interesting flows: knowledge-base update and evaluator quality gate. |
| Code snippets | Show representative implementation patterns without publishing the full system. |

The C4 diagrams are maintained using the project `c4-diagram` skill conventions. The structured source note is [`System - Daily DevSecOps Concept.md`](System%20-%20Daily%20DevSecOps%20Concept.md).

## 3. Scope

### In scope

- Daily automated DevSecOps audit workflow.
- Homelab LLM Wiki knowledge-base import/update flow.
- OPNsense XML sanitization, desired-state diffing, and change staging.
- TrueNAS live middleware correctness check through the n8n workflow `Tool - TrueNAS Wiki Correctness Check`.
- Human-reviewed documentation change request flow.
- Wiki-to-vector-store indexing for RAG.
- Case-card memory for recurring issue detection.
- DEV/PROD side-effect separation.
- Evaluator flow for report quality, grounding, formatting, and safety checks.

### Out of scope

- Full production workflow exports.
- Full private vault contents.
- Credentials, tokens, hostnames, exact network maps, workflow IDs, URLs, and private incident data.
- A one-click deployment guide.
- Vendor-neutral benchmarking of all LLM, vector DB, or workflow tools.

## 4. Quality attributes

| Quality attribute | Design response |
|---|---|
| Safety | Production writes are explicit; DEV writes go to isolated targets. |
| Grounding | Deterministic telemetry and source-derived wiki facts are primary evidence. |
| Knowledge freshness | OPNsense and TrueNAS update flows keep key infrastructure facts current. |
| Traceability | Reports, previews, change requests, source hashes, archives, and scorecards can be persisted. |
| Human control | Wiki updates are staged as change requests and require review before merge. |
| Readability | C4 Lite diagrams and ADRs are used instead of a large formal framework. |
| Token efficiency | Logs are filtered, clustered, and enriched before being sent to the LLM. |
| Auditability | Approved docs are versioned and re-indexed; generated outputs are stored as artifacts. |
| Extensibility | n8n sub-workflows and Python import scripts allow new checks to be added incrementally. |

## 5. System narrative

Every morning, the workflow collects recent telemetry from logs and metrics. Deterministic code reduces noise, groups recurring log patterns, maps IPs and ports to documented services, and creates compact evidence for the LLM.

That LLM evidence is grounded by a knowledge base that is actively maintained. OPNsense configuration is exported, sanitized, normalized, and diffed against managed wiki sections. TrueNAS live middleware facts are collected by a read-only n8n correctness workflow and compared against the TrueNAS service page. Differences become change requests, not direct edits.

When a human approves a change request, the Markdown knowledge base is updated, inventory truth is regenerated, and the vector index is refreshed. The daily audit agent can then retrieve fresher service ownership, firewall, DHCP, storage, app, and backup context.

A separate evaluator workflow reviews generated DEV artifacts. It checks grounding, severity accuracy, formatting, runtime health evidence, and production-safety boundaries. The evaluator can run against both live DEV runs and golden fixtures.

## 6. Main flows

### 6.1 Knowledge-base refresh flow

```text
OPNsense XML export
  -> sanitize secrets and convert to structured Markdown
  -> normalize gateway/firewall/DHCP/NAT desired state
  -> compare against managed wiki blocks
  -> stage change requests when drift exists

TrueNAS live middleware
  -> read-only n8n SSH midclt workflow
  -> collect version, ports, interfaces, pools, snapshots, cron, Docker/apps
  -> compare against services/truenas.md
  -> stage change requests when drift exists

Approved change request
  -> wiki_ops merge/reject gate
  -> update Markdown source of truth
  -> regenerate inventory
  -> sync approved chunks to Qdrant
```

### 6.2 Daily audit flow

```text
Schedule trigger
  -> collect Loki/Prometheus/backup/service evidence
  -> suppress known-benign patterns
  -> cluster and enrich findings
  -> query knowledge base and historical case memory as needed
  -> generate daily report
  -> render/store email preview or send email depending on environment
  -> create case card
  -> upsert case memory to environment-specific vector collection
```

### 6.3 Human-in-the-loop knowledge update flow

```text
Configuration drift or recurring issue detected
  -> change candidate generated
  -> human reviews change request
  -> merge or reject through controlled script/process
  -> accepted content refreshes inventory and vector index
```

### 6.4 Evaluation flow

```text
DEV audit artifacts
  -> collect deterministic evidence, report, preview, clusters
  -> collect LLM runtime logs where available
  -> assemble evaluator prompt and rubric
  -> LLM evaluator produces structured scorecard
  -> deterministic checks validate shape/format/safety
  -> persist scorecard/report
  -> human reviews calibration and promotion readiness
```

## 7. Container-level technology stack

| Container | Technology | Role |
|---|---|---|
| Workflow Orchestration | n8n, JS Code nodes, LangChain nodes | Coordinates audit, import, evaluation, artifacts, and side effects. |
| Telemetry Evidence Processor | Loki, Prometheus, Grafana APIs, JS enrichment | Builds compact deterministic evidence for the audit. |
| Knowledge Import Pipeline | Python, OPNsense XML, n8n SSH, TrueNAS `midclt` | Keeps wiki facts aligned with source infrastructure state. |
| Markdown Knowledge Base | Markdown, Obsidian-compatible vault, Git | Approved human-readable source of truth. |
| Vector Retrieval Layer | Qdrant, embeddings | Semantic lookup over approved wiki chunks and case-card memory. |
| AI Audit Agent | n8n AI agent, local OpenAI-compatible LLM runtime | Produces the daily report from evidence and retrieval. |
| Evaluator Workflow | n8n, deterministic checks, evaluator LLM, golden fixtures | Reviews generated output quality and safety. |
| Artifact and Review Store | Filesystem, review inbox, Markdown/HTML/JSON artifacts | Stores evidence, reports, previews, change requests, and scorecards. |

More detail: [`technology-stack.md`](technology-stack.md).

## 8. Knowledge-base and RAG model

The Markdown knowledge base acts as the human-readable source of truth. Approved pages are chunked and indexed into a vector store for semantic retrieval. The daily workflow can use both:

- semantic RAG search for concepts and runbooks,
- exact file/search tools for specific ports, errors, services, or filenames,
- historical case-card memory for recurrence and prior resolution context.

The key addition is that the wiki is not manually maintained only. It receives source-derived updates through controlled import/correctness flows:

- OPNsense managed sections for interfaces, DHCP/static leases, NAT, and firewall rules.
- TrueNAS correctness checks for live middleware facts such as pools, apps, ports, snapshots, cron jobs, and Docker state.

Pending change requests remain outside the approved RAG corpus until merged.

## 9. Environment model

The implementation uses a practical separation model: one orchestration platform, but separate workflow identities and write targets for DEV and PROD.

| Concern | PROD behavior | DEV behavior |
|---|---|---|
| Workflow identity | Production daily audit workflow | Cloned/manual DEV workflow |
| Telemetry reads | Allowed | Allowed, read-only |
| Wiki writes | Only through change-review flow | Disabled or captured as evaluator artifacts |
| Case memory | Production vector collection | DEV vector collection |
| Email | Real delivery | Preview artifacts only by default |
| Evaluation | Optional future gate | Active/manual calibration workflow |
| Synthetic fixtures | Disabled | Enabled for evaluator calibration |
| Source imports | Reviewed change requests before merge | Dry-run/change review before promotion |

## 10. Evaluation model

The evaluator is intentionally conservative. It penalizes unsupported severity escalation, hallucinated recommendations, missed deterministic failures, malformed email output, and unsafe production side-effect suggestions.

The evaluator does not prove the system is correct. Its role is to make quality regressions visible earlier and provide repeatable review artifacts.

## 11. Key risks and mitigations

| Risk | Mitigation |
|---|---|
| LLM overstates severity | Evaluator checks severity against deterministic evidence. |
| Knowledge base becomes stale | OPNsense imports and TrueNAS correctness checks detect source/wiki drift. |
| Config import leaks secrets | OPNsense XML is sanitized before ingestion or publication. |
| Log volume overwhelms context | Filter, suppress, cluster, and summarize before LLM analysis. |
| Wiki gets polluted by automated edits | Use review inbox and human merge/reject gate. |
| DEV run writes to production targets | Centralized environment config and side-effect checks. |
| Public repo reveals private topology | Redaction guide and sanitized placeholders. |
| Evaluator becomes too trusting | Golden fixtures include negative cases and expected failures. |
| SSH credential compromise increases NAS risk | Dedicated TrueNAS service account is mapped to Readonly Admin for middleware access; SSH keys, source access, sudo/shell restrictions, and audit logs remain part of defense in depth. |

## 12. Future documentation improvements

- Add a sanitized sample OPNsense managed block diff.
- Add a sanitized sample TrueNAS correctness check result.
- Add a C3 view for deterministic Loki smart clustering.
- Add a sanitized sample evaluator scorecard.
- Add screenshots with private data blurred.
- Implement the small synthetic demo dataset described in [`demo-dataset.md`](demo-dataset.md).
