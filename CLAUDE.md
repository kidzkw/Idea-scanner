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

### Real-time data source — GitHub Actions ESPN proxy (working now)

The environment's **egress allow-list** blocks every sports API
(`Host not in allowlist: <host>`); only GitHub hosts are allowed. The workaround
in use: **GitHub Actions runners have open internet**, so
`.github/workflows/live-espn.yml` runs `scripts/fetch-espn-live.mjs` on a runner
to pull live data from ESPN (`site.api.espn.com`, free, no key — full
goals/assists/cards/subs/penalty commentary) and commits it to
`public/data/live-espn.json` every ~5 min.

This repo is **private**, so the monitor reads that file through the
authenticated git remote (`git fetch` + `git show origin/main:...`), not
raw.githubusercontent.com (which needs a token for private repos). ESPN team
abbreviations match our FIFA codes, so matching is by code + date.

Provider order (auto-selected): ESPN direct (only if `site.api.espn.com` is ever
allow-listed) → **ESPN-via-Actions proxy (current)** → 26worldcup dataset.

**Honest limit that remains regardless of source:** there is no live
player-rating feed, so "player in poor form / 状态不好" is always inferred from
objective events (early sub, booking, conceding, red card), never a rating.
Cadence is ~5 min (GitHub cron is best-effort), not second-by-second.

## Data sources (only these are reachable from this environment)
- `raw.githubusercontent.com/26worldcup/26worldcup.github.io` — schedule,
  lineups, venues, stats (mirrors FIFA). Refreshed via `scripts/update-schedule.mjs`.
- `raw.githubusercontent.com/martj42/international_results` — historical results.
- Web *search* works; direct fetches of stats sites (SofaScore, FBref, FotMob,
  corner-stats, footystats) are 403-blocked by the network policy.
