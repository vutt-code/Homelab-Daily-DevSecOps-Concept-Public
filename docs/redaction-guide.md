# Public Redaction Guide

Use this checklist before publishing the repository or a LinkedIn article.

## Remove or replace

- Real credentials, API keys, tokens, cookies, headers, and webhook URLs.
- Public or private IP addresses that reveal your topology unless intentionally anonymized.
- Exact hostnames, usernames, dataset names, serial numbers, VPN names, and NAS pool names.
- Full n8n workflow exports if they contain credentials, internal URLs, node IDs, workflow IDs, or operational secrets.
- Raw OPNsense XML exports, unsanitized configuration backups, and live middleware output.
- Full observability logs that include client IPs, usernames, file paths, auth failures, or private service names.
- Incident details that would help an attacker fingerprint your environment.
- Exact email addresses and notification routing details.

## Replace with placeholders

| Real value type | Suggested placeholder |
|---|---|
| Private IP | `10.x.x.x`, `<observability-host>`, `<service-ip>` |
| Hostname | `<nas-host>`, `<router-host>`, `<docker-host>` |
| Workflow ID or URL | `<prod-workflow-id>`, `<dev-workflow-id>`, `https://<n8n-host>/workflow/<id>` |
| Raw config export | `<sanitized-config-snapshot>` or a synthetic fixture |
| Qdrant collection | `devsecops_memory`, `devsecops_memory_dev` or sanitized equivalents |
| Vault path | `/data/wiki/...` or `<knowledge-base-path>` |
| Email recipient | `<operator-email>` |
| API endpoint | `https://<internal-api>/...` |

## Keep public

These are usually safe and useful to keep:

- Architecture pattern.
- C4 diagrams.
- ADRs.
- Sanitized environment config pattern.
- Sanitized OPNsense import/update pattern.
- TrueNAS correctness-check data classes without live values or workflow IDs.
- Example report sections.
- Evaluator rubric categories.
- Generic LogQL/PromQL examples with anonymized labels.
- Discussion of DEV/PROD separation.
- Lessons learned and trade-offs.

## Recommended publication wording

Use language such as:

```text
The repository contains architecture documentation and sanitized snippets. It intentionally does not include the complete workflow export, private inventory, credentials, or production telemetry.
```

## Final review checklist

- [ ] Search for `10.` / `192.168.` / `172.` private networks and decide what to keep.
- [ ] Search for `token`, `secret`, `password`, `Authorization`, `Bearer`, `apikey`, and `credential`.
- [ ] Search for personal email addresses.
- [ ] Search for real hostnames and usernames.
- [ ] Search for workflow IDs, n8n URLs, and raw config snapshots.
- [ ] Confirm screenshots are blurred.
- [ ] Confirm snippets are representative and not copied with hidden production values.
- [ ] Confirm licensing/usage expectations are clear.
