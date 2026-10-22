import { brand } from "@/content/brand";
import { why } from "@/content/why";
import { Section, SectionHeading } from "@/components/layout/Section";
import { PHONICS_TILES } from "@/components/blocks/PhonicsAccent";
import { Stagger } from "@/components/motion/Reveal";

/** The eight reasons from content.md as one large plain list, each marked with a small sound tile. */
export function WhyChooseUs() {
  return (
    <Section id="why-us">
      <div className="grid gap-10">
        <SectionHeading id="why-us-title" className="max-w-[24ch]">
          Why parents choose {brand.name.replace("Tr. ", "Tr. ")}
        </SectionHeading>
        <Stagger as="dl" className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {why.points.map((p, i) => (
            <div key={p.title} className="grid content-start gap-2">
              <dt className="grid grid-cols-[auto_1fr] items-baseline gap-3 font-display text-lead font-bold">
                <span
                  aria-hidden="true"
                  className="size-[0.7em] translate-y-[0.05em] rounded-[0.18em]"
                  style={{ background: PHONICS_TILES[i % PHONICS_TILES.length].bg }}
                />
                {p.title}
              </dt>
              <dd className="pl-[calc(0.7em*1.25+0.75rem)] max-sm:pl-0">{p.text}</dd>
            </div>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
