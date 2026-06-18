import { useEffect, useState } from "react";
import { GroupStage } from "./components/GroupStage";
import { MatchPredictor } from "./components/MatchPredictor";
import { Forecast } from "./components/Forecast";
import { Schedule } from "./components/Schedule";
import { Strategy } from "./components/Strategy";

type Tab = "forecast" | "strategy" | "schedule" | "groups" | "match";

const TABS: { id: Tab; label: string }[] = [
  { id: "forecast", label: "Title Forecast" },
  { id: "strategy", label: "Group Strategy" },
  { id: "schedule", label: "Schedule" },
  { id: "groups", label: "Groups" },
  { id: "match", label: "Match Predictor" },
];

function currentTab(): Tab {
  const h = window.location.hash.replace("#/", "");
  return (TABS.find((t) => t.id === h)?.id ?? "forecast") as Tab;
}

export function App() {
  const [tab, setTab] = useState<Tab>(currentTab());

  useEffect(() => {
    const onHash = () => setTab(currentTab());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <div className="app">
      <header className="masthead">
        <div className="wrap">
          <h1>
            <span className="mark">⚽</span> World Cup 2026 Predictor
          </h1>
          <p className="tagline">
            Elo + Poisson match probabilities and a Monte Carlo tournament
            forecast for the 48-team field. Open source, no tracking.
          </p>
          <nav className="tabs">
            {TABS.map((t) => (
              <a
                key={t.id}
                href={`#/${t.id}`}
                className={t.id === tab ? "tab active" : "tab"}
              >
                {t.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="wrap">
        {tab === "forecast" && <Forecast />}
        {tab === "strategy" && <Strategy />}
        {tab === "schedule" && <Schedule />}
        {tab === "groups" && <GroupStage />}
        {tab === "match" && <MatchPredictor />}
      </main>

      <footer className="wrap foot">
        <p>
          Predictions are model estimates, not betting advice. Group draw is the
          official 2026 final draw; Elo ratings are approximate and editable in{" "}
          <code>src/data/teams.ts</code>.
        </p>
      </footer>
    </div>
  );
}
