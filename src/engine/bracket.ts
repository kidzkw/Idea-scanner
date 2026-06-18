import type { GroupId, Team } from "../types";
import { MATCHES, type Match } from "../data/matches";
import { TEAMS, getTeam } from "../data/teams";

/** Turn a bracket slot token ("1A", "2B", "W73", "3ABCDF") into readable text. */
export function labelSlot(token: string | null): string {
  if (!token) return "TBD";
  let m = /^1([A-L])$/.exec(token);
  if (m) return `Winner Group ${m[1]}`;
  m = /^2([A-L])$/.exec(token);
  if (m) return `Runner-up Group ${m[1]}`;
  m = /^3([A-L]+)$/.exec(token);
  if (m) return `3rd place (${m[1].split("").join("/")})`;
  m = /^W(\d+)$/.exec(token);
  if (m) return `Winner of M${m[1]}`;
  m = /^RU(\d+)$/.exec(token);
  if (m) return `Runner-up of M${m[1]}`;
  return token;
}

// ---- live group standings (deterministic, from finished results) ------------

export interface LiveRow {
  team: Team;
  played: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  pts: number;
}

export function liveStandings(group: GroupId): LiveRow[] {
  const rows: Record<string, LiveRow> = {};
  for (const t of TEAMS.filter((t) => t.group === group)) {
    rows[t.id] = { team: t, played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
  }
  for (const m of MATCHES.filter(
    (m) => m.stage === "group" && m.group === group && m.status === "finished",
  )) {
    const h = rows[m.home.code!];
    const a = rows[m.away.code!];
    const hs = m.home.score!;
    const as = m.away.score!;
    h.played++; a.played++;
    h.gf += hs; h.ga += as; a.gf += as; a.ga += hs;
    if (hs > as) { h.w++; a.l++; h.pts += 3; }
    else if (hs < as) { a.w++; h.l++; a.pts += 3; }
    else { h.d++; a.d++; h.pts++; a.pts++; }
  }
  // Provisional order by points, goal difference, goals for, then rating.
  return Object.values(rows).sort(
    (x, y) =>
      y.pts - x.pts ||
      y.gf - y.ga - (x.gf - x.ga) ||
      y.gf - x.gf ||
      y.team.elo - x.team.elo,
  );
}

// ---- knockout path tracing --------------------------------------------------

const KO = MATCHES.filter((m) => m.stage !== "group");
const matchByN = new Map<number, Match>(KO.map((m) => [m.n, m]));

/** The knockout match that consumes a given producer token (e.g. "W73"). */
function consumerOf(token: string): Match | undefined {
  return KO.find((m) => m.phA === token || m.phB === token);
}

export interface PathInfo {
  /** R32 match number this group position plays in. */
  r32Match: number;
  /** Opponent description in the R32 (round of 32). */
  r32Opponent: string;
  /** Opponent description in a potential R16 tie. */
  r16Opponent: string;
  /** "top" or "bottom" half of the draw (different semi-final). */
  half: "top" | "bottom";
}

/** Trace where a group's winner (pos 1) or runner-up (pos 2) lands. */
export function pathFor(group: GroupId, pos: 1 | 2): PathInfo | null {
  const myToken = `${pos}${group}`;
  const r32 = KO.find(
    (m) => m.stage === "r32" && (m.phA === myToken || m.phB === myToken),
  );
  if (!r32) return null;

  const oppToken = r32.phA === myToken ? r32.phB : r32.phA;
  const r32Opponent = labelSlot(oppToken);

  // R16 opponent: the other R32 winner feeding our R16 tie.
  let r16Opponent = "TBD";
  const r16 = consumerOf(`W${r32.n}`);
  if (r16) {
    const otherW = r16.phA === `W${r32.n}` ? r16.phB : r16.phA;
    const srcN = otherW && /^W(\d+)$/.exec(otherW)?.[1];
    const src = srcN ? matchByN.get(Number(srcN)) : undefined;
    r16Opponent = src
      ? `${labelSlot(src.phA)} / ${labelSlot(src.phB)}`
      : labelSlot(otherW);
  }

  // Half of the draw: follow winners up to the semi-final (M101 = top, M102 = bottom).
  let cursor: Match | undefined = r32;
  let guard = 0;
  while (cursor && cursor.stage !== "sf" && guard++ < 10) {
    cursor = consumerOf(`W${cursor.n}`);
  }
  const half: "top" | "bottom" = cursor && cursor.n === 101 ? "top" : "bottom";

  return { r32Match: r32.n, r32Opponent, r16Opponent, half };
}

/** Convenience: resolve a finished knockout team token to a real team, if any. */
export function maybeTeam(code: string | null): Team | null {
  return code ? getTeam(code) : null;
}
