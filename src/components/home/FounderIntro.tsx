import { founder } from "@/content/founder";
import { imageSlots } from "@/content/images";
import { ImageSlot } from "@/components/blocks/ImageSlot";
import { ButtonLink } from "@/components/blocks/ButtonLink";

/** Teal panel: who Trainer Revathi is, in her own belief, qualifications and awards. */
export function FounderIntro() {
  const photo = Boolean(imageSlots.H7.photo);

  return (
    <section id="founder" aria-labelledby="founder-title" className="on-dark bg-teal text-paper">
      <div className="mx-auto grid max-w-[var(--content-max)] gap-12 px-[var(--gutter)] py-[var(--section-gap)] lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="grid content-start gap-6">
          <h2 id="founder-title" className="text-head">
            Meet {founder.knownAs}
          </h2>
          <p className="text-lead">{founder.bio[0]}</p>
          <p className="max-w-[56ch]">{founder.bio[1]}</p>
          <blockquote className="max-w-[30ch] font-display text-[clamp(1.5rem,1.2rem+1.4vw,2.25rem)] leading-tight font-bold">
            <p>&ldquo;{founder.belief}&rdquo;</p>
          </blockquote>
          <ButtonLink href="/about" className="justify-self-start">
            About Trainer Revathi
          </ButtonLink>
        </div>

        <div className="grid content-start gap-8">
          {photo && <ImageSlot id="H7" sizes="(min-width: 1024px) 40vw, 100vw" className="rounded-[var(--radius-panel)]" />}
          <div className="grid gap-3">
            <h3 className="text-lead">Qualifications</h3>
            <ul className="grid gap-2">
              {founder.qualifications.map((q) => (
                <li key={q.title} className="flex flex-wrap gap-x-2">
                  <span className="font-bold">{q.title}</span>
                  <span className="opacity-90">{q.detail}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-3">
            <h3 className="text-lead">Awards &amp; recognition</h3>
            <ul className="grid gap-3">
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
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
