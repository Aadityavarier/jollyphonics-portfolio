import { pageMetadata } from "@/lib/metadata";
import { schools } from "@/content/schools";
import { why } from "@/content/why";
import { messages } from "@/content/messages";
import { PageHero } from "@/components/blocks/PageHero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { Tracks } from "@/components/schools/Tracks";
import { labels } from "@/content/labels";

export const metadata = pageMetadata("for-schools");

const T = labels.pages.schools;

export default function ForSchoolsPage() {
  return (
    <>
      <PageHero
        title={T.title}
        fx="wordslide"
        intro={schools.intro}
        trail={[{ name: labels.crumbs.home, path: "/" }, { name: labels.crumbs.schools, path: "/for-schools" }]}
        slot="S1"
      />

      <Section id="tracks" tone="surface">
        <SectionHeading id="tracks-title" fx="wordslide">{T.tracks}</SectionHeading>
        <div className="mt-8">
          <Tracks tracks={schools.tracks} />
        </div>
      </Section>

      <Section id="why" tone="paper">
        <SectionHeading id="why-title" fx="wordslide">{labels.common.whyUs}</SectionHeading>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {why.points.map((p) => (
            <li key={p.title} className="rounded-[var(--radius-panel)] bg-surface p-5">
              <p className="font-bold">{p.title}</p>
              <p className="text-small text-muted">{p.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand title={T.cta.title} text={T.cta.text} message={messages.schools} />
    </>
  );
}
