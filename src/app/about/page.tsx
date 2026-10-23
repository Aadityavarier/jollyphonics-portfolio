import { pageMetadata } from "@/lib/metadata";
import { founder } from "@/content/founder";
import { vision } from "@/content/vision";
import { messages } from "@/content/messages";
import { PageHero } from "@/components/blocks/PageHero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { TrustStats } from "@/components/blocks/TrustStats";
import { CredentialLine } from "@/components/blocks/CredentialLine";
import { ChipList } from "@/components/blocks/ChipList";
import { CtaBand } from "@/components/blocks/CtaBand";
import { Stagger } from "@/components/motion/Reveal";
import { FanPile } from "@/components/motion/FanPile";
import { FlipCard } from "@/components/motion/FlipCard";
import { ReadAloud } from "@/components/motion/ReadAloud";
import { TileProgress } from "@/components/motion/TileProgress";
import { PathJourney } from "@/components/about/PathJourney";
import { JsonLd } from "@/components/blocks/JsonLd";
import { personGraph } from "@/lib/jsonld";
import { journey } from "@/content/journey";

export const metadata = pageMetadata("about");

export default function AboutPage() {
  return (
    <>
      <JsonLd data={personGraph()} />
      <TileProgress />
      <PageHero title={founder.knownAs} fx="stroke" trail={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]} slot="A1">
        <CredentialLine />
        <TrustStats animated />
      </PageHero>

      <Section id="bio" tone="surface">
        <div className="grid gap-6 lg:max-w-[70ch]">
          <SectionHeading id="bio-title" fx="stroke">Her story</SectionHeading>
          {founder.bio.map((p) => (
            <p key={p} className="text-lead">
              {p}
            </p>
          ))}
          <blockquote className="max-w-[30ch] font-display text-[clamp(1.5rem,1.2rem+1.4vw,2.25rem)] leading-tight font-bold">
            <ReadAloud text={`“${founder.belief}”`} />
          </blockquote>
        </div>
      </Section>

      <PathJourney title="Her journey" milestones={journey} />

      <Section id="qualifications" tone="paper">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="grid content-start gap-5">
            <SectionHeading id="qualifications-title" fx="stroke">Qualifications</SectionHeading>
            <FanPile className="grid gap-3 sm:grid-cols-2">
              {founder.qualifications.map((q) => (
                <li key={q.title} className="cert grid content-start gap-1 rounded-[1rem] border-2 border-ink/15 bg-paper p-4 shadow-[0_10px_24px_-16px_rgba(22,32,74,0.4)]">
                  <span className="cert-seal" aria-hidden="true" />
                  <span className="font-display text-lead leading-none font-bold">{q.title}</span>
                  <span className="text-small text-muted">{q.detail}</span>
                </li>
              ))}
            </FanPile>
          </div>
          <div className="grid content-start gap-5">
            <h2 className="text-lead">Certifications</h2>
            <Stagger as="ul" className="grid gap-2">
              {founder.certifications.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </Stagger>
          </div>
        </div>
      </Section>

      <Section id="worked-with" tone="surface">
        <SectionHeading id="worked-with-title" fx="stroke">Has worked with</SectionHeading>
        <ChipList items={founder.workedWith} tone="paper" className="mt-5" />
      </Section>

      <Section id="awards" tone="paper">
        <SectionHeading id="awards-title" fx="stroke">{"Awards & recognition"}</SectionHeading>
        <ul className="mt-6 grid gap-5 sm:grid-cols-3">
          {founder.awards.map((a, i) => (
            <li key={a.name}>
              <FlipCard
                label={`${a.name}, ${a.year}`}
                delay={i * 220}
                className="award rounded-[var(--radius-panel)] bg-surface p-6"
                front={
                  <>
                    <span aria-hidden="true" className="award-medal" />
                    <span className="font-display text-[clamp(2.5rem,2rem+3vw,4rem)] leading-none font-bold text-red">{a.year}</span>
                  </>
                }
                back={
                  <>
                    <span className="font-display text-lead leading-tight font-bold">{a.name}</span>
                    <span className="text-small text-muted">{a.detail}</span>
                    <span className="font-bold text-red">{a.year}</span>
                  </>
                }
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="community" tone="teal">
        <SectionHeading id="community-title" fx="stroke" className="text-paper">
          {"Community & leadership"}
        </SectionHeading>
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="grid content-start gap-3">
            <h3 className="text-lead">{founder.community.innerWheel.org}</h3>
            <p className="max-w-[48ch]">
              {founder.community.innerWheel.roles.map((r) => `${r.role} ${r.period}`).join(" · ")}
            </p>
          </div>
          <div className="grid content-start gap-3">
            <h3 className="text-lead">{founder.community.rotary}</h3>
            <p className="max-w-[48ch]">{founder.community.initiatives}</p>
          </div>
        </div>
      </Section>

      <Section id="vision" tone="paper">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="grid content-start gap-3">
            <SectionHeading id="vision-title" fx="stroke">Vision</SectionHeading>
            <p className="text-lead">
              {vision.vision.lead} {vision.vision.outcomes.join(", ")}, {vision.vision.teachers}
            </p>
          </div>
          <div className="grid content-start gap-3">
            <h2 className="text-lead">Mission</h2>
            <p>{vision.mission.text}</p>
            <ChipList items={vision.mission.focusAreas} />
            <p className="text-small text-muted">{vision.mission.educators}</p>
          </div>
        </div>
        <Stagger as="ul" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {vision.coreValues.map((v) => (
            <li key={v.title} className="grid gap-1 rounded-[var(--radius-panel)] bg-surface p-5">
              <span className="font-bold">{v.title}</span>
              <span className="text-small text-muted">{v.text}</span>
            </li>
          ))}
        </Stagger>
      </Section>

      <CtaBand
        title="Meet Trainer Revathi in person"
        text="Visit a branch, or ask a question on WhatsApp."
        message={messages.about}
      />
    </>
  );
}
