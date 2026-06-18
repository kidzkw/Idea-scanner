import type { GroupId, Team, TeamForecast } from "../types";
import { GROUP_IDS, TEAMS, getTeam } from "../data/teams";
import { MATCHES, type Match } from "../data/matches";
import { expectedGoals, shootoutWinProb } from "./elo";

/**
 * Live-conditioned Monte Carlo engine for the 48-team 2026 format.
 *
 * Finished group matches contribute their real scores; only remaining fixtures
 * are sampled. The knockout stage follows the actual FIFA bracket encoded in
 * the schedule (slot tokens like "1A", "2B", "3ABCDF", "W73"), with the eight
 * best-third slots resolved by constraint matching over each slot's eligible
 * groups. Output reflects each team's chances as of right now.
 */

// ---- static schedule prep (computed once) -----------------------------------

const GROUP_FIXTURES: Record<GroupId, Match[]> = Object.fromEntries(
  GROUP_IDS.map((g) => [g, MATCHES.filter((m) => m.stage === "group" && m.group === g)]),
) as Record<GroupId, Match[]>;

const GROUP_TEAMS: Record<GroupId, Team[]> = Object.fromEntries(
  GROUP_IDS.map((g) => [g, TEAMS.filter((t) => t.group === g)]),
) as Record<GroupId, Team[]>;

const KO_MATCHES = MATCHES.filter((m) => m.stage !== "group").sort((a, b) => a.n - b.n);

const THIRD_SLOT_TOKENS = [
  ...new Set(
    KO_MATCHES.flatMap((m) => [m.phA, m.phB]).filter(
      (t): t is string => !!t && /^3[A-L]+$/.test(t),
    ),
  ),
].sort((a, b) => a.length - b.length);

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

export interface Standing {
  team: Team;
  pts: number;
  gf: number;
  ga: number;
  rand: number;
}

export const byRank = (a: Standing, b: Standing): number =>
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

// ---- knockout bracket -------------------------------------------------------

function assignThirds(thirds: Standing[]): Record<string, Team> {
  const result: Record<string, Team> = {};
  const used = new Array(thirds.length).fill(false);

  const place = (i: number): boolean => {
    if (i === THIRD_SLOT_TOKENS.length) return true;
    const allowed = new Set(THIRD_SLOT_TOKENS[i].slice(1).split(""));
    for (let j = 0; j < thirds.length; j++) {
      if (!used[j] && allowed.has(thirds[j].team.group)) {
        used[j] = true;
        result[THIRD_SLOT_TOKENS[i]] = thirds[j].team;
        if (place(i + 1)) return true;
        used[j] = false;
      }
    }
    return false;
  };

  if (!place(0)) {
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

// ---- one tournament ---------------------------------------------------------

export interface SimResult {
  /** Final group tables (index 0 = winner, 1 = runner-up, 2 = third). */
  groups: Record<GroupId, Standing[]>;
  /** Team ids participating in each knockout round. */
  reached: Record<string, Set<string>>;
  championId: string;
}

const KO_STAGES = ["r32", "r16", "qf", "sf", "final"] as const;

export function simulateOnce(): SimResult {
  const groups = {} as Record<GroupId, Standing[]>;
  const winners: Record<string, Team> = {};
  const runnersUp: Record<string, Team> = {};
  const thirds: Standing[] = [];

  for (const g of GROUP_IDS) {
    const table = simulateGroup(g);
    groups[g] = table;
    winners[g] = table[0].team;
    runnersUp[g] = table[1].team;
    thirds.push(table[2]);
  }

  const bestThirds = [...thirds].sort(byRank).slice(0, 8);
  const thirdSlots = assignThirds(bestThirds);

  const reached: Record<string, Set<string>> = {};
  for (const s of KO_STAGES) reached[s] = new Set();

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

  let championId = "";
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

    if (ko.stage === "third") continue;
    reached[ko.stage].add(a.id);
    reached[ko.stage].add(b.id);
    if (ko.stage === "final") championId = winner.id;
  }

  return { groups, reached, championId };
}

// ---- public API -------------------------------------------------------------

export function runForecast(iterations = 10000): TeamForecast[] {
  const acc: Record<string, { r32: number; r16: number; qf: number; sf: number; final: number; title: number }> = {};
  for (const t of TEAMS) acc[t.id] = { r32: 0, r16: 0, qf: 0, sf: 0, final: 0, title: 0 };

  for (let i = 0; i < iterations; i++) {
    const r = simulateOnce();
    for (const id of r.reached.r32) acc[id].r32++;
    for (const id of r.reached.r16) acc[id].r16++;
    for (const id of r.reached.qf) acc[id].qf++;
    for (const id of r.reached.sf) acc[id].sf++;
    for (const id of r.reached.final) acc[id].final++;
    acc[r.championId].title++;
  }

  return TEAMS.map((team) => {
    const a = acc[team.id];
    return {
      team,
      advanceR32: a.r32 / iterations,
      reachR16: a.r16 / iterations,
      reachQF: a.qf / iterations,
      reachSF: a.sf / iterations,
      reachFinal: a.final / iterations,
      winTitle: a.title / iterations,
    };
  }).sort((a, b) => b.winTitle - a.winTitle || b.reachFinal - a.reachFinal);
}
