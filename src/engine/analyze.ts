import type { Team } from "../types";
import { GROUP_IDS, TEAMS } from "../data/teams";
import { simulateOnce } from "./simulate";

/** Outcome odds conditional on a given group finish. */
export interface FinishOutcome {
  /** Probability of this finish (share of all simulations). */
  share: number;
  /** P(reach quarter-final | this finish). */
  reachQF: number;
  /** P(reach semi-final | this finish). */
  reachSF: number;
}

export interface TeamAnalysis {
  team: Team;
  pWin: number;   // finish 1st
  pSecond: number; // finish 2nd
  pThird: number;  // advance as a best third
  pAdvance: number;
  /** Conditional outcomes for finishing 1st / 2nd / advancing 3rd. */
  asFirst: FinishOutcome;
  asSecond: FinishOutcome;
  asThird: FinishOutcome;
}

interface Bucket {
  n: number;
  qf: number;
  sf: number;
}
const empty = (): Bucket => ({ n: 0, qf: 0, sf: 0 });

export function analyzeGroups(iterations = 10000): Record<string, TeamAnalysis> {
  const first: Record<string, Bucket> = {};
  const second: Record<string, Bucket> = {};
  const third: Record<string, Bucket> = {};
  for (const t of TEAMS) {
    first[t.id] = empty();
    second[t.id] = empty();
    third[t.id] = empty();
  }

  for (let i = 0; i < iterations; i++) {
    const r = simulateOnce();
    for (const g of GROUP_IDS) {
      const table = r.groups[g];
      table.forEach((s, idx) => {
        const id = s.team.id;
        let bucket: Bucket | null = null;
        if (idx === 0) bucket = first[id];
        else if (idx === 1) bucket = second[id];
        else if (idx === 2 && r.reached.r32.has(id)) bucket = third[id];
        if (!bucket) return;
        bucket.n++;
        if (r.reached.qf.has(id)) bucket.qf++;
        if (r.reached.sf.has(id)) bucket.sf++;
      });
    }
  }

  const outcome = (b: Bucket): FinishOutcome => ({
    share: b.n / iterations,
    reachQF: b.n ? b.qf / b.n : 0,
    reachSF: b.n ? b.sf / b.n : 0,
  });

  const out: Record<string, TeamAnalysis> = {};
  for (const t of TEAMS) {
    const f = first[t.id];
    const s = second[t.id];
    const th = third[t.id];
    out[t.id] = {
      team: t,
      pWin: f.n / iterations,
      pSecond: s.n / iterations,
      pThird: th.n / iterations,
      pAdvance: (f.n + s.n + th.n) / iterations,
      asFirst: outcome(f),
      asSecond: outcome(s),
      asThird: outcome(th),
    };
  }
  return out;
}
