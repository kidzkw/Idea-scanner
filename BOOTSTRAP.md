# BOOTSTRAP — AI_Research_Framework

This directory is a framework template extracted from `AI_Semi_Research`. It contains:

- 30 agent prompts (`.claude/agents/*.md`)
- Per-AI sandbox v1.0 architecture (5 dedicated chrome MCP instances)
- DD_AUTHORITY_v3.2 + AGENT_OUTPUT_AUTHORITY_v2.0 + Gates A/B/C rules
- 7-dim scoring framework (Upside / Probability / Catalyst / SanDisk / Theme Diff / AI Fit / Integrity Δ)
- 5-stage raw intake pipeline (Triage → Extract → Diff → Rule Check → Archive)
- 4-source VERBATIM anchor standard (Claude + ChatGPT + Grok + Gemini)
- All schema files (empty / template state)

It does NOT contain:
- Any ticker SSOT data, VERBATIM, SEC, SOCIAL files
- Any raw research history
- Any audit reports / session logs
- Any portfolio / position data
- The `research-dashboard/` Next.js frontend (deliberately excluded)
- The `node_modules/`, `.git/`, `.claude/projects/`, `.claude/approvals/` runtime artifacts

---

## Quick start (bootstrap a new universe)

### 1. Define your universe
Edit `00_rules/_AUTHORITY_INDEX.md` (and any v3.x authority files) to declare your universe scope. Examples:
- AI semi (the original)
- Biotech (oncology, gene therapy, etc.)
- Fintech (payments, neobanks, etc.)
- Energy (nuclear / solar / battery)

You may also need to configure:
- `03_tickers/_TAXONOMY.md` — define tier structure for your universe
- `01_value_chain/README.md` — value-chain layer mapping
- Scorecard "Theme Differentiation" criteria in `03_tickers/_SCORECARD_2Y_3X.md`

### 2. Launch 5 chrome MCP instances
```powershell
cd _AI_PROJECTS
.\launch_all_chrome.ps1
```
This starts 5 dedicated chrome instances (one per AI sandbox + one shared system).

### 3. Sign in to 4 AI web services
Each chrome instance has its own profile dir. Sign in once per service:
- claude.ai → `_AI_PROJECTS/claude_research/chrome_profile/`
- chatgpt.com → `_AI_PROJECTS/chatgpt_research/chrome_profile/`
- grok.com → `_AI_PROJECTS/grok_research/chrome_profile/`
- gemini.google.com + notebooklm.google.com → `_AI_PROJECTS/gemini_research/chrome_profile/`

### 4. Add MCP entries
Open `00_rules/MCP_SERVER_CONFIG_TO_ADD.md` and append the 5 chrome-devtools entries to your global Claude Code MCP config.

### 5. Restart Claude Code
After restart, run `/mcp` to verify 5+ chrome-devtools server entries are listed.

### 6. 总监 warmup verification
First user message: ask 总监 to run warmup. It must report cache-hit on the 4 authority files:
- `00_rules/DD_AUTHORITY_v3.2.md`
- `00_rules/AGENT_OUTPUT_AUTHORITY_v2.0.md`
- `00_rules/AI_AGENT_ISOLATION_ARCHITECTURE_v1.0.md`
- `00_rules/AGENT_PROMPT_TEMPLATE_v1.md`

If not cached, 总监 reads them inline (slower first run).

---

## Known system behaviors (carry-over from parent project)

These are documented operational realities. They do NOT need re-discovery; codified in `00_rules/`:

1. **Gemini quarantine-first** — Gemini frequently fabricates SEC numbers (≥14 cumulative confirmed in parent project). NEVER anchor `verified_quad` on Gemini alone. See `00_rules/AGENT_OUTPUT_AUTHORITY_v2.0.md` §A.6 + B.10.

2. **Gemini Deep Research FORBIDDEN** — Chat-not-persisted bug + frequent timeout. Use 普通 (normal) mode only. See `00_rules/AGENT_PROMPT_TEMPLATE_v1.md` §6.

3. **Chrome MCP serial dispatch (pre-sandbox)** — Before per-AI sandbox v1.0 was activated, multiple chrome agents in parallel shared global selected_page → only one wins. With per-AI sandbox active, each AI has dedicated chrome → parallel-safe.

4. **Chrome chat freshness gate** — Existing chat tabs with >10 messages must be replaced with a new tab to prevent context bleed. See `AGENT_PROMPT_TEMPLATE_v1` §9 step 4.

5. **Plan-out Mode (总监 plans, main Claude dispatches)** — Every user message routes to 总监 first. 总监 outputs a `dispatch_plan` JSON; main Claude is the sole physical Agent dispatcher.

6. **Recommendations queue** — Never embed "next steps" in user-facing replies. Append to `_AUDITS/_总监_战略建议队列.md`. 总监 is sole strategic synthesizer.

7. **Receipt audits** — Agent receipts can hallucinate version numbers + phantom tool usage. Always run `回执稽查 phase_3` after multi-agent `phase_1` dispatch.

8. **Approval-broker hook + Chinese path bug** — Sub-agents fail Write to `.claude/agents/总监.md` etc; main Claude unaffected. Workaround: main Claude does these writes directly.

---

## What to do FIRST after bootstrap

1. Run `_AUDITS/_PENDING_TODO.md` is empty (template). Add your initial tickers / universe scoping TODOs here.
2. Add first batch of raw research files to `02_raw/_inbox/` using the format in `02_raw/RAW_TEMPLATE.md`.
3. Tell 总监: "处理一下 inbox" (or "process inbox"). The 5-stage pipeline auto-runs.
4. After first SSOTs are written, run `规则稽查` to verify Gate A/B/C compliance.

---

## Audit & integrity tools

- `_AUDITS/_FABRICATION_LOG.md` — central log for AI fabrication detection. Never archive; cumulative.
- `_AUDITS/_总监_战略建议队列.md` — strategic recommendation queue.
- `_AUDITS/_PENDING_TODO.md` — cross-session TODO queue (总监 reads on warmup).
- `_AUDITS/_ACTIVE_WORK.md` — in-flight task registry (concurrency dedupe).
- `_AUDITS/_完成的TODO_archive.md` — archived completed TODOs.

---

## Source-of-record
This template was extracted from `D:/Claude/AI_Semi_Research/` on the export date by a clean copy script that:
- Copied `00_rules/`, `01_value_chain/`, `08_hidden_gems_PLANNING/`, `.claude/agents/`, `_AI_PROJECTS/_shared/`, plus launchers, in full.
- Created empty scaffolding for `02_raw/`, `04_daily_log/`, `06_data_sources/`, and 4 AI sandbox dirs (no `chrome_profile` runtime data).
- Reduced `03_tickers/`, `05_triggers/`, `_AUDITS/` to schema-only stubs (frontmatter + headers + meta-rules, no data rows).
- Excluded `research-dashboard/`, `_RESEARCH_LOG.md`, `_TODO.md`, `07_archive/`, all `_processed/*` raw history, and runtime files.
- Sanitized `README.md` to remove "AI_Semi_Research" project name and AI-semi-specific universe descriptions.

To start fresh: just delete this `BOOTSTRAP.md` after you've completed setup.
