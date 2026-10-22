import Link from "next/link";
import { messages } from "@/content/messages";
import { schools } from "@/content/schools";
import { teacherTraining } from "@/content/teacher-training";
import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import { PHONICS_TILES } from "@/components/blocks/PhonicsAccent";
import { Panel } from "@/components/layout/Panel";
import { SectionHeading } from "@/components/layout/Section";
import { Stagger } from "@/components/motion/Reveal";

const AUDIENCES = [
  {
    title: "For teachers",
    text: `${teacherTraining.phonics.title}, ${teacherTraining.ecced.title} and ${teacherTraining.montessori.title}.`,
    href: "/teacher-training",
    linkLabel: "Teacher training",
    message: messages.teacherTraining,
    /** Paper card, ink type; its tile is the logo's blue "s". */
    card: "bg-paper text-ink [--focus:var(--color-ink)]",
    tile: { ch: "T", ...PHONICS_TILES[6] },
  },
  {
    title: "For schools",
    text: schools.intro,
    href: "/for-schools",
    linkLabel: "Workshops for schools",
    message: messages.schools,
    /** Red card on the ink band (white type, 4.9:1); its tile is the logo's yellow "i". */
    card: "on-dark bg-red text-paper",
    tile: { ch: "S", ...PHONICS_TILES[4] },
  },
] as const;

/** The page's one ink band: the two secondary audiences as two distinct doors. */
export function AudienceTeasers() {
  return (
    <Panel id="audiences" tone="ink">
      <div className="mx-auto grid max-w-[var(--content-max)] gap-10 px-[var(--gutter)] py-[var(--section-gap)]">
        <SectionHeading id="audiences-title">Teachers and schools</SectionHeading>
        <Stagger className="grid gap-4 md:grid-cols-2 md:gap-6">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="grid">
              <article className={`lift relative grid content-start gap-4 overflow-clip rounded-[var(--radius-panel)] p-7 sm:p-10 ${a.card}`}>
                <span
                  aria-hidden="true"
                  className="grid size-16 place-items-center rounded-[0.9rem] font-display text-[2.5rem] leading-none font-extrabold sm:size-20 sm:text-[3rem]"
                  style={{ background: a.tile.bg, color: a.tile.fg }}
                >
                  <span className="translate-y-[0.06em]">{a.tile.ch}</span>
                </span>
                <h3 className="text-lead">{a.title}</h3>
                <p className="max-w-[44ch]">{a.text}</p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
                  <Link href={a.href} className="cta cta-call cta-primary">
                    {a.linkLabel}
                  </Link>
                  <WhatsAppLink message={a.message} variant="inline">
                    Ask on WhatsApp
                  </WhatsAppLink>
                </div>
              </article>
            </div>
          ))}
        </Stagger>
      </div>
    </Panel>
  );
}
