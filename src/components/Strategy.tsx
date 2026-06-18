import { useEffect, useMemo, useState } from "react";
import { TEAMS, getTeam } from "../data/teams";
import { MATCHES } from "../data/matches";
import { matchProbabilities } from "../engine/elo";
import { liveStandings, pathFor, type PathInfo } from "../engine/bracket";
import { analyzeGroups, type TeamAnalysis, type FinishOutcome } from "../engine/analyze";

const ITERATIONS = 5000;
const SORTED = [...TEAMS].sort((a, b) => a.name.localeCompare(b.name));
const pct = (x: number) => `${(x * 100).toFixed(1)}%`;
const pct0 = (x: number) => `${Math.round(x * 100)}%`;

export function Strategy() {
  const [teamId, setTeamId] = useState("ENG");
  const [analysis, setAnalysis] = useState<Record<string, TeamAnalysis> | null>(null);

  useEffect(() => {
    setAnalysis(null);
    const id = setTimeout(() => setAnalysis(analyzeGroups(ITERATIONS)), 30);
    return () => clearTimeout(id);
  }, []);

  const team = getTeam(teamId);
  const standings = useMemo(() => liveStandings(team.group), [team.group]);
  const remaining = useMemo(
    () =>
      MATCHES.filter(
        (m) => m.stage === "group" && m.group === team.group && m.status !== "finished",
      ),
    [team.group],
  );
  const first = pathFor(team.group, 1);
  const second = pathFor(team.group, 2);
  const a = analysis?.[teamId];

  return (
    <section>
      <h2>Group Strategy &amp; Path</h2>
      <p className="muted">
        For any team: where it stands now, its remaining group games, and what
        finishing 1st vs 2nd means for the knockout draw — including how much
        each path changes its odds of going deep. Conditioned on results to date.
      </p>

      <label className="team-select solo">
        <span>Team</span>
        <select value={teamId} onChange={(e) => setTeamId(e.target.value)}>
          {SORTED.map((t) => (
            <option key={t.id} value={t.id}>
              {t.flag} {t.name} (Grp {t.group})
            </option>
          ))}
        </select>
      </label>

      <div className="card">
        <h3 className="cardh">Group {team.group} — standings</h3>
        <table className="standings">
          <thead>
            <tr>
              <th className="left">#</th>
              <th className="left">Team</th>
              <th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((r, i) => (
              <tr key={r.team.id} className={r.team.id === teamId ? "me" : ""}>
                <td className="left muted">{i + 1}</td>
                <td className="left">{r.team.flag} {r.team.name}</td>
                <td>{r.played}</td><td>{r.w}</td><td>{r.d}</td><td>{r.l}</td>
                <td>{r.gf}</td><td>{r.ga}</td>
                <td>{r.gf - r.ga >= 0 ? "+" : ""}{r.gf - r.ga}</td>
                <td className="strong">{r.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 className="cardh">Remaining group games</h3>
        {remaining.length === 0 && <p className="muted">Group complete.</p>}
        {remaining.map((m) => {
          const h = getTeam(m.home.code!);
          const aw = getTeam(m.away.code!);
          const p = matchProbabilities(h, aw, { applyHostBonus: true });
          const mine = m.home.code === teamId || m.away.code === teamId;
          return (
            <div key={m.n} className={`predrow${mine ? " mine" : ""}`}>
              <div className="teams">
                <span>{h.flag} {h.name}</span>
                <span className="muted small">v</span>
                <span>{aw.name} {aw.flag}</span>
              </div>
              <div className="bar small">
                <div className="seg win" style={{ width: pct(p.homeWin) }} />
                <div className="seg draw" style={{ width: pct(p.draw) }} />
                <div className="seg loss" style={{ width: pct(p.awayWin) }} />
              </div>
              <div className="odds muted small">
                {pct0(p.homeWin)} / {pct0(p.draw)} / {pct0(p.awayWin)} · likely {p.likelyScore}
              </div>
            </div>
          );
        })}
      </div>

      {!a ? (
        <p className="muted">Simulating {ITERATIONS.toLocaleString()} tournaments…</p>
      ) : (
        <>
          <div className="card">
            <h3 className="cardh">Projected finish</h3>
            <div className="finishbar">
              <div className="seg first" style={{ width: pct(a.pWin) }} title="Win group" />
              <div className="seg second" style={{ width: pct(a.pSecond) }} title="Runner-up" />
              <div className="seg third" style={{ width: pct(a.pThird) }} title="Advance as 3rd" />
            </div>
            <div className="legend">
              <span><b>Win group</b> {pct(a.pWin)}</span>
              <span>Runner-up {pct(a.pSecond)}</span>
              <span>3rd &amp; advance {pct(a.pThird)}</span>
              <span className="strong">Advance {pct(a.pAdvance)}</span>
            </div>
          </div>

          <div className="paths">
            <PathCard
              title="If they finish 1st"
              prob={a.pWin}
              path={first}
              outcome={a.asFirst}
            />
            <PathCard
              title="If they finish 2nd"
              prob={a.pSecond}
              path={second}
              outcome={a.asSecond}
            />
          </div>
          <p className="muted small">
            "Reach QF/SF" are conditional: the chance of getting that far{" "}
            <i>given</i> the team finishes in that position. Knockout opponents
            follow the real 2026 bracket; 3rd-place slots show their eligible
            groups until the eight qualifiers are known.
          </p>
        </>
      )}
    </section>
  );
}

function PathCard(props: {
  title: string;
  prob: number;
  path: PathInfo | null;
  outcome: FinishOutcome;
}) {
  const { title, prob, path, outcome } = props;
  return (
    <div className="card pathcard">
      <h3 className="cardh">
        {title} <span className="muted">({pct(prob)})</span>
      </h3>
      {path ? (
        <>
          <div className="prow">
            <span className="plabel">Round of 32</span>
            <span>{path.r32Opponent}</span>
          </div>
          <div className="prow">
            <span className="plabel">Round of 16</span>
            <span>{path.r16Opponent}</span>
          </div>
          <div className="prow">
            <span className="plabel">Draw half</span>
            <span className="cap">{path.half}</span>
          </div>
          <div className="prow split">
            <span><b>{pct0(outcome.reachQF)}</b> reach QF</span>
            <span><b>{pct0(outcome.reachSF)}</b> reach SF</span>
          </div>
        </>
      ) : (
        <p className="muted">No bracket slot found.</p>
      )}
    </div>
  );
}
