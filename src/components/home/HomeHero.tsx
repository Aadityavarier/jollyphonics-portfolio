import type { CSSProperties } from "react";
import Image from "next/image";
import { brand } from "@/content/brand";
import { contact } from "@/content/contact";
import { founder } from "@/content/founder";
import { home } from "@/content/home";
import { imageSlots } from "@/content/images";
import { messages } from "@/content/messages";
import { showTodos } from "@/lib/env";
import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import { CallLink } from "@/components/contact/CallLink";
import { TrustStats } from "@/components/blocks/TrustStats";
import { CredentialLine } from "@/components/blocks/CredentialLine";
import { ImageSlot } from "@/components/blocks/ImageSlot";
import { Magnetic } from "@/components/motion/Magnetic";
import { HeroTiles } from "./HeroTiles";

/** Entrance order (ms after first paint): headline words, sub-line, tiles, Trainer Revathi, numbers, WhatsApp last. */
const AT = { subline: 260, tiles: 320, founder: 380, stats: 460, cta: 720, status: 820, panel: 120 } as const;
const at = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/**
 * Above the fold on a 375×667 phone: h1, sub-line, sound tiles, Trainer Revathi + credential, the three
 * numbers, WhatsApp. Desktop: the portrait (slot H1) on the right; until it exists, a red field of
 * living sound tiles stands in. The entrance is pure CSS (motion.css), so it starts at first paint.
 */
export function HomeHero() {
  const portrait = imageSlots.H1.photo;
  const words = home.hero.title.split(" ");

  return (
    <section id="hero" aria-labelledby="hero-title" className="bg-paper">
      <div className="mx-auto grid max-w-[var(--content-max)] gap-5 px-[var(--gutter)] pt-4 pb-[var(--section-gap)] md:gap-x-16 md:gap-y-8 md:pt-8 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:pb-16">
        <h1 id="hero-title" className="type-display text-ink lg:col-start-1 lg:row-start-1 lg:max-w-[16ch]">
          {words.map((w, i) => (
            <span key={i}>
              <span className="enter-word" style={{ "--w": i } as CSSProperties}>
                <span>{w}</span>
              </span>
              {i < words.length - 1 && " "}
            </span>
          ))}
        </h1>
        <div className="grid content-start gap-5 md:gap-7 lg:col-start-1 lg:row-start-2">
          <p className="enter max-w-[34ch] text-lead" style={at(AT.subline)}>
            {home.hero.subline}
          </p>
          <div className="enter text-[1.875rem] sm:text-[2.5rem] lg:hidden" style={at(AT.tiles)}>
            <HeroTiles text="Phonics" />
          </div>
          <div className="enter flex items-center gap-3" style={at(AT.founder)}>
            {portrait && (
              <Image
                src={portrait.src}
                alt=""
                width={56}
                height={56}
                className="size-14 shrink-0 rounded-full object-cover md:hidden"
              />
            )}
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

        <div className="hidden lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:block">
          {portrait ? (
            <ImageSlot id="H1" sizes="(min-width: 1024px) 45vw, 100vw" preload className="rounded-[var(--radius-panel)]" />
          ) : (
            <div
              className="enter relative isolate grid h-full min-h-[18rem] place-items-center overflow-hidden rounded-[var(--radius-panel)] p-10"
              style={at(AT.panel)}
            >
              <span aria-hidden="true" className="grain absolute inset-0 -z-10 bg-red" />
              <HeroTiles text="Phonics" className="text-[clamp(2.25rem,3.6vw,3.5rem)]" />
              {showTodos() && (
                <span data-todo="photo-H1" className="todo-marker absolute bottom-4 left-4">
                  TODO: portrait H1 goes here
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
