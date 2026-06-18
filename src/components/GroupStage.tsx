import { GROUP_IDS, teamsByGroup } from "../data/teams";

/** Static view of the 12 groups, sorted within each group by Elo. */
export function GroupStage() {
  return (
    <section>
      <h2>Group Stage</h2>
      <p className="muted">
        Official 2026 final-draw groups. Teams are listed by current Elo rating
        — the model's estimate of strength, not the official seeding.
      </p>
      <div className="group-grid">
        {GROUP_IDS.map((g) => {
          const teams = [...teamsByGroup(g)].sort((a, b) => b.elo - a.elo);
          return (
            <div key={g} className="card group-card">
              <h3>Group {g}</h3>
              <table>
                <tbody>
                  {teams.map((t) => (
                    <tr key={t.id}>
                      <td className="flag">{t.flag}</td>
                      <td className="tname">{t.name}</td>
                      <td className="elo">{t.elo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </section>
  );
}
