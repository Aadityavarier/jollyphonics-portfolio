import type { CSSProperties } from "react";
import { journey } from "@/content/journey";
import { teaserMilestones } from "@/lib/journey";
import { RevealTarget } from "@/components/motion/RevealTarget";

/** A short version of the About journey: four dated stops on a rule that draws itself once. */
export function JourneyTeaser() {
  const stops = teaserMilestones(journey);
  return (
    <RevealTarget as="ol" attr="data-reveal" value="rule" className="jt" data-failsafe={1400}>
      {stops.map((m, i) => (
        <li key={m.when} className="jt-stop" style={{ "--i": i } as CSSProperties}>
          <span aria-hidden="true" className="jt-dot" />
          <span className="font-display text-lead leading-none font-bold">{m.when}</span>
          <span className="text-small leading-snug">{m.title}</span>
        </li>
      ))}
    </RevealTarget>
  );
}
