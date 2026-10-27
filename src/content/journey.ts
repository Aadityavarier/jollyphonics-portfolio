import { brand } from "./brand";
import { founder } from "./founder";

export interface MilestoneLine {
  id: string;
  title: string;
  detail?: string;
}

export interface Milestone {
  /** The date exactly as content.md writes it. */
  when: string;
  /** One or more events from that year. */
  lines: MilestoneLine[];
}

type Founder = Pick<typeof founder, "founded" | "awards" | "community">;
type Event = MilestoneLine & { when: string };

const year = (when: string) => parseInt(when.replace(/^\D+/, ""), 10);

/**
 * Her years, oldest first: the start, the founding, and every Inner Wheel role and award
 * flagged `journey` in founder.ts. Events with the same date share one stop. Every date is read from content/.
 */
export function buildJourney(f: Founder): Milestone[] {
  const iw = f.community.innerWheel;
  const events: Event[] = [
    { id: "start", when: brand.numbers.since, title: "Started teaching Jolly Phonics" },
    { id: "founded", when: f.founded, title: "Founded the institute", detail: brand.fullName },
    ...iw.roles
      .filter((r) => "journey" in r && r.journey)
      .map((r) =>
        r.id === "member"
          ? { id: "iw-member", when: r.period.replace(/^since\s+/, ""), title: `Joined ${iw.org}`, detail: r.role }
          : { id: `iw-${r.id}`, when: r.period, title: r.role, detail: iw.org },
      ),
    // Awards are stored newest first; within a year keep their listed order.
    ...[...f.awards]
      .sort((a, b) => year(a.year) - year(b.year))
      .filter((a) => "journey" in a && a.journey)
      .map((a) => ({ id: `award-${a.id}`, when: a.year, title: a.name, detail: a.detail })),
  ];
  // Stable sort: same-year events keep the order above (founding before that year's award).
  events.sort((a, b) => year(a.when) - year(b.when));
  const stops: Milestone[] = [];
  for (const { when, ...line } of events) {
    const last = stops.at(-1);
    if (last?.when === when) last.lines.push(line);
    else stops.push({ when, lines: [line] });
  }
  return stops;
}

export const journey: Milestone[] = buildJourney(founder);
