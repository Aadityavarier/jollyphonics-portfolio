import type { Milestone } from "@/content/journey";

/** Home's four-stop version of the About journey: the start, joining Inner Wheel, the first award, and the latest. */
export function teaserMilestones(all: readonly Milestone[]): Milestone[] {
  const joined = all.find((m) => m.title.startsWith("Joined"));
  const award = all.find((m) => /Award/.test(m.title));
  return [all[0], joined, award, all[all.length - 1]].filter((m): m is Milestone => Boolean(m));
}
