import { brand } from "@/content/brand";
import { why } from "@/content/why";
import { Section, SectionHeading } from "@/components/layout/Section";

/** The eight reasons from content.md as one large plain list, not a card grid. */
export function WhyChooseUs() {
  return (
    <Section id="why-us">
      <div className="grid gap-10">
        <SectionHeading id="why-us-title" className="max-w-[24ch]">
          Why parents choose {brand.name.replace("Tr. ", "Tr.\u00a0")}
        </SectionHeading>
        <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {why.points.map((p) => (
            <div key={p.title} className="grid content-start gap-1">
              <dt className="font-display text-lead font-bold">{p.title}</dt>
              <dd>{p.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
