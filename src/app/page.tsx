import { pageMetadata } from "@/lib/metadata";
import { faqByQuestion } from "@/content/faq";
import { FaqSection } from "@/components/blocks/FaqSection";
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
      <FaqSection items={HOME_FAQ} group="home-faq" more />
      <HelloCta />
    </>
  );
}
