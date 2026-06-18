/**
 * Live match monitor — streams outcome-affecting events for one match.
 *
 *   node scripts/monitor-match.mjs <matchNumber> [--once] [--interval=60] [--max=1500]
 *
 * Providers (auto-selected at startup, best first):
 *   1. ESPN   site.api.espn.com — true real-time, free, no key. Used if the
 *      host is allow-listed in the environment's network egress settings.
 *   2. dataset raw.githubusercontent.com/26worldcup — cron-refreshed mirror
 *      (minutes-to-~1h lag); always reachable here, used as the fallback.
 *
 * Every event is tagged by win/loss impact (high/med/low) so the relay can lead
 * with what actually swings the result: goals, penalties, red cards, and a key
 * starter going off early (injury / poor form proxy — there is no live rating
 * feed reachable here).
 */
import { setTimeout as sleep } from "node:timers/promises";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const N = Number(process.argv[2]);
const ONCE = process.argv.includes("--once");
const argn = (k, d) => {
  const a = process.argv.find((x) => x.startsWith(`--${k}=`));
  return a ? Number(a.split("=")[1]) : d;
};
const INTERVAL = argn("interval", 60);
const MAX = argn("max", 1500);
const STATE = `/tmp/monitor-${N}.json`;

if (!N) {
  console.error("usage: node scripts/monitor-match.mjs <matchNumber> [--once]");
  process.exit(2);
}

const RAW = "https://raw.githubusercontent.com/26worldcup/26worldcup.github.io/main/public/data";
const ESPN = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world";

async function getJson(url) {
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json();
}
async function reachable(url) {
  try {
    await getJson(url);
    return true;
  } catch {
    return false;
  }
}

// ---- impact model -----------------------------------------------------------

const minNum = (m) => parseInt(String(m).replace(/\D/g, ""), 10) || 0;

/** Tag a normalized event with win/loss impact and a short reason. */
function classify(ev) {
  switch (ev.type) {
    case "goal":
      return { impact: "high", why: "changes the score" };
    case "owngoal":
      return { impact: "high", why: "own goal — changes the score" };
    case "penalty":
      return { impact: "high", why: "penalty situation" };
    case "red":
      return { impact: "high", why: "red card — a man down for the rest" };
    case "sub":
      if (ev.starterOff && ev.minute && minNum(ev.minute) < 60)
        return { impact: "med", why: "starter off early — possible injury / poor form" };
      return { impact: "low", why: "rotation" };
    case "yellow":
      return { impact: ev.keyPlayer ? "med" : "low", why: "booking — caution / suspension risk" };
    default:
      return { impact: "low", why: "" };
  }
}

const ICON = { goal: "⚽", owngoal: "🥅", penalty: "🎯", red: "🟥", yellow: "🟨", sub: "🔄" };
const fmt = (e) =>
  `${e.impact === "high" ? "‼️" : e.impact === "med" ? "❗" : "  "} ${ICON[e.type] || "•"} ${e.minute || ""} ${e.team} — ${e.text}${e.why ? `  (${e.why})` : ""}`;

// ---- provider: 26worldcup dataset -------------------------------------------

async function snapshotDataset() {
  const [matches, lineups] = await Promise.all([
    getJson(`${RAW}/matches.json`),
    getJson(`${RAW}/lineups.json`),
  ]);
  const mt = matches.matches.find((x) => x.n === N);
  if (!mt) throw new Error(`match ${N} not in dataset`);
  const lu = lineups[mt.id];
  const events = [];
  let formation = null;
  if (lu) {
    const nm = {};
    const starters = new Set();
    for (const side of ["home", "away"]) {
      for (const p of [...(lu[side].xi || []), ...(lu[side].subs || [])]) nm[p.id] = p.name;
      for (const p of lu[side].xi || []) if (p.start) starters.add(p.id);
    }
    const nameOf = (id) => nm[id] || id;
    formation = { home: lu.home.tactics, away: lu.away.tactics };
    for (const side of ["home", "away"]) {
      const team = mt[side].code;
      for (const g of lu[side].goals || [])
        events.push({ type: "goal", minute: g.minute, team, who: nameOf(g.player), text: nameOf(g.player) });
      for (const s of lu[side].substitutions || [])
        events.push({
          type: "sub", minute: s.minute, team, starterOff: starters.has(s.off),
          text: `${nameOf(s.on)} ON / ${nameOf(s.off)} OFF`,
        });
      for (const b of lu[side].bookings || [])
        events.push({
          type: b.card === 2 ? "red" : "yellow", minute: b.minute, team,
          text: `${nameOf(b.player)} ${b.card === 2 ? "(red)" : "(yellow)"}`,
        });
    }
  }
  return normalize(mt, formation, events, "dataset");
}

// ---- provider: ESPN (real-time) ---------------------------------------------

