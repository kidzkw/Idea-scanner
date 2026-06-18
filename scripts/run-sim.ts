/**
 * Headless Monte Carlo run for sanity-checking the model without a browser.
 *   npm run sim            # 20000 iterations
 *   npm run sim -- 50000   # custom iteration count
 */
import { runForecast } from "../src/engine/simulate";

const iterations = Number(process.argv[2]) || 20000;
console.log(`Simulating ${iterations.toLocaleString()} tournaments…\n`);

const rows = runForecast(iterations);
const pct = (x: number) => `${(x * 100).toFixed(1)}%`.padStart(6);

console.log("Rank  Team                     Win    Final  Semis   R16");
console.log("-".repeat(60));
rows.slice(0, 16).forEach((r, i) => {
  const rank = String(i + 1).padStart(2);
  const name = `${r.team.name}`.padEnd(22);
  console.log(
    `${rank}.   ${name} ${pct(r.winTitle)} ${pct(r.reachFinal)} ${pct(r.reachSF)} ${pct(r.reachR16)}`,
  );
});
