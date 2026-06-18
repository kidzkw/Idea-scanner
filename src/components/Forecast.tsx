import { useEffect, useState } from "react";
import type { TeamForecast } from "../types";
import { runForecast } from "../engine/simulate";

const ITERATIONS = 5000;
const pct = (x: number) => `${(x * 100).toFixed(1)}%`;

export function Forecast() {
  const [rows, setRows] = useState<TeamForecast[] | null>(null);

  useEffect(() => {
    setRows(null);
    // Defer so the "Simulating…" state paints before the loop blocks the thread.
    const id = setTimeout(() => setRows(runForecast(ITERATIONS)), 30);
    return () => clearTimeout(id);
  }, []);

  if (!rows) {
    return (
      <section>
        <h2>Title Forecast</h2>
        <p className="muted">Simulating {ITERATIONS.toLocaleString()} tournaments…</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Title Forecast</h2>
      <p className="muted">
        Share of {ITERATIONS.toLocaleString()} simulated tournaments in which
        each team reaches a given stage. Re-run by refreshing — each load is a
        fresh Monte Carlo draw, so numbers wobble by a few tenths of a percent.
      </p>
      <div className="card">
        <table className="forecast">
          <thead>
            <tr>
              <th className="left">#</th>
              <th className="left">Team</th>
              <th>Win</th>
              <th>Final</th>
              <th>Semis</th>
              <th>Quarters</th>
              <th>R16</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.team.id}>
                <td className="left muted">{i + 1}</td>
                <td className="left">
                  {r.team.flag} {r.team.name}
                </td>
                <td className="strong">{pct(r.winTitle)}</td>
                <td>{pct(r.reachFinal)}</td>
                <td>{pct(r.reachSF)}</td>
                <td>{pct(r.reachQF)}</td>
                <td>{pct(r.reachR16)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
