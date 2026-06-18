# Technology Stack

This page adds technology detail at the C4 container and component levels. The public repo intentionally names technology categories and representative tools without exposing private hostnames, credentials, or full workflow exports.

## Container-level stack

| Container | Main technologies | Responsibility |
|---|---|---|
| Workflow Orchestration | n8n, JavaScript Code nodes, LangChain/AI nodes, manual and scheduled triggers | Coordinates the audit loop, knowledge update loop, evaluator loop, artifact persistence, and side-effect routing. |
| Telemetry Evidence Processor | Grafana Loki, Prometheus/PromQL, Grafana datasource APIs, Alloy/exporters, JavaScript enrichment | Collects logs/metrics, applies policy suppression, clusters noisy logs, and maps findings to inventory hints. |
| Knowledge Import Pipeline | Python, OPNsense XML backup export, context-aware sanitizer, desired-state diffing, n8n SSH workflow, TrueNAS `midclt` | Keeps the wiki aligned with source-of-truth configuration and live storage middleware facts. |
| Markdown Knowledge Base | Obsidian-compatible Markdown vault, Git, review inbox, review/merge CLI | Stores approved runbooks, service pages, concepts, and machine-managed documentation blocks. |
| Vector Retrieval Layer | Qdrant, embedding model/runtime, chunking/index scripts | Stores approved wiki chunks and historical DevSecOps case cards for semantic retrieval. |
| AI Audit Agent | n8n AI agent/tool nodes, local OpenAI-compatible LLM endpoint such as llama.cpp, RAG/search tools | Produces the daily report from deterministic evidence plus selective knowledge retrieval. |
| Evaluator Workflow | n8n, deterministic validators, evaluator LLM, structured parser, golden fixtures | Scores generated audit output for grounding, severity, usefulness, email formatting, runtime health, and safety. |
| Artifact and Review Store | Filesystem artifacts, Markdown/HTML previews, JSON evidence, change requests, scorecards | Preserves reviewable outputs for human approval, debugging, and calibration. |

## Component-level stack: knowledge-base import/update

| Component | Technology | Role |
|---|---|---|
| OPNsense XML export | OPNsense backup XML | Human-triggered source export for gateway/firewall/DHCP/NAT data. |
| Context-aware sanitizer | Python, XML parser | Masks secrets and converts the XML tree to structured Markdown for ingestion. |
| Sanitized source staging | Markdown file plus timestamped archive | Provides a safe, auditable input for diffing and later review. |
| Desired-state diff engine | Python parser/diff/render logic | Normalizes interfaces, DHCP leases, NAT rules, firewall rules, and service mappings into comparable models. |
| Machine-managed wiki blocks | Markdown plus HTML comment markers | Allows deterministic regeneration of selected sections while preserving human-authored context. |
| TrueNAS correctness workflow | n8n over SSH, read-only `midclt call` commands | Collects live middleware facts such as version, ports, interfaces, pools, snapshots, cron jobs, Docker state, and apps. |
| Change request generator | Markdown change requests | Stages drift corrections instead of directly overwriting trusted documentation. |
| Wiki operations CLI | Python, Git-aware merge/reject/sync commands | Applies approved change requests, updates ledger/inventory, archives change requests, and triggers indexing. |
| Wiki-to-Qdrant sync | Markdown chunker, embeddings, Qdrant API | Rebuilds the approved knowledge index used by the audit agent. |

## Component-level stack: daily audit and evaluation

| Component | Technology | Role |
|---|---|---|
| Loki/Prometheus checks | LogQL, PromQL, n8n HTTP/data nodes | Collect recent operational/security/storage evidence. |
| Policy suppression | Deterministic JavaScript/config rules | Marks known-benign or design-expected conditions before LLM analysis. |
| Smart clustering | JavaScript summarization/fingerprinting | Reduces repeated log noise while preserving counts and examples. |
| Inventory enrichment | JSON inventory, lookup hints, exact error tokens | Connects telemetry to documented services and runbooks. |
| Case-card memory | Qdrant collection for audit summaries | Supports recurrence recognition and historical context retrieval. |
| Report renderer | Markdown to HTML conversion | Produces human-readable email/report previews. |
| Evaluator rubric | Deterministic checks plus LLM scoring | Identifies unsupported severity, missed failures, unsafe side effects, and formatting regressions. |

## Why this stack matters

The daily audit is only as good as the information stack behind it. OPNsense imports and TrueNAS correctness checks keep the knowledge base fresh; the knowledge base feeds RAG; RAG grounds the daily audit; the evaluator checks whether the generated output respected that evidence.
