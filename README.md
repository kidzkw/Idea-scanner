# World Cup 2026 Predictor ⚽

A small, fully open-source predictor for the 2026 FIFA World Cup (48 teams,
Canada / Mexico / USA). It estimates single-match win/draw/loss probabilities
and runs a Monte Carlo simulation of the whole tournament to produce title odds.

No backend, no tracking, no third-party runtime calls — it's a static
React + TypeScript site that builds to plain files and deploys to GitHub Pages.

## What it does

- **Title Forecast** — runs thousands of full tournaments and reports each
  team's chance of reaching the Round of 16, quarters, semis, final, and lifting
  the trophy.
- **Schedule & Results** — all 104 matches (72 group + 32 knockout) with dates,
  venues, live scores for completed games, and knockout slots that resolve to
  teams as earlier rounds finish. Filter by stage/group or results vs. upcoming.
- **Match Predictor** — pick any two teams and see win/draw/loss, expected
  goals, and the most likely scoreline.
- **Groups** — the official 2026 final-draw groups (A–L), sorted by model
  strength.

## How the model works

1. **Elo → expected goals.** Each team has an Elo rating (`src/data/teams.ts`).
   The rating gap is converted to a goal supremacy and then to an expected-goals
   value for each side.
2. **Poisson scorelines.** Goals for each team are drawn from independent
   Poisson distributions, which gives W/D/L probabilities and realistic scores.
3. **Monte Carlo tournament.** Groups are played as round robins (top two plus
   the eight best third-placed teams advance to a 32-team knockout), then a
   single-elimination bracket runs to a champion. Repeat thousands of times and
   average.

Every constant is a transparent, tunable knob — see `src/engine/elo.ts`.

### Known simplifications

- **Elo ratings are approximate** early-2026 values. They are the biggest lever
  on the output; edit `src/data/teams.ts` to re-tune.
- **Knockout seeding** places the 32 qualifiers into a fixed standard-seeded
  bracket by Elo each tournament (1 v 32, 16 v 17, …) rather than FIFA's exact
  group-position slotting and best-third allocation table. Title odds are
  realistic but not identical to the official bracket path.
- Predictions are model estimates, **not betting advice**.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
npm run sim      # headless Monte Carlo in the terminal
npm run update-schedule  # refresh fixtures/results from the live dataset
```

Requires Node 20+.

The schedule in `src/data/matches.ts` is generated, not hand-edited. Re-run
`npm run update-schedule` during the tournament to pull the latest scores and
resolved knockout fixtures, then rebuild.

## Deploy

A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and publishes
`dist/` to GitHub Pages on every push to `main`. Enable it once under
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

The Vite `base` is relative (`./`), so the build works whether it's served at a
domain root (`<user>.github.io`) or under a project path
(`<user>.github.io/<repo>/`).

## Data sources

- Final-draw groups: [2026 FIFA World Cup draw (Wikipedia)](https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_draw)
- Schedule, venues & results: [26worldcup open dataset](https://github.com/26worldcup/26worldcup.github.io) (mirrors the official FIFA schedule)
- Elo ratings inspired by [World Football Elo Ratings](https://www.eloratings.net/)

## License

MIT — see [LICENSE](LICENSE).
