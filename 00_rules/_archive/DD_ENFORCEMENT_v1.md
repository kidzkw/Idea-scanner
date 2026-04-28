---
file_type: authoritative_enforcement_gate
version: v1.1
created: 2026-04-24
last_updated: 2026-04-24 (v1.0 → v1.1: Gate A clarification triplet still satisfies + watchdog drip default + 90s fail-fast on list_pages)
authority: DD_WORKFLOW v3.0
authority: supersedes soft "必须三方并行" language in DD_WORKFLOW_v2.md §5.4 + feedback_verbatim_three_way
purpose: make skipping DD steps structurally impossible, not just rule-violating
status: active (effective immediately for all new VERBATIM / earnings-event work)
owner: 总监 (enforcement) / 合规主管 (audit) / 测谎员 (mechanical check)
supersedes_pattern:
  - "primary_only_pending" as a shippable end-state for earnings-event VERBATIM
  - receipts that merely declare "TODO-at-T-1 for ChatGPT/Grok" without MCP evidence
---

# DD Enforcement v1.0 — "Structural Impossibility" Gate

> **Problem statement (2026-04-24)**: Wave 1+2 batch (NBIS/MPWR/FLY/FN/POWL/ALAB/WOLF/NVTS) shipped with Claude-only VERBATIM. Workers wrote `data_quality: primary_only_pending` + a backfill TODO. 测谎员 PASSed because tokens were formally correct. Rule technically honored, substantively bypassed.
>
> **Root cause**: the rule said "必须三方并行 fire". The *checker* only verifies "whatever tokens you wrote are internally consistent". There is no check that the three fetches *actually happened*. `primary_only_pending` became an opt-out label.
>
> **Fix**: stop allowing "I'll do it later" receipts. Require **mechanical evidence** (MCP tool-call IDs + three raw files) *before* any downstream artifact (VERBATIM / SSOT / Scorecard update) is accepted. Without evidence, pipeline halts — not warns.

---

## 1. Three enforcement gates

### Gate A — Three-raw file existence (hard pre-condition)

**Rule (v1.1)**: no VERBATIM / SSOT / Scorecard write for an earnings-event ticker is accepted until **at least the 3-source triplet exists** in `02_raw/_processed/YYYY-MM/` matching:

```
YYYY-MM-DD_<TICKER>_claude_verbatim-<event>.md     (mandatory)
YYYY-MM-DD_<TICKER>_chatgpt_verbatim-<event>.md    (Gate A mandatory)
YYYY-MM-DD_<TICKER>_grok_verbatim-<event>.md       (Gate A mandatory)
YYYY-MM-DD_<TICKER>_gemini_verbatim-<event>.md     (BONUS, unlocks verified_quad — NOT required for Gate A)
```

**Important — back-compat**: 4-source `verified_quad` is a BONUS tier (Integrity Modifier +1 per DD_WORKFLOW v3.0 §3.2), NOT mandatory. The 3-source triplet (Claude + ChatGPT + Grok) continues to satisfy Gate A and produces anchor-eligible artifacts. Pre-2026-04-24 verified_triple entries remain valid with no retrofit required.

**Event trigger scope** (same as DD_WORKFLOW §5.4 triggers):
- new SSOT baseline
- earnings 48h window (T−2 → T+2)
- investor conference (CES/OFC/GTC/Semicon West)
- CNBC/Bloomberg/FT/WSJ televised interview
- verified X exec post
- ≥20% single-day move
- user-specified

**Exemption (explicit, narrow)**: pre-IPO tickers with no earnings call ever → allowed `inaugural_pre_ipo` label, Gate A waived; Gate B still applies (MCP evidence of the two web searches / news scans still required).

**Enforcement point**: 流水主管's `分诊员` check before routing to 研究员 / 原话手. If triplet incomplete → raw bounces to `02_raw/_rejected/` with reason `three_way_triplet_missing`. Worker must complete the triplet or request formal exemption.

### Gate B — MCP tool-call evidence in receipt (hard receipt schema)

Every worker that ships a VERBATIM / SSOT-earnings-related artifact MUST emit a JSON receipt block at the bottom of its report to 主管. Missing or malformed → auto-reject.

