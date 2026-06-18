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

Run it in the background; it exits when something new happens (lineup posted,
goal, substitution, booking, score/status change) so the agent can relay it and
re-arm.

**Honest limits**
- The 26worldcup dataset is the only live source reachable here and refreshes on
  a cron (minutes-to-~1h lag), so updates are near-live, **not** second-by-second.
- There is no live player-rating feed, so "player in poor form / 状态不好" can
  only be inferred from objective events: early substitution, early booking,
  conceding, red card, etc.

## Data sources (only these are reachable from this environment)
- `raw.githubusercontent.com/26worldcup/26worldcup.github.io` — schedule,
  lineups, venues, stats (mirrors FIFA). Refreshed via `scripts/update-schedule.mjs`.
- `raw.githubusercontent.com/martj42/international_results` — historical results.
- Web *search* works; direct fetches of stats sites (SofaScore, FBref, FotMob,
  corner-stats, footystats) are 403-blocked by the network policy.
