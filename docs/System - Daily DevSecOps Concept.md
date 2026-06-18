---
type: System
title: Daily DevSecOps Concept
status: publication-ready
c4:
  description: Scheduled DevSecOps audit, knowledge-base refresh, RAG, case memory, and evaluator quality gate.
  boundary: internal
  actors:
    - name: Homelab Operator
      description: Reviews reports, change requests, and evaluator results.
      relationship: Operates and approves changes
    - name: Technical Reader
      description: Reads the public concept on GitHub or LinkedIn.
      relationship: Studies the architecture pattern
  containers:
    - name: Workflow Orchestration
      technology: n8n, JavaScript Code nodes, LangChain nodes
      description: Coordinates audit, import, evaluation, and side effects.
    - name: Telemetry Evidence Processor
      technology: Loki, Prometheus, JS enrichment
      description: Collects, filters, clusters, and enriches evidence.
    - name: Knowledge Import Pipeline
      technology: Python, OPNsense XML, n8n SSH midclt
      description: Keeps wiki facts aligned with source systems.
    - name: Markdown Knowledge Base
      technology: Markdown, Obsidian-compatible vault, Git
      description: Approved source of truth for runbooks and inventory.
    - name: Vector Retrieval Layer
      technology: Qdrant, embeddings
      description: Stores knowledge chunks and historical case cards.
    - name: AI Audit Agent
      technology: llama.cpp/OpenAI-compatible API, n8n tools
      description: Generates grounded daily operational analysis.
    - name: Evaluator Workflow
      technology: n8n, deterministic checks, LLM evaluator
      description: Scores reports for grounding, severity, and safety.
    - name: Artifact and Review Store
      technology: Filesystem, review inbox, email previews, scorecards
      description: Persists reviewable outputs and human approval artifacts.
  externalRelationships:
    - target: Observability Sources
      description: Logs, metrics, backup status, and service checks.
      technology: Loki, Prometheus, Grafana, Alloy/exporters
      direction: outgoing
    - target: Source Configuration Systems
      description: Gateway XML export and storage middleware facts.
      technology: OPNsense XML, TrueNAS midclt
      direction: outgoing
    - target: Notification and Publication Channels
      description: Email previews/reports and public architecture docs.
      technology: Email, GitHub, LinkedIn
      direction: outgoing
  internalRelationships:
    - source: Workflow Orchestration
      target: Telemetry Evidence Processor
      description: Runs scheduled and manual checks
      technology: n8n
    - source: Workflow Orchestration
      target: Knowledge Import Pipeline
      description: Runs correctness/import flows
      technology: n8n + Python
    - source: Knowledge Import Pipeline
      target: Markdown Knowledge Base
      description: Stages approved-source updates
      technology: review gate
    - source: Markdown Knowledge Base
      target: Vector Retrieval Layer
      description: Indexed into semantic chunks
      technology: embeddings
    - source: Telemetry Evidence Processor
      target: AI Audit Agent
      description: Supplies compact deterministic evidence
      technology: JSON artifacts
    - source: Vector Retrieval Layer
      target: AI Audit Agent
      description: Retrieves runbooks and case memory
      technology: vector search
    - source: AI Audit Agent
      target: Artifact and Review Store
      description: Writes report, preview, and change candidates
      technology: Markdown/HTML/JSON
    - source: Evaluator Workflow
      target: Artifact and Review Store
      description: Reads artifacts and writes scorecards
      technology: JSON/Markdown
---
# System - Daily DevSecOps Concept

This file is the structured C4 source note used for the public architecture package. The diagrams in `docs/diagrams/` are maintained from this system description using the project `c4-diagram` skill conventions.

The concept includes three connected loops:

1. **Knowledge-base refresh loop**: source configuration and live correctness checks update the Markdown knowledge base through change requests.
2. **Daily audit loop**: telemetry and knowledge-base context feed the daily DevSecOps report.
3. **Evaluation loop**: DEV artifacts are scored for grounding, severity, formatting, and safety before promotion decisions.
