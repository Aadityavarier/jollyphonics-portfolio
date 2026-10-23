import Link from "next/link";
import { founder } from "@/content/founder";
import { imageSlots } from "@/content/images";
import { ImageSlot } from "@/components/blocks/ImageSlot";
import { ButtonLink } from "@/components/blocks/ButtonLink";
import { ChipList } from "@/components/blocks/ChipList";
import { CredentialLine } from "@/components/blocks/CredentialLine";
import { Panel } from "@/components/layout/Panel";
import { SectionHeading } from "@/components/layout/Section";
import { Reveal, Stagger } from "@/components/motion/Reveal";
import { JourneyTeaser } from "./JourneyTeaser";
import { TrainerSeal } from "./TrainerSeal";
import { labels } from "@/content/labels";

/**
 * Teal panel: the trust moment. Her credential as a stamp (overlapping the portrait's corner once the photo
 * exists), her belief, a four-stop teaser of her journey, the three awards and her qualifications.
 */
export function FounderIntro() {
  const photo = Boolean(imageSlots.H1.photo);

  return (
    <Panel id="founder" tone="teal">
      <div className="mx-auto grid max-w-[var(--content-max)] gap-12 px-[var(--gutter)] py-[var(--section-gap)] lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div className="grid content-start gap-6">
          <div className="relative w-fit max-w-full">
            {photo && <ImageSlot id="H1" sizes="(min-width: 1024px) 36vw, 70vw" className="w-[min(100%,22rem)] rounded-[var(--radius-panel)]" />}
            <TrainerSeal className={photo ? "absolute -right-6 -bottom-10 w-36 sm:w-44" : "w-44 sm:w-52"} />
          </div>
          <SectionHeading id="founder-title" className={`max-w-none ${photo ? "mt-8" : ""}`.trim()}>
            {labels.home.founder.meet} {founder.knownAs}
          </SectionHeading>
          <CredentialLine className="text-lead [&_svg]:text-paper" />
          <p className="max-w-[56ch]">{founder.bio[0]}</p>
          <Reveal as="blockquote" className="max-w-[30ch] font-display text-[clamp(1.5rem,1.2rem+1.4vw,2.25rem)] leading-tight font-bold">
            <p>{`“${founder.belief}”`}</p>
          </Reveal>
        </div>

        <div className="grid content-start gap-8">
          <div className="grid gap-4">
            <h3 className="text-lead">{labels.home.founder.journey}</h3>
            <JourneyTeaser />
            <Link href="/about" className="link-u justify-self-start">
              {labels.home.founder.fullJourney}
            </Link>
          </div>
          <div className="grid gap-3">
            <h3 className="text-lead">{labels.home.founder.awards}</h3>
            <Stagger as="ul" className="grid gap-3">
              {founder.awards.map((a) => (
                <li key={a.name} className="grid grid-cols-[3.5rem_1fr] gap-3">
                  <span className="font-display text-lead font-bold">{a.year}</span>
                  <span>
                    <span className="font-bold">{a.name}</span>
                    <br />
                    {a.detail}
                  </span>
                </li>
              ))}
            </Stagger>
          </div>
          <div className="grid gap-3">
            <h3 className="text-lead">{labels.home.founder.qualifications}</h3>
            <ChipList items={founder.qualifications.map((q) => q.title)} tone="paper" />
          </div>
          <ButtonLink href="/about" className="justify-self-start">
            {labels.home.founder.about}
          </ButtonLink>
        </div>
      </div>
    </Panel>
  );
}
