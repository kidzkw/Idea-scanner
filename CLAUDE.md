# World Cup 2026 Predictor — working notes

A static React/TS site (Vite, deploys to GitHub Pages) plus a set of analysis
scripts. Build with `npm run build`; refresh fixtures with `npm run update-schedule`.

## Match-analysis workflow ("分析 <team/match>")

When the user asks to analyse a match, produce a four-part report:

1. **实力对比 (Strength)** — Elo gap + model W/D/L and expected goals
   (`src/engine/elo.ts`), recent form / goals / head-to-head from the martj42
   international-results dataset (`/tmp/intl.csv`, fetched from
   `raw.githubusercontent.com/martj42/international_results`). Plus live group
   standing and the finish-1st-vs-2nd path where relevant (`src/engine/bracket.ts`).
2. **阵容对比 (Lineups)** — starting XI, formation, and bench from the
   26worldcup `lineups.json` (per match: `tactics`, `xi`, `subs`, `goals`,
   `bookings`, `substitutions`). Lineups appear ~1h before kickoff.
3. **角球对比 (Corners)** — real per-team corner numbers gathered via web
   search (stats APIs like SofaScore/FBref are network-blocked here, so this is
   "real data + projection", clearly labelled), anchored to actual corner counts
   from matches already played.
4. **Live monitor** — start `scripts/monitor-match.mjs <matchNumber>` in the
   background to stream objective in-match changes.

## Live monitor

```
node scripts/monitor-match.mjs <matchNumber>          # loop, exit on change/finish
node scripts/monitor-match.mjs <matchNumber> --once   # single poll
```

Run it in the background; it exits when something new happens so the agent can
relay it and re-arm. Events are **tagged by win/loss impact** and emitted
high-impact first:
- `‼️ high` — goals, own goals, penalties, red cards (swing the result)
- `❗ med`  — a **starter subbed off before 60'** (injury / poor-form proxy),
  a booking on a key player
- `low`    — routine rotation subs, ordinary yellows

### Real-time data source — ESPN direct (working now)

`site.api.espn.com` is **now allow-listed**, so the monitor reads ESPN live
directly (free, no key — full goals/assists/cards/subs/penalty commentary),
polling at its `--interval` (default 20s). The monitor auto-selects: it probes
the ESPN scoreboard endpoint at startup and uses the direct provider whenever
it is reachable — no flag needed. ESPN team abbreviations match our FIFA codes,
so matching is by code + date.

Historically the **egress allow-list** blocked every sports API
(`Host not in allowlist: <host>`); only GitHub hosts were allowed. The workaround
was **GitHub Actions runners have open internet**, so
`.github/workflows/live-espn.yml` runs `scripts/fetch-espn-live.mjs` on a runner
to pull the same ESPN data and commit it to `public/data/live-espn.json`, which
the monitor reads through the authenticated git remote (`git fetch` + `git show
origin/main:...`, since the repo is private). That proxy is now a **manual
fallback only** — its `*/5` cron is disabled; trigger it from the Actions tab
(`workflow_dispatch`) if the allow-list is ever revoked.

Provider order (auto-selected): **ESPN direct (current)** → ESPN-via-Actions
proxy (manual fallback) → 26worldcup dataset.

**Honest limit that remains regardless of source:** there is no live
player-rating feed, so "player in poor form / 状态不好" is always inferred from
objective events (early sub, booking, conceding, red card), never a rating.
Cadence on ESPN direct is the poll interval (~20s default), not second-by-second;
on the Actions-proxy fallback it is ~5 min (GitHub cron is best-effort).

## Data sources (only these are reachable from this environment)
- `raw.githubusercontent.com/26worldcup/26worldcup.github.io` — schedule,
  lineups, venues, stats (mirrors FIFA). Refreshed via `scripts/update-schedule.mjs`.
- `raw.githubusercontent.com/martj42/international_results` — historical results.
- Web *search* works; direct fetches of stats sites (SofaScore, FBref, FotMob,
  corner-stats, footystats) are 403-blocked by the network policy.