```json
{
  "contract_id": "<dispatched by 总监, e.g. DC-2026-04-24-POWL-001>",
  "ticker": "POWL",
  "event": "Q2_FY26_earnings",
  "worker": "原话手",
  "mcp_evidence": {
    "chatgpt": {
      "list_pages_call_id": "<mcp call id from tool-use log>",
      "evaluate_script_call_id": "<...>",
      "raw_text_excerpt_sha256": "<hex digest of first 500 chars>",
      "raw_file": "02_raw/_processed/2026-04/2026-04-24_POWL_chatgpt_verbatim-q2fy26.md"
    },
    "grok": {
      "list_pages_call_id": "...",
      "evaluate_script_call_id": "...",
      "raw_text_excerpt_sha256": "...",
      "raw_file": "02_raw/_processed/2026-04/2026-04-24_POWL_grok_verbatim-q2fy26.md"
    },
    "claude_primary": {
      "websearch_or_webfetch_urls": ["https://..."],
      "raw_file": "02_raw/_processed/2026-04/2026-04-24_POWL_claude_verbatim-q2fy26.md"
    }
  },
  "mcp_fallback_waiver": null,
  "artifacts_written": [
    "03_tickers/VERBATIM/POWL_verbatim.md",
    "03_tickers/POWL.md"
  ]
}
```

**Hard fields**: `contract_id`, `mcp_evidence.chatgpt.list_pages_call_id`, `mcp_evidence.grok.list_pages_call_id`, `mcp_evidence.chatgpt.raw_file` (+ grok), `mcp_evidence.claude_primary.raw_file`. Any missing → **auto-reject by 测谎员**, artifact reverted.

**MCP fallback waiver (v1.1)** (only way to ship without MCP evidence): set `mcp_fallback_waiver` to an object with `reason`, `attempted_at`, `mcp_list_pages_call_id`, `list_pages_result` showing actual failure (chrome not running, port 9222 dead, OR 90s timeout exceeded), and `timeout_observed_seconds` if applicable. Worker MUST call `mcp__chrome-devtools__list_pages` and include the real result before waiver is accepted.

**90s hard ceiling** (v1.1): every `list_pages` and `evaluate_script` invocation has a 90 s wall-clock timeout. On timeout → emit waiver, exit clean, defer to next watchdog drip cycle. Do NOT inline retry. Do NOT extend timeout. 测谎员 detects bypass via `evaluate_script_call_id` timestamp delta (call duration > 90s without explicit waiver = `WAIVER_FABRICATED`).

Random "MCP down" claims without a `list_pages` call ID → reject.

When waiver is valid: `data_quality` allowed to be `primary_only_pending`, artifact ships but **enters `_VERBATIM_BACKFILL_TRACKER.md` with hard deadline T+48h**. Deadline miss → 合规主管 escalates to 总监.

### Gate C — 测谎员 mechanical check for Gates A & B

New 测谎员 check (added to its core algorithm, **not replacing** the v1.0 token checks):

```
for each earnings_event_batch (ticker, event):
    # Gate A check (v1.1) — triplet still satisfies; gemini optional
    triplet = glob("02_raw/_processed/*/" + date + "_" + ticker + "_{claude,chatgpt,grok}_verbatim-" + event + ".md")
    quad_optional = glob("02_raw/_processed/*/" + date + "_" + ticker + "_gemini_verbatim-" + event + ".md")
    if len(triplet) < 3 AND event is not pre_ipo_inaugural:
        # Check for valid waiver
        receipt = read_receipt(ticker, event)
        if not receipt.mcp_fallback_waiver or not valid_waiver(receipt.mcp_fallback_waiver):
            mark TRIPLET_MISSING; demote all artifacts for (ticker, event) to data_quality=dubious_pending_recheck
            write _AUDITS/YYYY-MM-DD_enforcement_triplet_missing_<ticker>.md

    # Quad bonus (v1.1)
    if len(triplet) == 3 AND len(quad_optional) == 1:
        # validate gemini raw is not duplicate of chatgpt raw (FABRICATED_QUAD check)
        if sha256(first_500(gemini_raw)) != sha256(first_500(chatgpt_raw)):
            mark VERIFIED_QUAD_ELIGIBLE
            artifact data_quality may be promoted to verified_quad if cross-source quote match found
        else:
            mark FABRICATED_QUAD; downgrade artifact to verified_triple

    # Gate B check
    if receipt missing or any required field null:
        mark RECEIPT_INCOMPLETE; same demotion

    # Gate B integrity: hash check
    if receipt.mcp_evidence.chatgpt.raw_text_excerpt_sha256 != sha256(first_500_chars(chatgpt_raw_file)):
        mark RECEIPT_HASH_MISMATCH; same demotion

    # Gate B 90s timeout integrity (v1.1)
    if receipt.mcp_evidence.{chatgpt,grok,gemini}.evaluate_script_duration_seconds > 90:
        if not receipt.mcp_fallback_waiver:
            mark TIMEOUT_BYPASS; escalate to 总监

    # Waiver integrity check (if any)
    if receipt.mcp_fallback_waiver and not receipt.mcp_fallback_waiver.mcp_list_pages_call_id:
        mark WAIVER_FABRICATED; escalate to 总监
```

