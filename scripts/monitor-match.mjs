/**
 * Live match monitor — streams outcome-affecting events for one match.
 *
 *   node scripts/monitor-match.mjs <matchNumber> [--once] [--interval=60] [--max=1500]
 *
 * Data providers, auto-selected at startup (best first):
 *   1. espn-direct  site.api.espn.com — true real-time, free, no key. Used only
 *      if that host is in the environment's network egress allow-list.
 *   2. espn-proxy   raw.githubusercontent.com/<this repo>/.../live-espn.json —
 *      ESPN data relayed through GitHub Actions (see .github/workflows/
 *      live-espn.yml). Reachable here because raw.githubusercontent.com is
 *      allow-listed; refreshes ~every 5 min.
 *   3. dataset      raw.githubusercontent.com/26worldcup — cron mirror, the
 *      slowest fallback.
 *
 * Every event is tagged by win/loss impact (high/med/low) and emitted
 * high-impact first. There is no live player-rating feed in any reachable
 * source, so "poor form / 状态不好" is inferred from objective events only.
 */
import { setTimeout as sleep } from "node:timers/promises";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const N = Number(process.argv[2]);
const ONCE = process.argv.includes("--once");
const argn = (k, d) => {
  const a = process.argv.find((x) => x.startsWith(`--${k}=`));
  return a ? Number(a.split("=")[1]) : d;
};
const INTERVAL = argn("interval", 20);
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
  try { await getJson(url); return true; } catch { return false; }
}

// ---- impact model -----------------------------------------------------------

const minNum = (m) => parseInt(String(m).replace(/\D/g, ""), 10) || 0;

function classify(ev) {
  switch (ev.type) {
    case "goal": return { impact: "high", why: "changes the score" };
    case "owngoal": return { impact: "high", why: "own goal — changes the score" };
    case "penalty": return { impact: "high", why: "penalty situation" };
    case "red": return { impact: "high", why: "red card — a man down for the rest" };
    case "sub":
      if (/injur|injured|knock/i.test(ev.text || ""))
        return { impact: "med", why: "injury — player taken off hurt" };
      if (ev.starterOff && ev.minute && minNum(ev.minute) < 60)
        return { impact: "med", why: "starter off early — possible injury / poor form" };
      return { impact: "low", why: "rotation" };
    case "yellow": return { impact: ev.keyPlayer ? "med" : "low", why: "booking — caution / suspension risk" };
    default: return { impact: "low", why: "" };
  }
}

const ICON = { goal: "⚽", owngoal: "🥅", penalty: "🎯", red: "🟥", yellow: "🟨", sub: "🔄" };
const fmt = (e) =>
  `${e.impact === "high" ? "‼️" : e.impact === "med" ? "❗" : "  "} ${ICON[e.type] || "•"} ${e.minute || ""} ${e.team} — ${e.text}${e.why ? `  (${e.why})` : ""}`;

// ---- shared helpers ---------------------------------------------------------

async function matchMeta() {
  const matches = await getJson(`${RAW}/matches.json`);
  const mt = matches.matches.find((x) => x.n === N);
  if (!mt) throw new Error(`match ${N} not in dataset`);
  return mt;
}

/** Build normalized state from an ESPN-shaped event object. */
function fromEspn(ev, fallbackHome, fallbackAway) {
  const home = ev.competitors?.find((c) => c.homeAway === "home") || {};
  const away = ev.competitors?.find((c) => c.homeAway === "away") || {};
  const mtView = {
    home: { code: home.abbr || fallbackHome, score: home.score ?? null },
    away: { code: away.abbr || fallbackAway, score: away.score ?? null },
    status: ev.state === "post" ? "finished" : ev.state === "in" ? "live" : "scheduled",
    time: ev.clock || null,
  };
  return normalize(mtView, null, ev.keyEvents || [], "espn");
}

/** Does an ESPN event correspond to our match N? Match on date + team code. */
function espnMatches(ev, mt) {
  const sameDay = (ev.date || "").slice(0, 10) === mt.date.slice(0, 10);
  if (!sameDay) return false;
  const abbrs = (ev.competitors || []).map((c) => c.abbr);
  const names = (ev.competitors || []).map((c) => (c.name || "").toLowerCase());
  const codes = [mt.home.code, mt.away.code];
  if (abbrs.some((a) => codes.includes(a))) return true;
  // loose: shortName like "RSA vs CZE"
  if (ev.shortName && codes.some((c) => ev.shortName.includes(c))) return true;
  return names.length > 0 && codes.some((c) => names.some((n) => n.includes(c.toLowerCase())));
}

// ---- provider: ESPN direct --------------------------------------------------

