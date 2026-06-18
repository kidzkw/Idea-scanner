export type GroupId =
  | "A" | "B" | "C" | "D" | "E" | "F"
  | "G" | "H" | "I" | "J" | "K" | "L";

export interface Team {
  /** Stable identifier, e.g. "ARG". */
  id: string;
  name: string;
  /** Two-letter group label, A–L. */
  group: GroupId;
  /** World-Football-Elo-style rating. Higher is stronger. Tunable. */
  elo: number;
  /** Co-host nation (USA, Canada, Mexico) — gets a small support boost. */
  host?: boolean;
  /** Emoji flag for display. */
  flag: string;
}

export interface MatchProbabilities {
  /** P(team A wins in 90 minutes). */
  homeWin: number;
  draw: number;
  awayWin: number;
  /** Expected goals. */
  xgHome: number;
  xgAway: number;
  /** Most likely correct score, e.g. "2-1". */
  likelyScore: string;
}

/** Aggregated Monte Carlo output for a single team. */
export interface TeamForecast {
  team: Team;
  /** Probabilities in [0, 1], averaged over all simulated tournaments. */
  advanceR32: number;
  reachR16: number;
  reachQF: number;
  reachSF: number;
  reachFinal: number;
  winTitle: number;
}