**Key**: 测谎员 no longer treats `primary_only_pending` as automatically valid. It is valid **only if** a waiver with a real `list_pages_call_id` exists and the T+48h deadline has not passed.

---

## 2. Dispatch contract protocol (总监 → 主管 → worker)

When 总监 dispatches any VERBATIM / earnings-related task, the dispatch message MUST include:

```
contract_id: DC-YYYY-MM-DD-<TICKER>-NNN
enforcement: DD_ENFORCEMENT_v1 Gates A+B+C
required_receipt_fields: [contract_id, mcp_evidence.{chatgpt,grok,claude_primary}.raw_file, mcp_evidence.{chatgpt,grok}.list_pages_call_id, artifacts_written]
optional_receipt_fields: [mcp_evidence.gemini.{list_pages_call_id, evaluate_script_call_id, raw_text_excerpt_sha256, raw_file}]
default_dispatch_mechanism: watchdog_drip_croncreate_durable
fail_fast_seconds: 90
waiver_policy: mcp_fallback_waiver requires real list_pages_call_id + 48h backfill
```

主管 relays intact to worker. Worker echoes `contract_id` in every file header it writes (`enforcement_contract_id: DC-...`) so grep-based verification is trivial.

---

## 3. Why this is structural, not another rule

Previous rules said "must do X". Worker could self-declare compliance. Checker only validated the self-declaration.

