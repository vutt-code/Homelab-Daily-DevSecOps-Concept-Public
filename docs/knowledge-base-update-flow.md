# Knowledge-base Import and Update Flow

The Daily DevSecOps audit loop depends on a fresh, trustworthy knowledge base. This page documents the supporting information stack that updates the Homelab LLM Wiki from source configuration and live correctness checks.

## Why this is part of the audit architecture

The audit agent does not only inspect logs and metrics. It also asks questions such as:

- Which service owns this port?
- Is this firewall rule expected?
- Is this backup task documented?
- Is this TrueNAS app or share still configured the way the wiki says?
- Has this recurring issue already been documented?

Those answers come from the knowledge base and vector index. Therefore, configuration import and correctness checking are integral parts of the architecture, not separate housekeeping.

## High-level flow

```text
source config / live middleware
  -> sanitize or query read-only facts
  -> normalize to comparable desired/live state
  -> compare against current wiki pages
  -> stage change request when drift exists
  -> human review and merge/reject
  -> regenerate inventory and vector index
  -> daily audit consumes fresh context
```

## OPNsense XML import path

### Source

The gateway configuration is exported from OPNsense as an XML backup file. This file is sensitive by default and should not be committed or shared directly.

### Sanitization

A Python sanitizer converts the XML tree into structured Markdown and masks sensitive values such as:

- passwords,
- private keys,
- certificates,
- API keys,
- pre-shared keys,
- tokens,
- SNMP communities,
- credential hashes.

The sanitized output becomes the active ingestion input:

```text
N8N_data_import/opnsense_cleaned_for_rag.md
```

The active file is treated as temporary staging data. Timestamped sanitized snapshots can be archived for traceability.

### Desired-state ingestion

The ingestion script parses the sanitized Markdown into a canonical source-derived model before comparing it with the wiki.

Representative normalized objects include:

```text
Interface: logical name, device, description, VLAN tag, parent, bridge membership, IP/subnet
DHCP lease: MAC, hostname, IP, description, zone
NAT rule: interface, protocol, destination, target, local port, description, enabled state
Firewall rule: interface, action, source, destination, protocol, port, direction, logging, description
```

The important design principle is: compare desired state to documented state, not just whether a string happens to appear somewhere in a page.

### Machine-managed wiki blocks

The OPNsense import owns only bounded managed regions inside selected service pages. Human-authored notes remain outside these blocks.

Example marker pattern:

```markdown
<!-- BEGIN:OPNSENSE_INTERFACES -->
...
<!-- END:OPNSENSE_INTERFACES -->
```

Similar managed sections can exist for DHCP static leases, NAT rules, and firewall rules.

### Change request behavior

When drift is detected, the ingestion process stages change requests rather than directly editing approved service pages.

The change request includes:

- target wiki file,
- source file reference,
- source hash,
- archived snapshot reference,
- ingestion version,
- human-readable drift summary,
- full updated target content.

## TrueNAS live correctness path

### Source

TrueNAS facts are collected through a read-only n8n workflow named:

```text
Tool - TrueNAS Wiki Correctness Check
```

For public documentation, the workflow name and pattern are enough. Workflow IDs, URLs, hostnames, and credentials should stay private.

### Access pattern

The workflow connects over SSH and runs read-only TrueNAS middleware commands through `midclt call`.

For security hardening, the SSH connection uses a dedicated service account mapped to the TrueNAS built-in **Readonly Admin** role for middleware access. This reduces blast radius by limiting the `midclt` operations available to the workflow. It should be treated as part of a defense-in-depth model rather than a complete control by itself: SSH key handling, source-network restrictions, shell/sudo restrictions where applicable, and audit logging still matter.

Representative checked data classes:

- system version and host identity,
- web UI ports,
- network interfaces and aliases,
- ZFS pools,
- periodic snapshot tasks,
- init/shutdown scripts,
- middleware-managed cron jobs,
- Docker status and networks,
- applications, states, and exposed ports.

### Change request behavior

If live middleware facts differ from the approved `services/truenas.md` page, the correction is staged as a normal wiki change request. The workflow should not directly overwrite the service page during routine checks.

## Human approval and indexing

The same gate handles OPNsense and TrueNAS corrections:

1. Review the requested change.
2. Merge or reject with the wiki operations CLI.
3. On merge, update the target Markdown page.
4. Archive the change request.
5. Append an audit ledger entry.
6. Regenerate inventory truth.
7. Sync approved Markdown chunks to the vector store.

## Relationship to the daily audit loop

After approval and re-indexing, the daily audit loop can retrieve fresher facts:

- updated OPNsense interface and firewall context,
- current DHCP/static lease mapping,
- current TrueNAS storage/app/snapshot facts,
- corrected service ownership and port exposure notes,
- new runbook guidance.

This closes the loop between infrastructure state, human-reviewed documentation, RAG context, and automated daily analysis.

## Public sharing boundary

Safe to publish:

- the architecture pattern,
- sanitized script snippets,
- managed-block strategy,
- review gate design,
- checked data classes.

Do not publish:

- raw XML exports,
- exact hostnames/IPs,
- SSH credentials,
- workflow IDs/URLs,
- complete private wiki contents,
- live middleware output containing sensitive topology.