async function snapshotEspn() {
  // Resolve match meta (date, team names) from the dataset, then find the ESPN
  // event for that day and read its key events. Robust to ESPN abbreviation
  // differences by matching on team display names.
  const matches = await getJson(`${RAW}/matches.json`);
  const mt = matches.matches.find((x) => x.n === N);
  if (!mt) throw new Error(`match ${N} not in dataset`);
  const ymd = mt.date.slice(0, 10).replace(/-/g, "");
  const board = await getJson(`${ESPN}/scoreboard?dates=${ymd}`);
  const wanted = [mt.home.code, mt.away.code];
  const game = (board.events || []).find((e) => {
    const abbrs = (e.competitions?.[0]?.competitors || []).map((c) => c.team?.abbreviation);
    return abbrs.some((a) => wanted.includes(a));
  }) || (board.events || []).find((e) => e.shortName && wanted.some((w) => e.shortName.includes(w)));
  if (!game) throw new Error("ESPN: event not found for date");

  const sum = await getJson(`${ESPN}/summary?event=${game.id}`);
  const events = [];
  for (const k of sum.keyEvents || sum.commentary || []) {
    const t = (k.type?.text || "").toLowerCase();
    const minute = k.clock?.displayValue || "";
    const team = k.team?.abbreviation || "";
    const text = k.text || k.shortText || t;
    let type = "info";
    if (t.includes("own")) type = "owngoal";
    else if (t.includes("goal")) type = "goal";
    else if (t.includes("penalty")) type = "penalty";
    else if (t.includes("red")) type = "red";
    else if (t.includes("yellow")) type = "yellow";
    else if (t.includes("substitution")) type = "sub";
    if (type !== "info") events.push({ type, minute, team, text });
  }
  const comp = game.competitions?.[0];
  const home = comp?.competitors?.find((c) => c.homeAway === "home");
  const away = comp?.competitors?.find((c) => c.homeAway === "away");
  const mtView = {
    home: { code: home?.team?.abbreviation || mt.home.code, score: Number(home?.score ?? mt.home.score ?? 0) },
    away: { code: away?.team?.abbreviation || mt.away.code, score: Number(away?.score ?? mt.away.score ?? 0) },
    status: comp?.status?.type?.state === "post" ? "finished" : comp?.status?.type?.state === "in" ? "live" : "scheduled",
    time: comp?.status?.displayClock || null,
  };
  return normalize(mtView, null, events, "espn");
}

// ---- normalize + diff -------------------------------------------------------

function normalize(mt, formation, rawEvents, source) {
  const events = rawEvents.map((e) => {
    const c = classify(e);
    return { ...e, ...c, key: `${e.type}|${e.minute}|${e.team}|${e.text}` };
  });
  return {
    n: N,
    source,
    label: `${mt.home.code} ${mt.home.score ?? "-"}-${mt.away.score ?? "-"} ${mt.away.code}`,
    status: mt.status,
    time: mt.time ?? null,
    lineupPosted: !!formation,
    formation,
    events,
  };
}

function diff(prev, cur) {
  const out = [];
  if (!prev) return out;
  if (!prev.lineupPosted && cur.lineupPosted)
    out.push(`📋 Lineups posted — ${cur.formation.home} vs ${cur.formation.away}`);
  if (prev.status !== cur.status) out.push(`⏱️ Status: ${prev.status} → ${cur.status} (${cur.label})`);
  if (prev.label !== cur.label) out.push(`‼️ Score now ${cur.label}${cur.time ? ` (${cur.time})` : ""}`);
  const seen = new Set(prev.events.map((e) => e.key));
  const fresh = cur.events.filter((e) => !seen.has(e.key));
  // High-impact first.
  const rank = { high: 0, med: 1, low: 2 };
  fresh.sort((a, b) => rank[a.impact] - rank[b.impact]);
  for (const e of fresh) out.push(fmt(e));
  return out;
}

// ---- driver -----------------------------------------------------------------

let snapshot = snapshotDataset;
let providerNote = "source: 26worldcup dataset (cron lag)";
if (await reachable(`${ESPN}/scoreboard`)) {
  snapshot = snapshotEspn;
  providerNote = "source: ESPN site.api.espn.com (real-time) ✅";
}

async function poll() {
  let cur;
  try {
    cur = await snapshot();
  } catch (e) {
    if (snapshot === snapshotEspn) cur = await snapshotDataset(); // resilient fallback
    else throw e;
  }
  const prev = existsSync(STATE) ? JSON.parse(readFileSync(STATE, "utf8")) : null;
  const changes = diff(prev, cur);
  writeFileSync(STATE, JSON.stringify(cur));
  return { cur, changes };
}

if (ONCE) {
  const { cur, changes } = await poll();
  console.log(`M${N} ${cur.label} [${cur.status}${cur.time ? " " + cur.time : ""}] — ${providerNote}`);
  if (changes.length) console.log(changes.join("\n"));
  process.exit(0);
}

console.log(`Monitoring M${N} — ${providerNote}`);
const deadline = Date.now() + MAX * 1000;
await poll(); // baseline
while (Date.now() < deadline) {
  await sleep(INTERVAL * 1000);
  let res;
  try {
    res = await poll();
  } catch {
    continue;
  }
  if (res.changes.length) {
    console.log(`=== M${N} — ${res.cur.label} [${res.cur.status}${res.cur.time ? " " + res.cur.time : ""}] ===`);
    console.log(res.changes.join("\n"));
    process.exit(0);
  }
  if (res.cur.status === "finished") {
    console.log(`=== M${N} FINISHED — ${res.cur.label} ===`);
    process.exit(0);
  }
}
console.log(`=== M${N} window elapsed (no change) — re-arm to continue ===`);
process.exit(0);
