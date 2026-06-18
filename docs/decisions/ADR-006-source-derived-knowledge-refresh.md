# ADR-006: Use source-derived knowledge refresh for key infrastructure facts

## Status

Accepted.

## Context

The Daily DevSecOps audit depends on accurate knowledge-base facts. If gateway firewall rules, DHCP/static leases, NAT mappings, storage pools, app ports, or backup tasks drift away from the wiki, the audit agent may produce incorrect recommendations even when the telemetry analysis is well grounded.

Manual documentation alone is not enough for fast-changing infrastructure facts. At the same time, blindly overwriting the knowledge base from live systems could remove human context or publish incorrect machine interpretations.

## Decision

Use source-derived import and correctness-check flows for selected infrastructure domains:

1. **OPNsense XML import**
   - Export active gateway configuration as XML.
   - Sanitize secrets and convert to structured Markdown.
   - Normalize source config into desired-state models.
   - Compare desired state against machine-managed wiki blocks.
   - Stage change requests for human review.

2. **TrueNAS live correctness check**
   - Run the n8n workflow `Tool - TrueNAS Wiki Correctness Check`.
   - Query live middleware facts through read-only `midclt` calls over SSH.
   - Compare live facts against the TrueNAS service page.
   - Stage change requests for human review when drift exists.

Approved changes are merged through the normal wiki review gate and then re-indexed into the RAG store.

## Consequences

### Positive

- The daily audit uses fresher facts for gateway, storage, app, backup, and port context.
- Machine-managed sections are deterministic and easier to diff.
- Human-authored runbook context remains outside managed blocks.
- Change-document metadata provides provenance: source file, source hash, archive path, and ingestion version.
- The architecture demonstrates an end-to-end information-quality loop, not only an LLM report generator.

### Negative

- Import scripts and correctness workflows require maintenance.
- Source exports must be sanitized carefully before persistence or publication.
- Managed-block boundaries must be respected by human editors.
- Live correctness checks may not expose every low-level runtime detail.

## Public documentation note

Publish the architecture pattern, sanitized snippets, checked data classes, and managed-block strategy. Do not publish raw XML exports, live middleware output, workflow IDs/URLs, private hostnames, credentials, or full topology data.
