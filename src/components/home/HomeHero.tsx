import Image from "next/image";
import { brand } from "@/content/brand";
import { contact } from "@/content/contact";
import { founder } from "@/content/founder";
import { imageSlots } from "@/content/images";
import { messages } from "@/content/messages";
import { showTodos } from "@/lib/env";
import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import { CallLink } from "@/components/contact/CallLink";
import { TrustStats } from "@/components/blocks/TrustStats";
import { CredentialLine } from "@/components/blocks/CredentialLine";
import { PhonicsAccent } from "@/components/blocks/PhonicsAccent";
import { ImageSlot } from "@/components/blocks/ImageSlot";

/**
 * Above the fold on a 375×667 phone: h1, Trainer Revathi + credential, the three numbers, WhatsApp.
 * Desktop: the portrait (slot H1) on the right; until it exists, a red field of sound tiles stands in.
 */
export function HomeHero() {
  const portrait = imageSlots.H1.photo;

  return (
    <section id="hero" aria-labelledby="hero-title" className="bg-paper">
      <div className="mx-auto grid max-w-[var(--content-max)] gap-5 px-[var(--gutter)] pt-4 pb-[var(--section-gap)] md:gap-x-16 md:gap-y-10 md:pt-10 lg:grid-cols-[1.15fr_1fr]">
        <h1 id="hero-title" className="type-display text-ink lg:col-span-2 lg:max-w-[20ch]">
          Phonics, English &amp; coaching classes in Ambernath
        </h1>
        <div className="grid content-start gap-5 md:gap-7">
          <div className="flex items-center gap-3">
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
          <TrustStats className="max-w-[36rem]" />
          <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center">
            <span data-hero-cta className="contents">
              <WhatsAppLink message={messages.general} variant="primary" className="w-full sm:w-auto" />
            </span>
            <CallLink variant="secondary" className="hidden sm:inline-flex" />
          </div>
          <p className="text-small text-muted">
            {contact.status}. {brand.subTagline}
          </p>
        </div>

        <div className="hidden lg:block">
          {portrait ? (
            <ImageSlot id="H1" sizes="(min-width: 1024px) 45vw, 100vw" preload className="rounded-[var(--radius-panel)]" />
          ) : (
            <div className="relative grid h-full min-h-[22rem] place-items-center overflow-hidden rounded-[var(--radius-panel)] bg-red p-10">
              <PhonicsAccent text="Phonics" className="flex-nowrap justify-center text-[clamp(1.75rem,3vw,2.75rem)]" />
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
