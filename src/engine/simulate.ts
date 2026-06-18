import type { GroupId, Team, TeamForecast } from "../types";
import { GROUP_IDS, TEAMS, getTeam } from "../data/teams";
import { MATCHES, type Match } from "../data/matches";
import { expectedGoals, shootoutWinProb } from "./elo";

/**
 * Live-conditioned Monte Carlo forecast for the 48-team 2026 format.
 *
 * Unlike a from-scratch forecast, this engine respects results that have
 * already happened: finished group matches contribute their real scores and
 * only the remaining fixtures are sampled, and the knockout stage follows the
 * actual FIFA bracket encoded in the schedule (slot tokens like "1A", "2B",
 * "3ABCDF", "W73") rather than a synthetic seeding. The output is therefore
 * each team's chances *as of right now*.
 *
 * Best-third allocation simplification: the eight "3XXXXX" R32 slots are filled
 * by constraint matching (each slot lists the groups it may take a third from),
 * which reproduces FIFA's official allocation table in the normal case without
 * hard-coding all 495 combinations.
 */

// ---- static schedule prep (computed once) -----------------------------------

const GROUP_FIXTURES: Record<GroupId, Match[]> = Object.fromEntries(
  GROUP_IDS.map((g) => [g, MATCHES.filter((m) => m.stage === "group" && m.group === g)]),
) as Record<GroupId, Match[]>;

const GROUP_TEAMS: Record<GroupId, Team[]> = Object.fromEntries(
  GROUP_IDS.map((g) => [g, TEAMS.filter((t) => t.group === g)]),
) as Record<GroupId, Team[]>;

// Knockout matches in playing order (73..104).
const KO_MATCHES = MATCHES.filter((m) => m.stage !== "group").sort((a, b) => a.n - b.n);

// The eight R32 slots that take a best-third-placed team.
const THIRD_SLOT_TOKENS = [
  ...new Set(
    KO_MATCHES.flatMap((m) => [m.phA, m.phB]).filter(
      (t): t is string => !!t && /^3[A-L]+$/.test(t),
    ),
  ),
].sort((a, b) => a.length - b.length); // most-constrained-ish first

// ---- random helpers ---------------------------------------------------------

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

// ---- group stage (conditioned on real results) ------------------------------

interface Standing {
  team: Team;
  pts: number;
  gf: number;
  ga: number;
  rand: number;
}

const byRank = (a: Standing, b: Standing): number =>
  b.pts - a.pts ||
  b.gf - b.ga - (a.gf - a.ga) ||
  b.gf - a.gf ||
  b.rand - a.rand;

function simulateGroup(group: GroupId): Standing[] {
  const table: Record<string, Standing> = {};
  for (const t of GROUP_TEAMS[group]) {
    table[t.id] = { team: t, pts: 0, gf: 0, ga: 0, rand: Math.random() };
  }

  for (const f of GROUP_FIXTURES[group]) {
    const home = getTeam(f.home.code!);
    const away = getTeam(f.away.code!);
    let hg: number;
    let ag: number;
    if (f.status === "finished" && f.home.score != null && f.away.score != null) {
      hg = f.home.score;
      ag = f.away.score;
    } else {
      [hg, ag] = sampleScore(home, away, true);
    }
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

  return Object.values(table).sort(byRank);
}

// ---- knockout bracket (real slots) ------------------------------------------

/** Assign the 8 qualified thirds to the 8 "3XXXXX" slots respecting groups. */
function assignThirds(thirds: Standing[]): Record<string, Team> {
  const result: Record<string, Team> = {};
  const used = new Array(thirds.length).fill(false);

  const place = (i: number): boolean => {
    if (i === THIRD_SLOT_TOKENS.length) return true;
    const token = THIRD_SLOT_TOKENS[i];
    const allowed = new Set(token.slice(1).split(""));
    for (let j = 0; j < thirds.length; j++) {
      if (!used[j] && allowed.has(thirds[j].team.group)) {
        used[j] = true;
        result[token] = thirds[j].team;
        if (place(i + 1)) return true;
        used[j] = false;
      }
    }
    return false;
  };

  if (!place(0)) {
    // Fallback: should not happen with a valid FIFA slot design.
    THIRD_SLOT_TOKENS.forEach((token, i) => {
      if (!result[token]) result[token] = thirds[i].team;
    });
  }
  return result;
}

function knockoutWinner(a: Team, b: Team): Team {
  const [ag, bg] = sampleScore(a, b, false);
  if (ag > bg) return a;
  if (bg > ag) return b;
  return Math.random() < shootoutWinProb(a, b) ? a : b;
}

// ---- tallies ----------------------------------------------------------------

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

const STAGE_KEY: Record<string, keyof Tally | undefined> = {
  r32: "advanceR32",
  r16: "reachR16",
  qf: "reachQF",
  sf: "reachSF",
  final: "reachFinal",
};

// ---- one tournament ---------------------------------------------------------

function simulateTournament(tallies: Record<string, Tally>): void {
  const winners: Record<string, Team> = {};
  const runnersUp: Record<string, Team> = {};
  const thirdsByGroup: Standing[] = [];

  for (const g of GROUP_IDS) {
    const table = simulateGroup(g);
    winners[g] = table[0].team;
    runnersUp[g] = table[1].team;
    thirdsByGroup.push(table[2]);
  }

  const bestThirds = [...thirdsByGroup].sort(byRank).slice(0, 8);
  const thirdSlots = assignThirds(bestThirds);

  const winnerOf: Record<number, Team> = {};
  const loserOf: Record<number, Team> = {};

  const resolve = (token: string | null): Team => {
    if (!token) throw new Error("missing slot token");
    let m = /^1([A-L])$/.exec(token);
    if (m) return winners[m[1]];
    m = /^2([A-L])$/.exec(token);
    if (m) return runnersUp[m[1]];
    if (/^3[A-L]+$/.test(token)) return thirdSlots[token];
    m = /^W(\d+)$/.exec(token);
    if (m) return winnerOf[Number(m[1])];
    m = /^RU(\d+)$/.exec(token);
    if (m) return loserOf[Number(m[1])];
    throw new Error(`unrecognised slot token: ${token}`);
  };

  for (const ko of KO_MATCHES) {
    let a: Team;
    let b: Team;
    let winner: Team;

    if (ko.status === "finished" && ko.home.code && ko.away.code && ko.winner) {
      a = getTeam(ko.home.code);
      b = getTeam(ko.away.code);
      winner = getTeam(ko.winner);
    } else {
      a = resolve(ko.phA);
      b = resolve(ko.phB);
      winner = knockoutWinner(a, b);
    }
    winnerOf[ko.n] = winner;
    loserOf[ko.n] = winner.id === a.id ? b : a;

    // The third-place match doesn't feed the title progression.
    if (ko.stage === "third") continue;

    const key = STAGE_KEY[ko.stage];
    if (key) {
      tallies[a.id][key]++;
      tallies[b.id][key]++;
    }
    if (ko.stage === "final") tallies[winner.id].winTitle++;
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