async function snapshotEspnDirect() {
  const mt = await matchMeta();
  const ymd = mt.date.slice(0, 10).replace(/-/g, "");
  const board = await getJson(`${ESPN}/scoreboard?dates=${ymd}`);
  const raw = (board.events || []).map((e) => {
    const comp = e.competitions?.[0] || {};
    return {
      id: e.id, date: e.date, shortName: e.shortName,
      state: comp.status?.type?.state, clock: comp.status?.displayClock,
      competitors: (comp.competitors || []).map((c) => ({
        homeAway: c.homeAway, abbr: c.team?.abbreviation, name: c.team?.displayName,
        score: c.score != null ? Number(c.score) : null,
      })),
    };
  });
  const ev = raw.find((e) => espnMatches(e, mt));
  if (!ev) throw new Error("espn-direct: event not found");
  const sum = await getJson(`${ESPN}/summary?event=${ev.id}`);
  ev.keyEvents = parseKeyEvents(sum);
  return fromEspn(ev, mt.home.code, mt.away.code);
}

function parseKeyEvents(summary) {
  const out = [];
  for (const k of summary.keyEvents || summary.commentary || []) {
    const t = (k.type?.text || "").toString().toLowerCase();
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

// ---- provider: ESPN proxy (GitHub Actions -> this repo) ---------------------
// This repo is private, so the live-espn.json the workflow commits is read via
// the authenticated git remote, not raw.githubusercontent.com (which needs a
// token for private repos).

function readProxyFeed() {
  try {
    execFileSync("git", ["fetch", "-q", "origin", "main"], { stdio: "ignore" });
  } catch { /* offline / transient — fall through to whatever git has */ }
  const txt = execFileSync("git", ["show", "origin/main:public/data/live-espn.json"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
  return JSON.parse(txt);
}

async function snapshotEspnProxy() {
  const mt = await matchMeta();
  const feed = readProxyFeed();
  const ev = (feed.events || []).find((e) => espnMatches(e, mt));
  if (!ev) throw new Error("espn-proxy: event not in feed yet");
  return fromEspn(ev, mt.home.code, mt.away.code);
}

async function proxyHasMatch() {
  try {
    const mt = await matchMeta();
    const feed = readProxyFeed();
    return (feed.events || []).some((e) => espnMatches(e, mt));
  } catch { return false; }
}

// ---- provider: 26worldcup dataset -------------------------------------------

async function snapshotDataset() {
  const [matches, lineups] = await Promise.all([getJson(`${RAW}/matches.json`), getJson(`${RAW}/lineups.json`)]);
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
      for (const g of lu[side].goals || []) events.push({ type: "goal", minute: g.minute, team, text: nameOf(g.player) });
      for (const s of lu[side].substitutions || [])
        events.push({ type: "sub", minute: s.minute, team, starterOff: starters.has(s.off), text: `${nameOf(s.on)} ON / ${nameOf(s.off)} OFF` });
      for (const b of lu[side].bookings || [])
        events.push({ type: b.card === 2 ? "red" : "yellow", minute: b.minute, team, text: `${nameOf(b.player)} ${b.card === 2 ? "(red)" : "(yellow)"}` });
    }
  }
  return normalize(mt, formation, events, "dataset");
}

// ---- normalize + diff -------------------------------------------------------

function normalize(mt, formation, rawEvents, source) {
  const events = rawEvents.map((e) => {
    const c = classify(e);
    return { ...e, ...c, key: `${e.type}|${e.minute}|${e.team}|${e.text}` };
  });
  return {
    n: N, source,
    label: `${mt.home.code} ${mt.home.score ?? "-"}-${mt.away.score ?? "-"} ${mt.away.code}`,
    status: mt.status, time: mt.time ?? null,
    lineupPosted: !!formation, formation, events,
  };
}

function diff(prev, cur) {
  const out = [];
  if (!prev) return out;
  if (!prev.lineupPosted && cur.lineupPosted) out.push(`📋 Lineups posted — ${cur.formation.home} vs ${cur.formation.away}`);
  if (prev.status !== cur.status) out.push(`⏱️ Status: ${prev.status} → ${cur.status} (${cur.label})`);
  if (prev.label !== cur.label) out.push(`‼️ Score now ${cur.label}${cur.time ? ` (${cur.time})` : ""}`);
  const seen = new Set(prev.events.map((e) => e.key));
  const fresh = cur.events.filter((e) => !seen.has(e.key));
  const rank = { high: 0, med: 1, low: 2 };
  fresh.sort((a, b) => rank[a.impact] - rank[b.impact]);
  for (const e of fresh) out.push(fmt(e));
  return out;
}

// ---- driver -----------------------------------------------------------------

let snapshot = snapshotDataset;
let providerNote = "source: 26worldcup dataset (cron lag)";
if (await reachable(`${ESPN}/scoreboard`)) {
  snapshot = snapshotEspnDirect;
  providerNote = "source: ESPN direct (real-time) ✅";
} else if (await proxyHasMatch()) {
  snapshot = snapshotEspnProxy;
  providerNote = "source: ESPN via GitHub Actions proxy (~5 min) ✅";
}

async function poll() {
  let cur;
  try {
    cur = await snapshot();
  } catch {
    cur = await snapshotDataset(); // resilient fallback
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
await poll();
while (Date.now() < deadline) {
  await sleep(INTERVAL * 1000);
  let res;
  try { res = await poll(); } catch { continue; }
  if (res.changes.length) {
    console.log(`=== M${N} — ${res.cur.label} [${res.cur.status}${res.cur.time ? " " + res.cur.time : ""}] (${res.cur.source}) ===`);
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
