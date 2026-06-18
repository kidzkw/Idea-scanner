import type { GroupId, Team, TeamForecast } from "../types";
import { GROUP_IDS, TEAMS } from "../data/teams";
import { expectedGoals, shootoutWinProb } from "./elo";

/**
 * Monte Carlo forecast for the 48-team 2026 format:
 *   - 12 groups of 4, round robin (top 2 + 8 best third-placed advance => 32)
 *   - Round of 32 -> R16 -> QF -> SF -> Final, single elimination.
 *
 * Knockout seeding simplification: the 32 qualifiers are placed into a fixed
 * standard-seeded bracket by Elo each tournament (1 vs 32, 16 vs 17, ...),
 * rather than FIFA's exact group-position slotting. This keeps strong teams
 * apart early without hard-coding the official bracket table; title odds are
 * realistic but not identical to the official path. Documented in README.
 */

// ---- random helpers ---------------------------------------------------------

/** Sample a Poisson(lambda) count via Knuth's algorithm (fine for small lambda). */
function samplePoisson(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

function sampleScore(home: Team, away: Team, applyHostBonus: boolean): [number, number] {
  const { xgHome, xgAway } = expectedGoals(home, away, { applyHostBonus });
  return [samplePoisson(xgHome), samplePoisson(xgAway)];
}

// ---- group stage ------------------------------------------------------------

interface Standing {
  team: Team;
  pts: number;
  gf: number;
  ga: number;
  /** Stable random key to break exact ties. */
  rand: number;
}

const byRank = (a: Standing, b: Standing): number =>
  b.pts - a.pts ||
  b.gf - b.ga - (a.gf - a.ga) ||
  b.gf - a.gf ||
  b.rand - a.rand;

function simulateGroup(group: GroupId): Standing[] {
  const teams = TEAMS.filter((t) => t.group === group);
  const table: Record<string, Standing> = {};
  for (const t of teams) table[t.id] = { team: t, pts: 0, gf: 0, ga: 0, rand: Math.random() };

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const home = teams[i];
      const away = teams[j];
      const [hg, ag] = sampleScore(home, away, true);
      table[home.id].gf += hg;
      table[home.id].ga += ag;
      table[away.id].gf += ag;
      table[away.id].ga += hg;
      if (hg > ag) table[home.id].pts += 3;
      else if (hg < ag) table[away.id].pts += 3;
      else {
        table[home.id].pts += 1;
        table[away.id].pts += 1;
      }
    }
  }

  return Object.values(table).sort(byRank);
}

// ---- knockout bracket -------------------------------------------------------

/** 1-indexed standard single-elimination seeding order for `n` slots. */
function seedOrder(n: number): number[] {
  let seeds = [1, 2];
  while (seeds.length < n) {
    const sum = seeds.length * 2 + 1;
    const next: number[] = [];
    for (const s of seeds) {
      next.push(s);
      next.push(sum - s);
    }
    seeds = next;
  }
  return seeds;
}

function knockoutWinner(a: Team, b: Team): Team {
  const [ag, bg] = sampleScore(a, b, false);
  if (ag > bg) return a;
  if (bg > ag) return b;
  return Math.random() < shootoutWinProb(a, b) ? a : b;
}

// ---- single tournament ------------------------------------------------------

type Round = "R32" | "R16" | "QF" | "SF" | "Final" | "Champion";

interface Tally {
  advanceR32: number;
  reachR16: number;
  reachQF: number;
  reachSF: number;
  reachFinal: number;
  winTitle: number;
}

function emptyTally(): Tally {
  return { advanceR32: 0, reachR16: 0, reachQF: 0, reachSF: 0, reachFinal: 0, winTitle: 0 };
}

function markReached(tallies: Record<string, Tally>, teams: Team[], round: Round): void {
  for (const t of teams) {
    const tly = tallies[t.id];
    switch (round) {
      case "R32": tly.advanceR32++; break;
      case "R16": tly.reachR16++; break;
      case "QF": tly.reachQF++; break;
      case "SF": tly.reachSF++; break;
      case "Final": tly.reachFinal++; break;
      case "Champion": tly.winTitle++; break;
    }
  }
}

function simulateTournament(tallies: Record<string, Tally>): void {
  const winners: Standing[] = [];
  const runnersUp: Standing[] = [];
  const thirds: Standing[] = [];

  for (const g of GROUP_IDS) {
    const table = simulateGroup(g as GroupId);
    winners.push(table[0]);
    runnersUp.push(table[1]);
    thirds.push(table[2]);
  }

  const bestThirds = [...thirds].sort(byRank).slice(0, 8);
  const qualifiers = [...winners, ...runnersUp, ...bestThirds].map((s) => s.team);
  markReached(tallies, qualifiers, "R32");

  // Seed the 32 qualifiers strongest-first into a fixed standard bracket.
  const seeded = [...qualifiers].sort((a, b) => b.elo - a.elo);
  const order = seedOrder(32); // values 1..32
  let bracket: Team[] = order.map((seed) => seeded[seed - 1]);

  const rounds: Round[] = ["R16", "QF", "SF", "Final", "Champion"];
  for (const round of rounds) {
    const next: Team[] = [];
    for (let i = 0; i < bracket.length; i += 2) {
      next.push(knockoutWinner(bracket[i], bracket[i + 1]));
    }
    markReached(tallies, next, round);
    bracket = next;
  }
}

// ---- public API -------------------------------------------------------------

export function runForecast(iterations = 10000): TeamForecast[] {
  const tallies: Record<string, Tally> = {};
  for (const t of TEAMS) tallies[t.id] = emptyTally();

  for (let i = 0; i < iterations; i++) simulateTournament(tallies);

  return TEAMS.map((team) => {
    const t = tallies[team.id];
    return {
      team,
      advanceR32: t.advanceR32 / iterations,
      reachR16: t.reachR16 / iterations,
      reachQF: t.reachQF / iterations,
      reachSF: t.reachSF / iterations,
      reachFinal: t.reachFinal / iterations,
      winTitle: t.winTitle / iterations,
    };
  }).sort((a, b) => b.winTitle - a.winTitle || b.reachFinal - a.reachFinal);
}
