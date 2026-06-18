# Daily DevSecOps Report Template

> Sanitized public template. Adapt section names to your own environment.

## 1. Executive Summary

Concise overview of homelab stability, storage, and security.

Call out:

- new issues,
- recurring issues,
- resolved issues,
- anything requiring human action today.

## 2. Syslog Audit & Security Anomalies

Summarize notable log findings from the last audit window.

Include:

- source system,
- severity,
- whether the finding is new or recurring,
- evidence summary,
- known suppression/policy context where relevant.

If no critical anomalies were detected, say so directly.

## 3. Docker Services & Telemetry Health

Summarize container/service health:

- crash loops,
- missing containers,
- restart spikes,
- service outage checks,
- resource saturation signals.

## 4. Storage & Backup Status

Summarize storage and backup checks:

- snapshot status,
- replication status,
- cloud/offsite sync status,
- pull-backup start/finish marker status,
- expected design conditions that should not be treated as incidents.

## 5. Recommended Actions

Provide numbered, concrete, human-actionable recommendations.

Good recommendations are:

- specific,
- evidence-based,
- scoped to the affected service,
- safe for the current environment,
- and clear about whether they are urgent or optional.

## 6. Trend Summary

One line per recent run:

```text
YYYY-MM-DD | severity | one-line summary
```

If no history exists:

```text
No historical data yet — this is the first run.
```
