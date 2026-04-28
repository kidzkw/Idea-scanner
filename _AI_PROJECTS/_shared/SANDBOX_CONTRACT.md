---
file_type: sandbox_contract
version: v1.0
created: 2026-04-27
status: active
---

# Sandbox Contract

## Non-Negotiable Rule

AI sources are evidence providers, not canonical writers.

Allowed:
- Write JSON outputs in the source sandbox.
- Write transcript or conversation snapshots in the source sandbox.
- Mark findings as `quarantine_pending`.

Forbidden:
- Edit `03_tickers/`.
- Edit `05_triggers/`.
- Edit `_SCORECARD_2Y_3X.md`.
- Promote a quote to `verified_triple` or `verified_quad` by self-declaration.
- Use another AI source's output as primary evidence.

## Synthesis Rule

The synthesis agent reads all source outputs, builds a consensus matrix, excludes quarantine failures, and only then writes canonical markdown.

## Audit Rule

`测谎员` or the main harness must audit all §1-§4 numbers before canonical publication.

