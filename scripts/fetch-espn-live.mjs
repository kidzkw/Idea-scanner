/**
 * Runs ON a GitHub Actions runner (which has open internet, unlike this
 * sandbox) to pull live 2026 World Cup data from ESPN's free hidden API and
 * write it to public/data/live-espn.json. The workbench then reads that file
 * via raw.githubusercontent.com — the one host the local egress allow-list
 * permits — turning GitHub Actions into a real-time-data proxy.
 *
 * Output is a normalized, cumulative snapshot: ESPN's keyEvents already contain
 * every goal/card/sub so far, so one committed snapshot per run is lossless.
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";

const SLUG = "fifa.world";
const BASE = `https://site.api.espn.com/apis/site/v2/sports/soccer/${SLUG}`;
const OUT = "public/data/live-espn.json";

async function j(url) {
  const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
  return r.json();
}
const ymd = (d) => d.toISOString().slice(0, 10).replace(/-/g, "");

function parseEvent(e) {
  const comp = e.competitions?.[0] || {};
  const competitors = (comp.competitors || []).map((c) => ({
    homeAway: c.homeAway,
    abbr: c.team?.abbreviation || null,
    name: c.team?.displayName || c.team?.shortDisplayName || null,
    score: c.score != null ? Number(c.score) : null,
  }));
  return {
    id: e.id,
    date: e.date,
    shortName: e.shortName || null,
    state: comp.status?.type?.state || e.status?.type?.state || "pre", // pre | in | post
    clock: comp.status?.displayClock || null,
    period: comp.status?.period ?? null,
    competitors,
  };
}

function parseKeyEvents(summary) {
  const out = [];
  const list = summary.keyEvents || summary.commentary || [];
  for (const k of list) {
    const tText = (k.type?.text || k.type || "").toString().toLowerCase();
    let type = null;
    if (tText.includes("own")) type = "owngoal";
    else if (tText.includes("goal")) type = "goal";
    else if (tText.includes("penalty")) type = "penalty";
    else if (tText.includes("red")) type = "red";
    else if (tText.includes("yellow")) type = "yellow";
    else if (tText.includes("substitution") || tText.includes("sub")) type = "sub";
    if (!type) continue;
    out.push({
      type,
      minute: k.clock?.displayValue || "",
      team: k.team?.abbreviation || "",
      text: k.text || k.shortText || tText,
    });
  }
  return out;
}

async function main() {
  // Cover the current UTC day plus the previous one (kickoffs span timezones).
  const now = new Date();
  const days = [...new Set([ymd(new Date(now - 18 * 3600e3)), ymd(now), ymd(new Date(now.getTime() + 6 * 3600e3))])];

  const eventsById = new Map();
  for (const d of days) {
    try {
      const board = await j(`${BASE}/scoreboard?dates=${d}`);
      for (const e of board.events || []) eventsById.set(e.id, parseEvent(e));
    } catch (err) {
      console.error(`scoreboard ${d}: ${err.message}`);
    }
  }

  // Enrich live and just-finished games with their key events.
  const events = [];
  for (const ev of eventsById.values()) {
    let keyEvents = [];
    if (ev.state === "in" || ev.state === "post") {
      try {
        const sum = await j(`${BASE}/summary?event=${ev.id}`);
        keyEvents = parseKeyEvents(sum);
      } catch (err) {
        console.error(`summary ${ev.id}: ${err.message}`);
      }
    }
    events.push({ ...ev, keyEvents });
  }

  // Skip the write when nothing meaningful changed, so the cron doesn't spam a
  // commit every run just because the timestamp moved (events carry scores,
  // status, clock and key events — everything that actually matters).
  const eventsStr = JSON.stringify(events);
  if (existsSync(OUT)) {
    try {
      if (JSON.stringify(JSON.parse(readFileSync(OUT, "utf8")).events) === eventsStr) {
        console.log("no change — skipping write");
        return;
      }
    } catch { /* unreadable existing file — overwrite */ }
  }

  mkdirSync("public/data", { recursive: true });
  const payload = { updatedAt: new Date().toISOString(), source: "espn:site.api.espn.com", count: events.length, events };
  writeFileSync(OUT, JSON.stringify(payload, null, 1));
  const live = events.filter((e) => e.state === "in").length;
  console.log(`Wrote ${OUT}: ${events.length} events (${live} live) at ${payload.updatedAt}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