Under v1:
- **Gate A** is a filesystem fact (three files exist or they don't). Worker cannot self-declare around it.
- **Gate B** requires MCP call IDs that are only producible by actually invoking chrome-devtools tools (the IDs are assigned by the MCP host, not the worker).
- **Gate C** makes 测谎员's green light mechanically conditional on both facts above.

The only remaining opt-out is the MCP fallback waiver, which itself requires a real `mcp__chrome-devtools__list_pages` call ID — i.e. the worker must actually attempt MCP and fail, not just claim it was down. Waiver creates a hard T+48h debt, audited by 合规主管.

**Net**: to ship a non-triple artifact, a worker must (a) fail MCP for real, (b) document the failure with MCP's own call ID, (c) accept a 48h backfill debt that is tracked. The "TODO-at-T-1 and move on" path is closed.

---

## 4. Retro policy for pre-v1 artifacts (Wave 1+2 of 2026-04-24)

The 8 tickers shipped 2026-04-24 (NBIS/MPWR/FLY/FN/POWL/ALAB/WOLF/NVTS) are **non-compliant** under v1 Gate A (no chatgpt/grok raw files exist).

User chooses one of:
1. **Backfill**: spawn parallel 3-way fetch agents for the 8 tickers, bring them up to `verified_dual` or `verified_triple`; artifacts updated in place.
2. **Mark pre-enforcement**: add `enforcement_status: pre_enforcement_v1 / primary_only_pending` to each ticker's VERBATIM frontmatter + queue in `_VERBATIM_BACKFILL_TRACKER.md` with soft deadline (next earnings T−3). Artifacts remain usable for narrative context but are **not admissible as anchors** for Scorecard / SSOT thesis.
3. **Full rerun**: reject and redo all 8 under v1.

Default recommendation: **option 2 (mark pre_enforcement_v1)** unless the ticker is DD-0 with imminent position-size catalyst, in which case option 1.

---

## 5. Simulation — single-ticker dispatch under v1

### 5.1 Worker prompt (excerpt, from 原话手 for POWL Q2 FY26)

```
Contract: DC-2026-04-24-POWL-001
Enforcement: DD_ENFORCEMENT_v1 Gates A+B+C

Task: Build VERBATIM for POWL Q2 FY26 earnings event (call 2026-05-04).

MANDATORY FIRST ACTIONS (before any web search):
1. Call mcp__chrome-devtools__list_pages — capture returned call_id
2. If list returns no ChatGPT / Grok tab → invoke mcp__chrome-devtools__new_page for each, capture call_ids
3. Call mcp__chrome-devtools__evaluate_script to send the ChatGPT prompt (template §6 AGENT_PROMPT_TEMPLATE) — capture call_id + raw text excerpt
4. Repeat for Grok
5. Save each raw text to:
   02_raw/_processed/2026-04/2026-04-24_POWL_chatgpt_verbatim-q2fy26.md
   02_raw/_processed/2026-04/2026-04-24_POWL_grok_verbatim-q2fy26.md
6. Only AFTER steps 1-5 succeed, proceed to Claude primary WebSearch/WebFetch and file 3rd raw

If step 1 returns error / no active tab AND cannot start: proceed with ONLY Claude primary + populate mcp_fallback_waiver in receipt using the real list_pages error output.

Receipt JSON (bottom of report) MUST populate every required field or submission is auto-rejected.
```

### 5.2 Worker output (auto-rejected example)

Worker ships:
```
VERBATIM POWL_verbatim.md updated. data_quality: primary_only_pending (will backfill T−1).
Receipt: {contract_id: DC-2026-04-24-POWL-001, mcp_evidence: null}
```

→ 测谎员 Gate C: RECEIPT_INCOMPLETE + TRIPLET_MISSING + WAIVER_FABRICATED (no list_pages_call_id). Artifact `POWL_verbatim.md` edited: `data_quality → dubious_pending_recheck`; audit file `_AUDITS/2026-04-24_enforcement_triplet_missing_POWL.md` written. 合规主管 reports to 总监. 总监 respawns 原话手 with explicit MCP-first order.

### 5.3 Worker output (accepted example)

```
VERBATIM POWL_verbatim.md updated. data_quality: verified_triple on 4/7 L4-L5 quotes, primary_only on 3/7 (single CFO post-call ad-hoc).
Receipt: {
  contract_id: "DC-2026-04-24-POWL-001",
  mcp_evidence: {
    chatgpt: {list_pages_call_id: "toolu_01abc", evaluate_script_call_id: "toolu_01def", raw_text_excerpt_sha256: "f4a9...", raw_file: "02_raw/_processed/2026-04/2026-04-24_POWL_chatgpt_verbatim-q2fy26.md"},
    grok: {list_pages_call_id: "toolu_01abc", evaluate_script_call_id: "toolu_01ghi", raw_text_excerpt_sha256: "b2c1...", raw_file: "02_raw/_processed/2026-04/2026-04-24_POWL_grok_verbatim-q2fy26.md"},
    claude_primary: {websearch_or_webfetch_urls: ["https://seekingalpha.com/article/powl-q2-fy26-transcript"], raw_file: "02_raw/_processed/2026-04/2026-04-24_POWL_claude_verbatim-q2fy26.md"}
  },
  mcp_fallback_waiver: null,
  artifacts_written: ["03_tickers/VERBATIM/POWL_verbatim.md", "03_tickers/POWL.md"]
}
```

→ 测谎员 Gate A: ✅ triplet found. Gate B: ✅ all required fields present, hashes match. Proceed to v1.0 token checks (per VERIFICATION_TOKENS_v1 §6) as normal. If those also pass → VERIFIED.

---

## 6. Rollout

- **2026-04-24 (immediate)**: AGENT_PROMPT_TEMPLATE_v1 gets §9 (MCP-first + receipt schema). 测谎员.md gets Gate A/B/C check. 总监.md + 合规主管.md learn contract_id protocol.
- **2026-04-25 first batch**: all new earnings-event dispatches go through v1 gate. Any work not passing gate is rejected and reworked.
- **Retro (Wave 1+2)**: per §4, user decision pending.
- **2026-04-24 v1.1**: Gate A clarification (triplet still satisfies, quad bonus); 90s fail-fast on list_pages; gemini optional in receipt; FABRICATED_QUAD detection (sha256 dedup vs chatgpt_raw); watchdog drip default dispatch.

---

## Change log

- **v1.0 · 2026-04-24** · initial spec. Triggered by Wave 1+2 "technically honored, substantively bypassed" failure.
- **v1.1 · 2026-04-24** · Gate A back-compat note (triplet OK); Gate B 90s ceiling; Gate C verified_quad eligibility check + FABRICATED_QUAD downgrade. Receipt schema gains optional gemini block.
