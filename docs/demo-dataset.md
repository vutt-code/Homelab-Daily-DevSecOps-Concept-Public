# Demo Dataset Design

## Purpose

Define a very small, fully synthetic dataset so readers can understand the end-to-end flow without seeing production telemetry, topology, workflow exports, or private wiki content.

The demo dataset should show the concept, not reproduce the full system.

## Goals

The dataset should let a reader trace this path:

```text
synthetic source facts + synthetic telemetry
  -> deterministic evidence
  -> knowledge-base/RAG context
  -> generated daily report
  -> evaluator scorecard
```

It should also demonstrate the human-in-the-loop knowledge update pattern:

```text
synthetic config drift
  -> reviewed wiki update
  -> approved Markdown/RAG source of truth
```

## Non-goals

- Do not include real logs, IP addresses, hostnames, usernames, workflow IDs, or middleware output.
- Do not include raw OPNsense XML exports.
- Do not include full n8n workflow exports.
- Do not make the dataset executable against a real environment.
- Do not model every production check.

## Recommended folder structure

```text
demo/
├── README.md
├── input/
│   ├── opnsense_sanitized_excerpt.md
│   ├── truenas_correctness_summary.json
│   ├── telemetry_loki_excerpt.jsonl
│   └── telemetry_prometheus_excerpt.json
├── wiki-before/
│   └── services/
│       ├── demo_gateway.md
│       └── demo_nas.md
├── wiki-after/
│   └── services/
│       ├── demo_gateway.md
│       └── demo_nas.md
├── change-requests/
│   ├── CHANGE_REQUEST_demo_gateway_firewall.md
│   └── CHANGE_REQUEST_demo_nas_snapshot_task.md
├── evidence/
│   └── run_evidence.json
└── output/
    ├── daily-report.md
    └── evaluator-scorecard.json
```

## Demo scenario

Use one compact synthetic scenario with three findings:

1. **Knowledge drift: gateway firewall/NAT**
   - Synthetic OPNsense sanitized excerpt contains a managed firewall/NAT rule that is missing from `wiki-before/services/demo_gateway.md`.
   - The example update shows how a managed block changes.

2. **Knowledge drift: NAS snapshot task**
   - Synthetic TrueNAS correctness summary says a snapshot task exists with retention `14d`.
   - `wiki-before/services/demo_nas.md` says retention is `7d`.
   - A change request updates the NAS service note.

3. **Daily audit evidence: planned container stop + successful backup**
   - Synthetic Loki excerpt contains a planned container stop marker.
   - Synthetic Prometheus excerpt contains a successful backup metric.
   - The generated report should avoid escalating the planned stop and should mention backup success.

This scenario is enough to explain import/update, daily audit, and evaluator behavior without creating a large fixture suite.

## Use documentation-safe addresses

Use RFC 5737 documentation networks and placeholder hostnames:

| Example role | Address/Name |
|---|---|
| Demo gateway | `192.0.2.1`, `demo-gateway` |
| Demo NAS | `192.0.2.10`, `demo-nas` |
| Demo backup host | `192.0.2.20`, `demo-backup` |
| Demo service | `demo-media`, `demo-dashboard` |

Avoid private ranges from the real environment.

## Minimal input examples

### `input/opnsense_sanitized_excerpt.md`

```markdown
# OPNsense Configuration Export — Synthetic Demo

- **interfaces**
  - **lan**
    - if: vtnet0
    - descr: DEMO_LAN
    - ipaddr: 192.0.2.1
- **nat**
  - **rule**
    - interface: wan
    - protocol: tcp
    - destination: wan_address
    - dstport: 8443
    - target: 192.0.2.10
    - local-port: 443
    - descr: demo-dashboard HTTPS
- **filter**
  - **rule**
    - interface: lan
    - type: pass
    - source: 192.0.2.20
    - destination: 192.0.2.10
    - dstport: 22
    - descr: demo-backup SSH to demo-nas
```

### `input/truenas_correctness_summary.json`

```json
{
  "system": {
    "hostname": "demo-nas",
    "version": "TrueNAS-SCALE-DEMO"
  },
  "snapshotTasks": [
    {
      "dataset": "pool/demo-apps",
      "schedule": "daily 00:30",
      "retention": "14d",
      "enabled": true
    }
  ],
  "apps": [
    {
      "name": "demo-dashboard",
      "state": "RUNNING",
      "ports": [443]
    }
  ]
}
```

### `input/telemetry_loki_excerpt.jsonl`

```jsonl
{"ts":"2026-01-01T04:00:00Z","source":"demo-nas","service":"demo-media","level":"info","message":"MAINTENANCE_START type=planned_container_rotation reason=demo_fixture"}
{"ts":"2026-01-01T04:01:00Z","source":"demo-nas","service":"demo-media","level":"warning","message":"container stopped during planned rotation"}
{"ts":"2026-01-01T04:10:00Z","source":"demo-nas","service":"demo-media","level":"info","message":"MAINTENANCE_END type=planned_container_rotation result=success"}
```

### `input/telemetry_prometheus_excerpt.json`

```json
{
  "backup_exit_code{job=\"demo-backup\"}": 0,
  "container_restarts_total{container=\"demo-media\"}": 1,
  "up{job=\"demo-dashboard\"}": 1
}
```

## Expected reader experience

A reader should be able to open files in this order:

1. `demo/README.md` — explains the scenario.
2. `demo/input/*` — shows sanitized source facts and telemetry.
3. `demo/wiki-before/*` — shows stale docs.
4. `demo/change-requests/*` — shows example changes.
5. `demo/wiki-after/*` — shows approved docs after merge.
6. `demo/evidence/run_evidence.json` — shows compact evidence sent to the audit agent.
7. `demo/output/daily-report.md` — shows the final report.
8. `demo/output/evaluator-scorecard.json` — shows evaluator critique.

## Recommendation

Keep the dataset intentionally small: one scenario, two wiki pages, two change requests, one report, and one scorecard.

This makes the repository feel more hands-on without crossing into full open-source product territory.
