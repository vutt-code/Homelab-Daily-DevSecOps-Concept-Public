# Hands-on Concept Walkthrough

This walkthrough follows the full concept from knowledge-base refresh to daily audit and evaluator review.

## Step 1 — Refresh source-derived knowledge

The daily audit depends on the Homelab LLM Wiki being accurate. Before trusting RAG context, selected infrastructure facts are refreshed from source systems.

### OPNsense path

```text
OPNsense XML export
  -> sanitize secrets
  -> convert to structured Markdown
  -> normalize interfaces/DHCP/NAT/firewall rules
  -> compare with managed wiki blocks
  -> stage change requests if drift exists
```

### TrueNAS path

```text
Tool - TrueNAS Wiki Correctness Check
  -> read-only SSH + midclt calls
  -> collect live middleware facts
  -> compare with services/truenas.md
  -> stage change requests if drift exists
```

The important safety property: neither path blindly overwrites approved wiki pages.

## Step 2 — Human review and merge

Configuration drift becomes a change request. A human reviews the example update, then merges or rejects it through the wiki operations process.

```text
change candidate -> human review -> merge/reject -> approved Markdown source of truth
```

On merge, the process updates the approved wiki page, archives the change request, records the change, regenerates inventory truth, and refreshes the vector index.

## Step 3 — Trigger the audit

The workflow starts from a schedule in production or a manual trigger in DEV.

```text
08:00 daily schedule -> Daily audit workflow
manual run -> DEV audit workflow
```

The public concept does not require sharing the full workflow export. The important pattern is that the workflow identity and side-effect configuration are environment-aware.

## Step 4 — Collect deterministic evidence

The workflow collects evidence from observability sources such as:

- system and application logs,
- container health/restart signals,
- backup status,
- service availability checks,
- metrics from the monitoring stack,
- previous run summaries.

At this stage, the system is still deterministic. The LLM has not interpreted anything yet.

## Step 5 — Reduce noise before LLM analysis

Raw logs are noisy. The workflow applies deterministic rules before the LLM sees them:

1. filter obvious irrelevant log streams,
2. suppress known-benign design conditions,
3. cluster repeated equivalent failures,
4. preserve counts and examples,
5. keep exact error tokens for targeted search.

This keeps the audit focused and reduces the chance that the LLM overreacts to repeated noise.

## Step 6 — Enrich findings with inventory and wiki context

The workflow maps telemetry to known inventory and documentation context:

```text
service port -> documented service owner -> runbook -> known troubleshooting notes
container restart count -> container name -> host/service page -> previous case cards
firewall log signature -> OPNsense managed rule context -> expected/unexpected assessment
backup warning -> TrueNAS snapshot/replication facts -> storage runbook
```

The LLM receives compact context such as:

- resolved service names,
- wiki lookup hints,
- exact error tokens,
- active recurring signatures,
- source-derived OPNsense/TrueNAS facts,
- backup/service check summaries.

## Step 7 — RAG-assisted audit generation

The AI auditor uses the enriched evidence as primary input. It may selectively query:

- the knowledge-base vector index for conceptual/runbook context,
- exact Markdown search for ports, filenames, services, or errors,
- historical case memory for recurring incidents.

The output is a concise daily report with sections such as:

1. Executive Summary
2. Syslog Audit & Security Anomalies
3. Docker Services & Telemetry Health
4. Storage & Backup Status
5. Recommended Actions
6. 3-Day Trend

See [`../snippets/report-template.md`](../snippets/report-template.md).

## Step 8 — Stage knowledge updates, do not blindly edit

If the same error pattern appears across multiple runs and no documented troubleshooting section exists, the workflow may prepare a change request.

The change request is not the same as an approved documentation change. A human reviews it, then merges or rejects it through a controlled process.

```text
recurring issue -> change candidate -> human review -> merge/reject -> vector index refresh
```

This keeps the knowledge base trustworthy while still allowing the system to learn from operations.

## Step 9 — Store compact case memory

Each audit can create a compact case card:

```text
run date
severity
active signatures
summary
recommendations
resolution status
links to evidence artifacts
```

The case card is embedded and stored in an environment-specific vector collection. Future runs can retrieve similar cases without loading all historical logs.

## Step 10 — Render report and email preview

In production, the report can be sent through the normal notification channel. In DEV, the same content is rendered as Markdown and HTML preview artifacts instead of sending real mail.

This makes formatting testable without spamming humans or mixing DEV output with production reports.

## Step 11 — Evaluate the output

The evaluator workflow reviews the generated report and artifacts. It checks questions such as:

- Did the report miss any deterministic FAIL checks?
- Did it invent a CRITICAL severity?
- Did it use stale knowledge-base facts?
- Did it recommend unsafe production actions from a DEV run?
- Is the email output readable and structurally valid?
- Were citations grounded in supplied evidence?
- Did runtime logs show context, parser, or model failures?

The evaluator persists a scorecard and human-readable report.

## Step 12 — Human promotion decision

The final decision remains human:

- accept the report,
- tune filters or prompts,
- add a golden fixture,
- update a runbook,
- improve an import/correctness check,
- promote a DEV workflow change,
- or keep production untouched.

## Implementation snippets

Representative sanitized snippets live in [`../snippets/`](../snippets/):

- [`knowledge-update-pipeline.md`](../snippets/knowledge-update-pipeline.md)
- [`n8n-code-node-example.js`](../snippets/n8n-code-node-example.js)
- [`rag-query-example.json`](../snippets/rag-query-example.json)
- [`evaluator-rubric.md`](../snippets/evaluator-rubric.md)
- [`evaluator-scorecard-example.json`](../snippets/evaluator-scorecard-example.json)
- [`report-template.md`](../snippets/report-template.md)
