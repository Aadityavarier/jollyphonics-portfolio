import { pageMetadata } from "@/lib/metadata";
import { schools } from "@/content/schools";
import { why } from "@/content/why";
import { messages } from "@/content/messages";
import { PageHero } from "@/components/blocks/PageHero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { Tracks } from "@/components/schools/Tracks";

export const metadata = pageMetadata("for-schools");

export default function ForSchoolsPage() {
  return (
    <>
      <PageHero
        title="For Schools"
        intro={schools.intro}
        trail={[{ name: "Home", path: "/" }, { name: "For Schools", path: "/for-schools" }]}
        slot="S1"
      />

      <Section id="tracks" tone="surface">
        <SectionHeading id="tracks-title">What a workshop covers</SectionHeading>
        <div className="mt-8">
          <Tracks tracks={schools.tracks} />
        </div>
      </Section>

      <Section id="why" tone="paper">
        <SectionHeading id="why-title">Why Tr. Revathi</SectionHeading>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {why.points.map((p) => (
            <li key={p.title} className="rounded-[var(--radius-panel)] bg-surface p-5">
              <p className="font-bold">{p.title}</p>
              <p className="text-small text-muted">{p.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand title="Book a school workshop" text="Tell us about your school on WhatsApp." message={messages.schools} />
    </>
  );
}
