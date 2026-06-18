import { useMemo, useState } from "react";
import { MATCHES, SCHEDULE_UPDATED_AT, type Match, type Stage } from "../data/matches";
import { TEAMS } from "../data/teams";
import { labelSlot } from "../engine/bracket";

const TEAM_BY_ID = new Map(TEAMS.map((t) => [t.id, t]));

const STAGE_LABEL: Record<Stage, string> = {
  group: "Group stage",
  r32: "Round of 32",
  r16: "Round of 16",
  qf: "Quarter-final",
  sf: "Semi-final",
  third: "Third place",
  final: "Final",
};

function sideName(code: string | null, slot: string | null): string {
  if (code) return TEAM_BY_ID.get(code)?.name ?? code;
  return labelSlot(slot);
}

function sideFlag(code: string | null): string {
  return (code && TEAM_BY_ID.get(code)?.flag) || "·";
}

const dayKey = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const kickoff = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

type Filter = "all" | "upcoming" | "results";

export function Schedule() {
  const [filter, setFilter] = useState<Filter>("all");
  const [group, setGroup] = useState<string>("all");

  const visible = useMemo(() => {
    return MATCHES.filter((m) => {
      if (filter === "results" && m.status !== "finished") return false;
      if (filter === "upcoming" && m.status === "finished") return false;
      if (group !== "all") {
        if (group === "ko") return m.stage !== "group";
        return m.group === group;
      }
      return true;
    });
  }, [filter, group]);

  // Bucket consecutive matches by local calendar day, preserving match order.
  const days = useMemo(() => {
    const out: { key: string; matches: Match[] }[] = [];
    for (const m of visible) {
      const key = dayKey(m.date);
      const last = out[out.length - 1];
      if (last && last.key === key) last.matches.push(m);
      else out.push({ key, matches: [m] });
    }
    return out;
  }, [visible]);

  const played = MATCHES.filter((m) => m.status === "finished").length;

  return (
    <section>
      <h2>Schedule &amp; Results</h2>
      <p className="muted">
        All 104 matches. {played} played, {MATCHES.length - played} to go. Times
        shown in your local timezone. Knockout teams resolve as earlier rounds
        finish.
      </p>

      <div className="controls">
        <label className="team-select">
          <span>Show</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
            <option value="all">All matches</option>
            <option value="upcoming">Upcoming only</option>
            <option value="results">Results only</option>
          </select>
        </label>
        <label className="team-select">
          <span>Stage / Group</span>
          <select value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="all">Everything</option>
            <option value="ko">Knockouts only</option>
            {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].map((g) => (
              <option key={g} value={g}>
                Group {g}
              </option>
            ))}
          </select>
        </label>
      </div>

      {days.length === 0 && <p className="muted">No matches match this filter.</p>}

      {days.map((d) => (
        <div key={d.key + d.matches[0].n} className="day">
          <h3 className="dayhead">{d.key}</h3>
          <div className="card matchlist">
            {d.matches.map((m) => (
              <MatchRow key={m.n} m={m} />
            ))}
          </div>
        </div>
      ))}

      <p className="muted updated">
        Data snapshot: {new Date(SCHEDULE_UPDATED_AT).toLocaleString()}.
      </p>
    </section>
  );
}

function MatchRow({ m }: { m: Match }) {
  const finished = m.status === "finished";
  const homeWon = m.winner && m.winner === m.home.code;
  const awayWon = m.winner && m.winner === m.away.code;

  return (
    <div className="match">
      <div className="mtime">
        <span className="num">M{m.n}</span>
        <span>{finished ? "FT" : kickoff(m.date)}</span>
        <span className="stage">
          {m.stage === "group" ? `Grp ${m.group}` : STAGE_LABEL[m.stage]}
        </span>
      </div>

      <div className={`side${homeWon ? " won" : ""}`}>
        <span className="flag">{sideFlag(m.home.code)}</span>
        <span className="nm">{sideName(m.home.code, m.phA)}</span>
      </div>

      <div className="score">
        {finished ? (
          <>
            <b>{m.home.score}</b>
            <span>-</span>
            <b>{m.away.score}</b>
            {m.home.pen != null && m.away.pen != null && (
              <span className="pens">({m.home.pen}-{m.away.pen} pens)</span>
            )}
          </>
        ) : (
          <span className="v">v</span>
        )}
      </div>

      <div className={`side right${awayWon ? " won" : ""}`}>
        <span className="nm">{sideName(m.away.code, m.phB)}</span>
        <span className="flag">{sideFlag(m.away.code)}</span>
      </div>

      <div className="venue">{m.venue}</div>
    </div>
  );
}
