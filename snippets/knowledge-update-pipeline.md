# Sanitized Knowledge Update Pipeline Snippet

This snippet shows the public pattern for keeping a Markdown/RAG knowledge base aligned with source infrastructure facts.

## OPNsense import pattern

```bash
# 1. Export OPNsense config.xml manually from the gateway UI.
# 2. Sanitize before any ingestion, indexing, or publication.
python N8N_data_import/sanitize_opnsense.py \
  N8N_data_import/config.xml \
  -o N8N_data_import/opnsense_cleaned_for_rag.md

# 3. Preview drift without writing change requests or archives.
python scripts/maintenance/ingest_opnsense.py --dry-run

# 4. Stage change requests when ready for human review.
python scripts/maintenance/ingest_opnsense.py
```

## Managed block pattern

```markdown
<!-- BEGIN:OPNSENSE_FIREWALL_RULES -->
Generated firewall/NAT/interface content goes here.
<!-- END:OPNSENSE_FIREWALL_RULES -->
```

Human-authored runbook notes should live outside managed blocks.

## Change request pattern

```markdown
---
target_file: services/opnsense_firewall.md
status: pending
source_file: N8N_data_import/opnsense_cleaned_for_rag.md
source_sha256: <sha256>
source_archived_as: N8N_data_import/raw/opnsense/opnsense_cleaned_<timestamp>.md
ingestion_version: <version>
---
## Change Summary
- UPDATE: example source-derived firewall rule changed.
- ADD: example DHCP/static lease detected.

## Updated Content
<full updated target page content>
```

## TrueNAS correctness-check pattern

```text
Run n8n workflow: Tool - TrueNAS Wiki Correctness Check
  -> query read-only middleware facts with midclt
  -> compare returned summary with services/truenas.md
  -> stage change request if documentation drift exists
```

Representative read-only fact classes:

```text
system.version
system.info
system.general.config
interface.query
pool.query
pool.snapshottask.query
initshutdownscript.query
cronjob.query
docker.status
docker.network.query
app.query
```

## Merge/index pattern

```bash
# Human approves or rejects the change request.
python scripts/prod/wiki_ops.py merge CHANGE_REQUEST_<date>_<target>.md
# or
python scripts/prod/wiki_ops.py reject CHANGE_REQUEST_<date>_<target>.md
```

On merge, the approved Markdown source of truth is updated and the vector index is refreshed so the daily audit agent retrieves current facts.
