import { brand } from "./brand";
import { founder } from "./founder";

export interface Milestone {
  /** The date exactly as content.md writes it. */
  when: string;
  title: string;
  detail?: string;
}

const iw = founder.community.innerWheel;
const role = (name: string) => iw.roles.find((r) => r.role.includes(name))!;
const award = (name: string) => founder.awards.find((a) => a.name.includes(name))!;

/** Her years, oldest first. Every date and name is read from founder.ts / brand.ts (content.md). */
export const journey: Milestone[] = [
  { when: String(brand.numbers.since), title: "Started teaching Jolly Phonics" },
  { when: role("Member").period.replace(/^since\s+/, ""), title: `Joined ${iw.org}`, detail: "Member" },
  { when: role("Correspondent").period, title: "Club Correspondent", detail: iw.org },
  { when: award("Business").year, title: award("Business").name, detail: award("Business").detail },
  { when: role("Secretary").period, title: "Secretary", detail: iw.org },
  { when: role("President").period, title: "President", detail: iw.org },
  {
    when: award("ROVEX").year,
    title: `${award("ROVEX").name} and ${award("Nation").name}`,
    detail: `${award("ROVEX").detail}; ${award("Nation").detail}`,
  },
];
