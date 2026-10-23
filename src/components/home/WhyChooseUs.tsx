import type { CSSProperties } from "react";
import { brand } from "@/content/brand";
import { why } from "@/content/why";
import { Section, SectionHeading } from "@/components/layout/Section";
import { PHONICS_TILES } from "@/components/blocks/PhonicsAccent";
import { FxHeading } from "@/components/motion/FxHeading";
import { RevealTarget } from "@/components/motion/RevealTarget";

/** A leading figure ("20+", "4,500+") is set large; the rest of the line is untouched. */
function Detail({ text }: { text: string }) {
  const m = text.match(/^([\d,]+\+?)(.*)$/);
  return (
    <p data-detail className="text-body text-muted">
      {m ? (
        <>
          <span data-figure className="font-display text-[1.6em] leading-none font-bold text-ink">
            {m[1]}
          </span>
          {m[2]}
        </>
      ) : (
        text
      )}
    </p>
  );
}

/**
 * The eight reasons from content.md as an exercise-book page: each on its own ruled line with a numbered sound
 * tile. The rules draw left to right as the list enters; the content never moves.
 */
export function WhyChooseUs() {
  return (
    <Section id="why-us" tone="surface">
      <div className="grid gap-8">
        <SectionHeading id="why-us-title" className="max-w-[24ch]">
          Why parents choose {brand.name.replace("Tr. ", "Tr. ")}
        </SectionHeading>
        <RevealTarget as="ol" attr="data-reveal" value="ruled" className="why-list" data-failsafe={1800}>
          {why.points.map((p, i) => {
            const tile = PHONICS_TILES[i % PHONICS_TILES.length];
            return (
              <li key={p.title} className="why-row" style={{ "--i": i } as CSSProperties}>
                <span data-num aria-hidden="true" className="why-num" style={{ background: tile.bg, color: tile.fg }}>
                  {i + 1}
                </span>
                <span className="grid gap-1">
                  <FxHeading as="span" fx="soundout" className="font-display text-lead leading-tight font-bold">
                    {p.title}
                  </FxHeading>
                  <Detail text={p.text} />
                </span>
              </li>
            );
          })}
        </RevealTarget>
      </div>
    </Section>
  );
}
