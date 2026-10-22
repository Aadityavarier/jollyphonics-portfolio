import Link from "next/link";
import { messages } from "@/content/messages";
import { schools } from "@/content/schools";
import { teacherTraining } from "@/content/teacher-training";
import { WhatsAppLink } from "@/components/contact/WhatsAppLink";

const AUDIENCES = [
  {
    title: "For teachers",
    text: `${teacherTraining.phonics.title}, ${teacherTraining.ecced.title} and ${teacherTraining.montessori.title}.`,
    href: "/teacher-training",
    linkLabel: "Teacher training",
    message: messages.teacherTraining,
  },
  {
    title: "For schools",
    text: schools.intro,
    href: "/for-schools",
    linkLabel: "Workshops for schools",
    message: messages.schools,
  },
] as const;

/** The page's one ink band: the two secondary audiences side by side. */
export function AudienceTeasers() {
  return (
    <section id="audiences" aria-labelledby="audiences-title" className="on-dark bg-ink text-paper">
      <div className="mx-auto grid max-w-[var(--content-max)] gap-10 px-[var(--gutter)] py-[var(--section-gap)]">
        <h2 id="audiences-title" className="text-head">
          Teachers and schools
        </h2>
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="grid content-start gap-4">
              <h3 className="text-lead">{a.title}</h3>
              <p className="max-w-[44ch]">{a.text}</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
                <Link href={a.href} className="cta cta-secondary">
                  {a.linkLabel}
                </Link>
                <WhatsAppLink message={a.message} variant="inline">
                  Ask on WhatsApp
                </WhatsAppLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
