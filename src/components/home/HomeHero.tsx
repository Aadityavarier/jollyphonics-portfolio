import type { CSSProperties } from "react";
import Image from "next/image";
import { brand } from "@/content/brand";
import { contact } from "@/content/contact";
import { founder } from "@/content/founder";
import { home } from "@/content/home";
import { imageSlots } from "@/content/images";
import { messages } from "@/content/messages";
import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import { CallLink } from "@/components/contact/CallLink";
import { TrustStats } from "@/components/blocks/TrustStats";
import { CredentialLine } from "@/components/blocks/CredentialLine";
import { TileWord } from "@/components/blocks/TileWord";
import { Magnetic } from "@/components/motion/Magnetic";
import { WordBoard } from "./WordBoard";

/** Entrance order (ms after first paint): sub-line, Trainer Revathi, numbers, WhatsApp last. */
const AT = { subline: 260, founder: 380, stats: 460, cta: 720, status: 820, panel: 120 } as const;
const at = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/**
 * Above the fold on a 375×667 phone and a 1366×610 laptop viewport: h1 (its first word set as sound tiles),
 * sub-line, Trainer Revathi + credential, the three numbers, WhatsApp. The word board sits beside it on desktop
 * and just under the fold on phones. The entrance is pure CSS (motion.css), so it starts at first paint.
 */
export function HomeHero() {
  const portrait = imageSlots.H1.photo;
  const [first, ...rest] = home.hero.title.split(" ");
  const tileWord = home.hero.tileWord;
  // "Phonics & English …": the tile word replaces the first word; the other words keep their rise.
  const restWords = first === tileWord ? rest : home.hero.title.split(" ");

  return (
    <section id="hero" aria-labelledby="hero-title" className="bg-paper">
      <div className="mx-auto grid max-w-[var(--content-max)] gap-5 px-[var(--gutter)] pt-4 pb-[var(--section-gap)] md:gap-x-16 md:gap-y-8 md:pt-8 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-y-4 lg:pt-4 lg:pb-14">
        <h1 id="hero-title" className="type-display text-ink lg:col-start-1 lg:row-start-1 lg:max-w-[18ch] lg:[--text-display:clamp(2.75rem,4.2vw,4.5rem)]">
          {first === tileWord && (
            <>
              <TileWord text={tileWord} inline />
              {" "}
            </>
          )}
          {restWords.map((w, i) => (
            <span key={i}>
              <span className="enter-word" style={{ "--w": i } as CSSProperties}>
                <span>{w}</span>
              </span>
              {i < restWords.length - 1 && " "}
            </span>
          ))}
        </h1>
        <div className="grid content-start gap-5 lg:col-start-1 lg:row-start-2 lg:gap-3">
          <p className="enter max-w-[34ch] text-lead lg:max-w-none" style={at(AT.subline)}>
            {home.hero.subline}
          </p>
          <div className="enter flex items-center gap-3" style={at(AT.founder)}>
            {portrait && <Image src={portrait.src} alt="" width={56} height={56} className="size-14 shrink-0 rounded-full object-cover" />}
            <div className="grid gap-0.5">
              <p className="font-display text-lead leading-tight font-bold">{founder.knownAs}</p>
              <CredentialLine className="text-small md:text-body" />
            </div>
          </div>
          <div className="enter" style={at(AT.stats)}>
            <TrustStats animated delayMs={AT.stats} className="max-w-[36rem]" />
          </div>
          <div className="enter grid gap-3 sm:flex sm:flex-wrap sm:items-center" style={at(AT.cta)}>
            <span data-hero-cta className="contents">
              <Magnetic className="w-full sm:w-auto">
                <WhatsAppLink message={messages.general} variant="primary" className="w-full sm:w-auto" />
              </Magnetic>
            </span>
            <CallLink variant="secondary" className="hidden sm:inline-flex" />
          </div>
          <p className="enter text-small text-muted" style={at(AT.status)}>
            {contact.status}. {brand.subTagline}
          </p>
        </div>

        <div
          className="enter on-dark relative isolate grid place-items-center overflow-hidden rounded-[var(--radius-panel)] p-6 sm:p-10 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:min-h-[22rem]"
          style={at(AT.panel)}
        >
          <span aria-hidden="true" className="grain absolute inset-0 -z-10 bg-red" />
          <WordBoard />
        </div>
      </div>
    </section>
  );
}
