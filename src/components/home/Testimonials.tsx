import { labels } from "@/content/labels";
import { testimonials, type Testimonial } from "@/content/testimonials";
import { Section, SectionHeading } from "@/components/layout/Section";
import { Stagger } from "@/components/motion/Reveal";

/** Parents' own words. Renders nothing until src/content/testimonials.ts has at least one real entry. */
export function Testimonials({ items = testimonials }: { items?: readonly Testimonial[] }) {
  if (items.length === 0) return null;
  return (
    <Section id="testimonials" tone="teal">
      <SectionHeading id="testimonials-title">{labels.home.testimonials.title}</SectionHeading>
      <Stagger as="ul" className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <li key={t.name + t.quote.slice(0, 24)}>
            <figure className="grid h-full content-between gap-5 rounded-[var(--radius-panel)] bg-paper p-6 text-ink">
              <blockquote className="text-lead">{`“${t.quote}”`}</blockquote>
              <figcaption className="grid gap-0.5">
                <span className="font-bold">{t.name}</span>
                {t.context && <span className="text-small text-muted">{t.context}</span>}
              </figcaption>
            </figure>
          </li>
        ))}
      </Stagger>
    </Section>
  );
}
