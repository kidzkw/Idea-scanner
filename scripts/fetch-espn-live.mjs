/**
 * Runs ON a GitHub Actions runner (open internet, unlike this sandbox) to pull
 * live 2026 World Cup data from ESPN's free API and commit it to
 * public/data/live-espn.json, which the workbench reads via git.
 *
 * Loop mode (used by the workflow) polls ESPN every few seconds for ~5 minutes
 * and commits the moment anything outcome-affecting changes, so combined with a
 * */5 cron the feed stays ~15-30s fresh. Change detection ignores the ticking
 * match clock, so a goalless minute does not spam commits — only real changes
 * (score, status, goals, cards, subs) do.
 *
 *   node scripts/fetch-espn-live.mjs                 # single shot
 *   node scripts/fetch-espn-live.mjs --loop=270 --every=15
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const SLUG = "fifa.world";
const BASE = `https://site.api.espn.com/apis/site/v2/sports/soccer/${SLUG}`;
const OUT = "public/data/live-espn.json";
const argn = (k, d) => {
  const a = process.argv.find((x) => x.startsWith(`--${k}=`));
  return a ? Number(a.split("=")[1]) : d;
};
const LOOP = argn("loop", 0);
const EVERY = argn("every", 15);

async function j(url) {
  const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
  return r.json();
}
const ymd = (d) => d.toISOString().slice(0, 10).replace(/-/g, "");

function parseEvent(e) {
  const comp = e.competitions?.[0] || {};
  return {
    id: e.id, date: e.date, shortName: e.shortName || null,
    state: comp.status?.type?.state || e.status?.type?.state || "pre",
    clock: comp.status?.displayClock || null,
    period: comp.status?.period ?? null,
    competitors: (comp.competitors || []).map((c) => ({
      homeAway: c.homeAway, abbr: c.team?.abbreviation || null,
      name: c.team?.displayName || c.team?.shortDisplayName || null,
      score: c.score != null ? Number(c.score) : null,
    })),
  };
}

function parseKeyEvents(summary) {
  const out = [];
  for (const k of summary.keyEvents || summary.commentary || []) {
    const t = (k.type?.text || k.type || "").toString().toLowerCase();
    let type = null;
    if (t.includes("own")) type = "owngoal";
    else if (t.includes("goal")) type = "goal";
    else if (t.includes("penalty")) type = "penalty";
    else if (t.includes("red")) type = "red";
    else if (t.includes("yellow")) type = "yellow";
    else if (t.includes("substitution") || t.includes("sub")) type = "sub";
    if (type) out.push({ type, minute: k.clock?.displayValue || "", team: k.team?.abbreviation || "", text: k.text || k.shortText || t });
  }
  return out;
}

async function collect() {
  const now = new Date();
  const days = [...new Set([ymd(new Date(now - 18 * 3600e3)), ymd(now), ymd(new Date(now.getTime() + 6 * 3600e3))])];
  const byId = new Map();
  for (const d of days) {
    try {
      const board = await j(`${BASE}/scoreboard?dates=${d}`);
      for (const e of board.events || []) byId.set(e.id, parseEvent(e));
    } catch (err) { console.error(`scoreboard ${d}: ${err.message}`); }
  }
  const events = [];
  for (const ev of byId.values()) {
    let keyEvents = [];
    if (ev.state === "in" || ev.state === "post") {
      try { keyEvents = parseKeyEvents(await j(`${BASE}/summary?event=${ev.id}`)); }
      catch (err) { console.error(`summary ${ev.id}: ${err.message}`); }
    }
    events.push({ ...ev, keyEvents });
  }
  return events;
}

/** Signature for change detection — excludes the ticking clock. */
function signature(events) {
  return JSON.stringify(events.map((e) => ({
    id: e.id, state: e.state,
    score: e.competitors.map((c) => c.score),
    ke: e.keyEvents.map((k) => `${k.type}|${k.minute}|${k.team}`),
  })));
}

function currentSignature() {
  if (!existsSync(OUT)) return null;
  try { return signature(JSON.parse(readFileSync(OUT, "utf8")).events || []); } catch { return null; }
}

function gitCommitPush() {
  try {
    execFileSync("git", ["add", OUT]);
    const staged = execFileSync("git", ["diff", "--cached", "--name-only"], { encoding: "utf8" }).trim();
    if (!staged) return;
    execFileSync("git", ["commit", "-m", `live: ESPN snapshot ${new Date().toISOString()}`], { stdio: "ignore" });
    for (let attempt = 0; attempt < 3; attempt++) {
      try { execFileSync("git", ["push"], { stdio: "ignore" }); return; }
      catch { try { execFileSync("git", ["pull", "--rebase", "--autostash"], { stdio: "ignore" }); } catch {} }
    }
  } catch (e) { console.error(`git: ${e.message}`); }
}

async function tick() {
  const events = await collect();
  const sig = signature(events);
  if (sig === currentSignature()) return false;
  mkdirSync("public/data", { recursive: true });
  writeFileSync(OUT, JSON.stringify({ updatedAt: new Date().toISOString(), source: "espn:site.api.espn.com", count: events.length, events }, null, 1));
  const live = events.filter((e) => e.state === "in").length;
  console.log(`updated ${OUT}: ${events.length} events (${live} live) at ${new Date().toISOString()}`);
  if (LOOP > 0) gitCommitPush();
  return true;
}

async function main() {
  if (LOOP <= 0) { await tick(); return; }
  const end = Date.now() + LOOP * 1000;
  while (Date.now() < end) {
    try { await tick(); } catch (e) { console.error(e.message); }
    await sleep(EVERY * 1000);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
