/**
 * Live match monitor for the 2026 World Cup workbench.
 *
 *   node scripts/monitor-match.mjs <matchNumber> [--once] [--interval=120] [--max=1500]
 *
 * Polls the open 26worldcup dataset (the only live source reachable from this
 * environment) and reports objective changes for one match: lineup posted,
 * goals, substitutions, bookings, score/status/time. In loop mode it exits as
 * soon as something new happens (so the agent can relay it and re-arm) or when
 * the match finishes.
 *
 * Honest limits: the dataset refreshes on a cron (minutes-to-an-hour lag, not
 * second-by-second), and there is no live player-rating feed — "poor form" can
 * only be inferred from objective events (early sub, early booking, conceding).
 */
import { setTimeout as sleep } from "node:timers/promises";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const BASE = "https://raw.githubusercontent.com/26worldcup/26worldcup.github.io/main/public/data";
const N = Number(process.argv[2]);
const ONCE = process.argv.includes("--once");
const arg = (k, d) => {
  const a = process.argv.find((x) => x.startsWith(`--${k}=`));
  return a ? Number(a.split("=")[1]) : d;
};
const INTERVAL = arg("interval", 120);
const MAX = arg("max", 1500);
const STATE = `/tmp/monitor-${N}.json`;

if (!N) {
  console.error("usage: node scripts/monitor-match.mjs <matchNumber> [--once]");
  process.exit(2);
}

async function getJson(name) {
  const res = await fetch(`${BASE}/${name}.json`, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`fetch ${name}: HTTP ${res.status}`);
  return res.json();
}

function nameMap(lu) {
  const m = {};
  for (const side of ["home", "away"]) {
    for (const p of [...(lu[side].xi || []), ...(lu[side].subs || [])]) m[p.id] = p.name;
  }
  return m;
}

async function snapshot() {
  const [matches, lineups] = await Promise.all([getJson("matches"), getJson("lineups")]);
  const mt = matches.matches.find((x) => x.n === N);
  if (!mt) throw new Error(`match ${N} not found`);
  const lu = lineups[mt.id];
  const ev = [];
  let formation = null;
  if (lu) {
    const nm = nameMap(lu);
    const nameOf = (id) => nm[id] || id;
    formation = { home: lu.home.tactics, away: lu.away.tactics };
    for (const side of ["home", "away"]) {
      const code = mt[side].code;
      for (const g of lu[side].goals || []) ev.push(`GOAL  ${g.minute}  ${code} — ${nameOf(g.player)}`);
      for (const s of lu[side].substitutions || [])
        ev.push(`SUB   ${s.minute}  ${code} — ${nameOf(s.on)} ON for ${nameOf(s.off)}`);
      for (const b of lu[side].bookings || [])
        ev.push(`CARD  ${b.minute}  ${code} — ${nameOf(b.player)} (${b.card === 1 ? "yellow" : "red"})`);
    }
  }
  return {
    n: N,
    label: `${mt.home.code} ${mt.home.score ?? "-"}-${mt.away.score ?? "-"} ${mt.away.code}`,
    status: mt.status,
    time: mt.time ?? null,
    lineupPosted: !!lu,
    formation,
    events: ev,
  };
}

function diff(prev, cur) {
  const out = [];
  if (!prev) return out; // first run establishes baseline silently
  if (!prev.lineupPosted && cur.lineupPosted)
    out.push(`📋 Lineups posted — formations ${cur.formation.home} vs ${cur.formation.away}`);
  if (prev.status !== cur.status) out.push(`⏱️ Status: ${prev.status} → ${cur.status} (${cur.label})`);
  if (prev.label !== cur.label) out.push(`⚽ Score now ${cur.label}${cur.time ? ` (${cur.time})` : ""}`);
  const seen = new Set(prev.events);
  for (const e of cur.events) if (!seen.has(e)) out.push(`   ${e}`);
  return out;
}

async function poll() {
  const cur = await snapshot();
  const prev = existsSync(STATE) ? JSON.parse(readFileSync(STATE, "utf8")) : null;
  const changes = diff(prev, cur);
  writeFileSync(STATE, JSON.stringify(cur));
  return { cur, changes };
}

if (ONCE) {
  const { cur, changes } = await poll();
  console.log(`M${N} ${cur.label} [${cur.status}${cur.time ? " " + cur.time : ""}] lineup:${cur.lineupPosted}`);
  if (changes.length) console.log("CHANGES:\n" + changes.join("\n"));
  process.exit(0);
}

const deadline = Date.now() + MAX * 1000;
// Establish baseline first so we only report things that happen from now on.
await poll();
while (Date.now() < deadline) {
  await sleep(INTERVAL * 1000);
  let res;
  try {
    res = await poll();
  } catch (e) {
    continue; // transient fetch error; keep polling
  }
  if (res.changes.length) {
    console.log(`=== M${N} update — ${res.cur.label} [${res.cur.status}${res.cur.time ? " " + res.cur.time : ""}] ===`);
    console.log(res.changes.join("\n"));
    process.exit(0); // wake the agent to relay, then it re-arms
  }
  if (res.cur.status === "finished") {
    console.log(`=== M${N} FINISHED — ${res.cur.label} ===`);
    process.exit(0);
  }
}
console.log(`=== M${N} monitor window elapsed (no change) — re-arm to continue ===`);
process.exit(0);
