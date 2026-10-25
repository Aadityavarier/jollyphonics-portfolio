import type { Milestone } from "@/content/journey";

const has = (id: string) => (m: Milestone) => m.lines.some((l) => l.id === id);

/** Home's short version of the About journey: the start, joining Inner Wheel, the founding, and the latest stop. */
export function teaserMilestones(all: readonly Milestone[]): Milestone[] {
  const picked = [all[0], all.find(has("iw-member")), all.find(has("founded")), all.at(-1)];
  return picked.filter((m, i): m is Milestone => Boolean(m) && picked.indexOf(m) === i);
}
