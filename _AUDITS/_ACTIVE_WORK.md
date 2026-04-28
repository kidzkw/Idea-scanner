# Active Work Registry (concurrency dedupe) — v3.2 (template)

**Purpose**: cross-session in-flight task registry. 总监 MUST read before routing any user input. Append before dispatch, update status on completion. Prevents multi-window duplicate dispatch / file lock collision / wasted MCP quota.

**Maintainer**: 总监 (primary) + 调度员 (CronCreate durable jobs)
**Reader**: 总监 (every routing) + user (manual lookup)
**Lifecycle**: in_progress → completed | abandoned (stale > 4h auto-flag)

---

## Schema

| Field | Type | Required | Description |
|---|---|---|---|
| `task_id` | string | Y | Unique, format `<YYYY-MM-DD>_<window_tag>_<seq>` |
| `ticker` | string | Y/N | Single-ticker tasks required; cross-ticker / global = `_GLOBAL` |
| `task_type` | enum | Y | `verbatim` / `sec_pull` / `dd_score` / `morning_brief` / `audit` / `inbox_5stage` / `rule_change` / `other` |
| `agent` | string | Y | Worker / dept head dispatched to |
| `owner_session` | string | Y | Conversation start ISO / user-provided window tag |
| `started_at` | ISO 8601 | Y | Dispatch timestamp |
| `eta` | string | N | Estimated completion |
| `status` | enum | Y | `in_progress` / `blocked` / `completed` / `abandoned` |
| `lock_path` | string | N | Associated file lock path |
| `notes` | string | N | Blocker reason / completion summary / waiver ref |

---

## Workflow (总监 must run)

### 1. Before routing (every user input)
```
1. Read _ACTIVE_WORK.md
2. Filter: status=in_progress AND started_at within last 4h
3. If user request hits an active row (ticker, task_type):
     → DO NOT dispatch. Reply:
       "Window <owner_session> is running <task_type> on <ticker>, ETA <eta>.
        Choose: (a) wait / (b) parallel anyway (please confirm) / (c) cancel?"
4. If no hit → proceed with normal routing
```

### 2. Before dispatch (no duplicates)
```
1. Append in_progress row (table tail)
2. Call Agent tool to dispatch
3. Reference task_id in 总监 session lock
```

### 3. After worker reports back
```
1. Edit _ACTIVE_WORK.md: set task_id status to completed (or abandoned)
2. Note output_files / waiver in notes
3. If stale cleanup, mark "[STALE>4h auto-abandoned]"
```

### 4. On TODO review
```
1. Read _PENDING_TODO.md + _ACTIVE_WORK.md
2. Strip in_progress rows from open TODO pool
3. Mark "in-flight (window <X>, running Nmin)" instead of "open"
```

---

## Active Tasks (live table)

| task_id | ticker | task_type | agent | owner_session | started_at | eta | status | lock_path | notes |
|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | |

---

## Completed Archive (last 24h, rotates weekly to `_ACTIVE_WORK_archive.md`)

| task_id | ticker | task_type | completed_at | duration | output |
|---|---|---|---|---|---|
| | | | | | |

---

## Stale cleanup
- Every 总监 read: rows with `started_at > 4h` AND `status=in_progress` → mark `abandoned`, prompt user "task_id X timed out, marked abandoned, please confirm worker state".
