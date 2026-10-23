import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { faqByQuestion } from "@/content/faq";
import { Section, SectionHeading } from "@/components/layout/Section";
import { FaqAccordion } from "@/components/blocks/FaqAccordion";
import { HomeHero } from "@/components/home/HomeHero";
import { WhyPhonics } from "@/components/home/WhyPhonics";
import { LearningPathScene } from "@/components/home/LearningPathScene";
import { home } from "@/content/home";
import { programs } from "@/content/programs";
import { WhoIsItFor } from "@/components/home/WhoIsItFor";
import { HomeBranches } from "@/components/home/HomeBranches";
import { FounderIntro } from "@/components/home/FounderIntro";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { HelloCta } from "@/components/home/HelloCta";
import { Showcase } from "@/components/home/Showcase";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { labels } from "@/content/labels";
import { Testimonials } from "@/components/home/Testimonials";

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
      <Testimonials />
      <GalleryPreview />
      <Section id="faq">
        <div className="mx-auto grid max-w-[48rem] gap-8">
          <SectionHeading id="faq-title">{labels.common.questionsParentsAsk}</SectionHeading>
          <FaqAccordion items={HOME_FAQ} group="home-faq" />
          <Link href="/contact#faq" className="link-u justify-self-start">
            {labels.home.faq.more}
          </Link>
        </div>
      </Section>
      <HelloCta />
    </>
  );
}
