import type { Team } from "../types";

// 2026 FIFA World Cup final-draw groups (drawn 5 Dec 2025, Washington D.C.).
// Source: https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_draw
//
// Elo ratings are approximate early-2026 World-Football-Elo values and are the
// single biggest lever on every prediction. They are intentionally kept in one
// place so they are easy to re-tune as form changes — edit a number here and
// the whole site (match predictor + Monte Carlo forecast) updates.
export const TEAMS: Team[] = [
  // Group A
  { id: "MEX", name: "Mexico", group: "A", elo: 1800, host: true, flag: "🇲🇽" },
  { id: "RSA", name: "South Africa", group: "A", elo: 1620, flag: "🇿🇦" },
  { id: "KOR", name: "Korea Republic", group: "A", elo: 1790, flag: "🇰🇷" },
  { id: "CZE", name: "Czechia", group: "A", elo: 1810, flag: "🇨🇿" },

  // Group B
  { id: "CAN", name: "Canada", group: "B", elo: 1760, host: true, flag: "🇨🇦" },
  { id: "BIH", name: "Bosnia & Herzegovina", group: "B", elo: 1700, flag: "🇧🇦" },
  { id: "QAT", name: "Qatar", group: "B", elo: 1650, flag: "🇶🇦" },
  { id: "SUI", name: "Switzerland", group: "B", elo: 1860, flag: "🇨🇭" },

  // Group C
  { id: "BRA", name: "Brazil", group: "C", elo: 2010, flag: "🇧🇷" },
  { id: "MAR", name: "Morocco", group: "C", elo: 1870, flag: "🇲🇦" },
  { id: "HAI", name: "Haiti", group: "C", elo: 1500, flag: "🇭🇹" },
  { id: "SCO", name: "Scotland", group: "C", elo: 1780, flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },

  // Group D
  { id: "USA", name: "United States", group: "D", elo: 1820, host: true, flag: "🇺🇸" },
  { id: "PAR", name: "Paraguay", group: "D", elo: 1740, flag: "🇵🇾" },
  { id: "AUS", name: "Australia", group: "D", elo: 1730, flag: "🇦🇺" },
  { id: "TUR", name: "Türkiye", group: "D", elo: 1820, flag: "🇹🇷" },

  // Group E
  { id: "GER", name: "Germany", group: "E", elo: 1960, flag: "🇩🇪" },
  { id: "CUW", name: "Curaçao", group: "E", elo: 1500, flag: "🇨🇼" },
  { id: "CIV", name: "Côte d'Ivoire", group: "E", elo: 1790, flag: "🇨🇮" },
  { id: "ECU", name: "Ecuador", group: "E", elo: 1820, flag: "🇪🇨" },

  // Group F
  { id: "NED", name: "Netherlands", group: "F", elo: 1990, flag: "🇳🇱" },
  { id: "JPN", name: "Japan", group: "F", elo: 1850, flag: "🇯🇵" },
  { id: "SWE", name: "Sweden", group: "F", elo: 1790, flag: "🇸🇪" },
  { id: "TUN", name: "Tunisia", group: "F", elo: 1690, flag: "🇹🇳" },

  // Group G
  { id: "BEL", name: "Belgium", group: "G", elo: 1930, flag: "🇧🇪" },
  { id: "EGY", name: "Egypt", group: "G", elo: 1760, flag: "🇪🇬" },
  { id: "IRN", name: "IR Iran", group: "G", elo: 1800, flag: "🇮🇷" },
  { id: "NZL", name: "New Zealand", group: "G", elo: 1500, flag: "🇳🇿" },

  // Group H
  { id: "ESP", name: "Spain", group: "H", elo: 2070, flag: "🇪🇸" },
  { id: "CPV", name: "Cabo Verde", group: "H", elo: 1620, flag: "🇨🇻" },
  { id: "KSA", name: "Saudi Arabia", group: "H", elo: 1670, flag: "🇸🇦" },
  { id: "URU", name: "Uruguay", group: "H", elo: 1900, flag: "🇺🇾" },

  // Group I
  { id: "FRA", name: "France", group: "I", elo: 2080, flag: "🇫🇷" },
  { id: "SEN", name: "Senegal", group: "I", elo: 1850, flag: "🇸🇳" },
  { id: "IRQ", name: "Iraq", group: "I", elo: 1640, flag: "🇮🇶" },
  { id: "NOR", name: "Norway", group: "I", elo: 1850, flag: "🇳🇴" },

  // Group J
  { id: "ARG", name: "Argentina", group: "J", elo: 2100, flag: "🇦🇷" },
  { id: "ALG", name: "Algeria", group: "J", elo: 1780, flag: "🇩🇿" },
  { id: "AUT", name: "Austria", group: "J", elo: 1820, flag: "🇦🇹" },
  { id: "JOR", name: "Jordan", group: "J", elo: 1620, flag: "🇯🇴" },

  // Group K
  { id: "POR", name: "Portugal", group: "K", elo: 2000, flag: "🇵🇹" },
  { id: "COD", name: "DR Congo", group: "K", elo: 1730, flag: "🇨🇩" },
  { id: "UZB", name: "Uzbekistan", group: "K", elo: 1690, flag: "🇺🇿" },
  { id: "COL", name: "Colombia", group: "K", elo: 1890, flag: "🇨🇴" },

  // Group L
  { id: "ENG", name: "England", group: "L", elo: 2010, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "CRO", name: "Croatia", group: "L", elo: 1900, flag: "🇭🇷" },
  { id: "GHA", name: "Ghana", group: "L", elo: 1760, flag: "🇬🇭" },
  { id: "PAN", name: "Panama", group: "L", elo: 1640, flag: "🇵🇦" },
];

export const GROUP_IDS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"] as const;

export function teamsByGroup(group: string): Team[] {
  return TEAMS.filter((t) => t.group === group);
}

export function getTeam(id: string): Team {
  const t = TEAMS.find((x) => x.id === id);
  if (!t) throw new Error(`Unknown team id: ${id}`);
  return t;
}
