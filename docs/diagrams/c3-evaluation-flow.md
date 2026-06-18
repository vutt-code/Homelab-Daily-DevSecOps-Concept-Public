# C3 — Component View: Evaluation Quality Gate

This C3 view focuses on the evaluator workflow. The evaluator is useful publicly because it demonstrates how the system tries to avoid blindly trusting LLM-generated operations reports.

Generated/maintained using the project `c4-diagram` skill conventions with C4-style Mermaid flowchart notation.

```mermaid
flowchart LR
    %% 1. Actor
    Operator["<b>Homelab Operator</b><br/><i>[Person]</i><br/><br/>Reviews scorecards and calibration results"]

    %% 2. Components inside evaluator
    subgraph EvaluatorBoundary["Evaluator Workflow"]
        direction LR
        Trigger["<b>Manual Evaluator Trigger</b><br/><i>[Component: n8n manual trigger]</i><br/><br/>Keeps evaluation deliberate during calibration"]
        Selector["<b>Mode Selector</b><br/><i>[Component: n8n logic]</i><br/><br/>Chooses live DEV run or golden fixture"]
        Collector["<b>Evidence Collector</b><br/><i>[Component: file readers + JSON assembly]</i><br/><br/>Reads report, HTML preview, run evidence, clusters"]
        RuntimeLogs["<b>Runtime Log Collector</b><br/><i>[Component: Loki query]</i><br/><br/>Adds model/runtime/parser/OOM context"]
        PromptBuilder["<b>Evaluator Prompt Builder</b><br/><i>[Component: n8n Code node]</i><br/><br/>Compacts evidence and rubric into bounded input"]
        ScoreAgent["<b>LLM Rubric Evaluator</b><br/><i>[Component: evaluator model + structured parser]</i><br/><br/>Produces scorecard and critique"]
        DeterministicGates["<b>Deterministic Gates</b><br/><i>[Component: format/safety/fixture checks]</i><br/><br/>Validates sections, side effects, and expected outcomes"]
    end

    %% 3. Stores and external runtime
    DevArtifacts[("<b>DEV Audit Artifacts</b><br/><i>[Store: Markdown/HTML/JSON]</i><br/><br/>Reports, previews, evidence, cluster summaries")]
    Fixtures[("<b>Golden Fixtures</b><br/><i>[Store: synthetic cases]</i><br/><br/>Known clean, unsafe, missed-failure, and bad-format examples")]
    Scorecards[("<b>Evaluator Artifacts</b><br/><i>[Store: JSON + Markdown]</i><br/><br/>Scorecards and human-readable evaluation reports")]
    EvalModel["<b>Evaluator LLM Endpoint</b><br/><i>[External System: OpenAI-compatible model API]</i><br/><br/>Scores output according to rubric"]

    %% Relationships
    Operator -->|"Starts evaluation<br/>[Manual run]"| Trigger
    Trigger --> Selector
    Selector -->|"Live mode"| DevArtifacts
    Selector -->|"Fixture mode"| Fixtures
    DevArtifacts --> Collector
    Fixtures --> Collector
    Collector --> PromptBuilder
    RuntimeLogs --> PromptBuilder
    PromptBuilder --> ScoreAgent
    ScoreAgent -->|"Model request<br/>[API]"| EvalModel
    ScoreAgent --> DeterministicGates
    DeterministicGates --> Scorecards
    Scorecards -->|"Review result<br/>[Markdown/JSON]"| Operator

    %% C4 Styling
    classDef person fill:#08427B,stroke:#052E56,color:#fff
    classDef component fill:#438DD5,stroke:#2E6295,color:#fff
    classDef store fill:#438DD5,stroke:#2E6295,color:#fff
    classDef external fill:#999999,stroke:#6B6B6B,color:#fff

    class Operator person
    class Trigger,Selector,Collector,RuntimeLogs,PromptBuilder,ScoreAgent,DeterministicGates component
    class DevArtifacts,Fixtures,Scorecards store
    class EvalModel external
```

## Component responsibilities

| Component | Technology | Responsibility |
|---|---|---|
| Manual Evaluator Trigger | n8n manual trigger | Keeps evaluation intentional during DEV calibration. |
| Mode Selector | n8n logic/code | Chooses between live DEV audit artifacts and synthetic golden fixtures. |
| Evidence Collector | File readers, JSON assembly | Reads deterministic audit evidence, generated report, rendered email preview, and cluster summary. |
| Runtime Log Collector | Loki query | Adds evidence about model/runtime/parser/context failures that may affect output quality. |
| Evaluator Prompt Builder | n8n Code node | Compresses evidence and rubric into bounded evaluator input. |
| LLM Rubric Evaluator | Evaluator model, structured output parser | Produces a scorecard and human-readable critique. |
| Deterministic Gates | Scripts/code checks | Validates report structure, safety flags, email formatting, and fixture expectations outside the LLM. |

## Evaluator scoring dimensions

The evaluator checks multiple dimensions rather than a single pass/fail result:

- severity accuracy,
- grounding in deterministic evidence,
- tool/RAG selection quality,
- report usefulness,
- email formatting,
- LLM/runtime health,
- user-intent alignment,
- safety findings,
- false positives,
- missed findings,
- unsupported recommendations.

## Golden fixture concept

Golden fixtures are synthetic cases with known expected outcomes.

| Fixture type | Expected evaluator behavior |
|---|---|
| Clean high-score report | Score high with no false positives or safety findings. |
| Unsupported CRITICAL escalation | Penalize severity and list a false positive. |
| Missed backup failure | Identify missed deterministic failure. |
| Unsafe production write from DEV | Add safety finding and cap score. |
| Bad email formatting | Penalize formatting and identify broken structure. |

## Why this matters

The evaluator is not a guarantee of correctness, but it creates a repeatable review loop. It turns subjective trust in LLM output into stored artifacts that can be compared across daily runs, code changes, and prompt changes.
