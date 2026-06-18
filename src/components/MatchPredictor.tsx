import { useMemo, useState } from "react";
import { TEAMS, getTeam } from "../data/teams";
import { matchProbabilities } from "../engine/elo";

const SORTED = [...TEAMS].sort((a, b) => a.name.localeCompare(b.name));
const pct = (x: number) => `${(x * 100).toFixed(1)}%`;

export function MatchPredictor() {
  const [homeId, setHomeId] = useState("ARG");
  const [awayId, setAwayId] = useState("FRA");

  const home = getTeam(homeId);
  const away = getTeam(awayId);
  const probs = useMemo(
    () => matchProbabilities(home, away, { applyHostBonus: true }),
    [home, away],
  );

  return (
    <section>
      <h2>Match Predictor</h2>
      <p className="muted">
        Single-match win / draw / loss from the Elo gap, with a co-host support
        bump applied if either side is hosting.
      </p>

      <div className="picker">
        <TeamSelect label="Team A" value={homeId} onChange={setHomeId} />
        <span className="vs">vs</span>
        <TeamSelect label="Team B" value={awayId} onChange={setAwayId} />
      </div>

      <div className="card result">
        <div className="bar">
          <div className="seg win" style={{ width: pct(probs.homeWin) }} title="Team A win" />
          <div className="seg draw" style={{ width: pct(probs.draw) }} title="Draw" />
          <div className="seg loss" style={{ width: pct(probs.awayWin) }} title="Team B win" />
        </div>
        <div className="legend">
          <span><b>{home.flag} {home.name}</b> {pct(probs.homeWin)}</span>
          <span>Draw {pct(probs.draw)}</span>
          <span><b>{away.flag} {away.name}</b> {pct(probs.awayWin)}</span>
        </div>
        <div className="xg">
          Expected goals: {home.name} {probs.xgHome.toFixed(2)} – {probs.xgAway.toFixed(2)}{" "}
          {away.name} · Most likely score <b>{probs.likelyScore}</b>
        </div>
      </div>
    </section>
  );
}

function TeamSelect(props: {
  label: string;
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <label className="team-select">
      <span>{props.label}</span>
      <select value={props.value} onChange={(e) => props.onChange(e.target.value)}>
        {SORTED.map((t) => (
          <option key={t.id} value={t.id}>
            {t.flag} {t.name}
          </option>
        ))}
      </select>
    </label>
  );
}
