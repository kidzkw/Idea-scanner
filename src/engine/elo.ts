import type { MatchProbabilities, Team } from "../types";

/**
 * Match model: Elo rating gap -> expected goal supremacy -> two independent
 * Poisson scorelines -> W/D/L probabilities.
 *
 * This is the classic "Elo feeds a Poisson" approach used by many public
 * football models. It is deliberately simple and fully transparent: every
 * constant below is a tunable knob, not a fitted black box.
 */

/** Average goals scored by one side in a men's international. */
const BASE_GOALS = 1.35;
/** Elo points that correspond to roughly one extra goal of supremacy. */
const ELO_PER_GOAL = 145;
/** Support bump (in Elo points) for a co-host playing at home. */
export const HOST_BONUS = 45;
/** Largest goal grid we sum over when building the scoreline matrix. */
const MAX_GOALS = 8;

function poissonPmf(k: number, lambda: number): number {
  // exp(-lambda) * lambda^k / k!
  let factorial = 1;
  for (let i = 2; i <= k; i++) factorial *= i;
  return (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial;
}

export interface MatchContext {
  /** Apply host support to whichever side (if any) is a co-host. */
  applyHostBonus?: boolean;
}

/** Effective rating including a host bump where applicable. */
function effectiveElo(team: Team, ctx?: MatchContext): number {
  if (ctx?.applyHostBonus && team.host) return team.elo + HOST_BONUS;
  return team.elo;
}

/**
 * Expected goals for each side from the rating gap. Exported so the Monte
 * Carlo engine can sample scorelines directly without re-deriving them.
 */
export function expectedGoals(
  home: Team,
  away: Team,
  ctx?: MatchContext,
): { xgHome: number; xgAway: number } {
  const diff = effectiveElo(home, ctx) - effectiveElo(away, ctx);
  const supremacy = diff / ELO_PER_GOAL;
  const xgHome = Math.max(0.15, BASE_GOALS + supremacy / 2);
  const xgAway = Math.max(0.15, BASE_GOALS - supremacy / 2);
  return { xgHome, xgAway };
}

/**
 * Full W/D/L + expected-goals + most-likely-score for a single match.
 */
export function matchProbabilities(
  home: Team,
  away: Team,
  ctx?: MatchContext,
): MatchProbabilities {
  const { xgHome, xgAway } = expectedGoals(home, away, ctx);

  const homeP = Array.from({ length: MAX_GOALS + 1 }, (_, k) => poissonPmf(k, xgHome));
  const awayP = Array.from({ length: MAX_GOALS + 1 }, (_, k) => poissonPmf(k, xgAway));

  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;
  let bestScore = "0-0";
  let bestProb = -1;

  for (let h = 0; h <= MAX_GOALS; h++) {
    for (let a = 0; a <= MAX_GOALS; a++) {
      const p = homeP[h] * awayP[a];
      if (h > a) homeWin += p;
      else if (h === a) draw += p;
      else awayWin += p;
      if (p > bestProb) {
        bestProb = p;
        bestScore = `${h}-${a}`;
      }
    }
  }

  // Re-normalise to absorb the tiny tail beyond MAX_GOALS.
  const total = homeWin + draw + awayWin;
  return {
    homeWin: homeWin / total,
    draw: draw / total,
    awayWin: awayWin / total,
    xgHome,
    xgAway,
    likelyScore: bestScore,
  };
}

/** Win expectancy ignoring draws — used to settle knockout penalty shootouts. */
export function shootoutWinProb(home: Team, away: Team): number {
  const diff = effectiveElo(home) - effectiveElo(away);
  // Slightly compressed: shootouts are closer to a coin flip than open play.
  return 1 / (1 + Math.pow(10, -diff / 1000));
}
