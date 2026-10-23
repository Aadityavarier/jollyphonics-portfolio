import { pageMetadata } from "@/lib/metadata";
import { faqByQuestion } from "@/content/faq";
import { contact } from "@/content/contact";
import { messages } from "@/content/messages";
import { Section, SectionHeading } from "@/components/layout/Section";
import { FaqAccordion } from "@/components/blocks/FaqAccordion";
import { CtaBand } from "@/components/blocks/CtaBand";
import { HomeHero } from "@/components/home/HomeHero";
import { WhyPhonics } from "@/components/home/WhyPhonics";
import { LearningPathScene } from "@/components/home/LearningPathScene";
import { home } from "@/content/home";
import { programs } from "@/content/programs";
import { WhoIsItFor } from "@/components/home/WhoIsItFor";
import { HomeBranches } from "@/components/home/HomeBranches";
import { FounderIntro } from "@/components/home/FounderIntro";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Showcase } from "@/components/home/Showcase";
import { GalleryPreview } from "@/components/home/GalleryPreview";

export const metadata = pageMetadata("home");

const HOME_FAQ = faqByQuestion(
  "What age can children start phonics?",
  "Is phonics only for small children?",
  "Do you teach adults?",
  "Where are classes held?",
  "Do you provide academic coaching?",
);

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <WhyPhonics />
      <LearningPathScene
        title={home.learningPath.title}
        steps={programs.phonics.learningPath}
        detail={programs.phonics.learningPathDetail}
      />
      <FounderIntro />
      <WhoIsItFor />
      <Showcase />
      <HomeBranches />
      <WhyChooseUs />
      <GalleryPreview />
      <Section id="faq">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <SectionHeading id="faq-title" className="lg:sticky lg:top-8 lg:self-start">
            Questions parents ask
          </SectionHeading>
          <FaqAccordion items={HOME_FAQ} group="home-faq" />
        </div>
      </Section>
      <CtaBand
        title="Ask about a batch near you"
        text={contact.line}
        message={messages.general}
        tone="red"
        decor="edge"
      />
    </>
  );
}
