import type { Metadata } from "next";
import Image from "next/image";
import { PhonicsAccent } from "@/components/blocks/PhonicsAccent";
import { CtaBand } from "@/components/blocks/CtaBand";
import { ImageSlot } from "@/components/blocks/ImageSlot";
import { ButtonLink } from "@/components/blocks/ButtonLink";
import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import { CallLink } from "@/components/contact/CallLink";
import { BranchList } from "@/components/contact/BranchList";
import { messages } from "@/content/messages";
import { FxHeading, type Fx } from "@/components/motion/FxHeading";
import { FlipCard } from "@/components/motion/FlipCard";
import { TypeOut } from "@/components/motion/TypeOut";
import { StrokeDraw } from "@/components/motion/StrokeDraw";
import { LayoutTabs } from "@/components/motion/LayoutTabs";
import { CountUp } from "@/components/motion/CountUp";
import { FanPile } from "@/components/motion/FanPile";
import { ReadAloud } from "@/components/motion/ReadAloud";
import { TileProgress } from "@/components/motion/TileProgress";
import { MorphDemo } from "./MorphDemo";

const FX: Fx[] = ["stroke", "soundout", "tileflip", "wipe", "wordslide", "lightup"];

export const metadata: Metadata = {
  title: "Styleguide | Tr. Revathi Phonics",
  robots: { index: false, follow: false },
};

function luminance(hex: string) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = c.map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((hi + 0.05) / (lo + 0.05)).toFixed(1);
}

const COLOURS = [
  { name: "paper", hex: "#ffffff", text: "#16204a", role: "Page ground" },
  { name: "surface", hex: "#eef5f2", text: "#16204a", role: "Tone step: cards, tiles" },
  { name: "ink", hex: "#16204a", text: "#ffffff", role: "Text; at most one band per page" },
  { name: "muted", hex: "#4a5170", text: "#ffffff", role: "Secondary text" },
  { name: "red", hex: "#e3001b", text: "#ffffff", role: "Large flat panels, CTA bands" },
  { name: "teal", hex: "#0e6e5d", text: "#ffffff", role: "Large flat panels, CTA bands" },
  { name: "action", hex: "#1db33a", text: "#16204a", role: "WhatsApp only" },
  { name: "calm", hex: "#e9eef5", text: "#2f3a5c", role: "ARPAN section" },
];
const LETTERS = [
  ["P", "#f80000"],
  ["h", "#f87000"],
  ["o", "#00b8e8"],
  ["n", "#f80098"],
  ["i", "#f8b000"],
  ["c", "#10b800"],
  ["s", "#1848a0"],
];
const TYPE = [
  { token: "display", sample: "Confident readers", note: "Baloo 2 800 · 48–120px · hero only" },
  { token: "head", sample: "Is it right for my child?", note: "Baloo 2 700 · 36–72px · section headings" },
  { token: "lead", sample: "Vadavali", note: "Baloo 2 700 (card titles) or Mukta · 20–26px" },
  { token: "body", sample: "Knowing letter names is different from knowing the sounds letters make.", note: "Mukta 400 · 17–19px · leading 1.55" },
  { token: "small", sample: "Jolly Phonics and Jolly Grammar are trademarks of Jolly Learning Ltd.", note: "Mukta 400 · 14px" },
];
const TYPE_CLASS: Record<string, string> = {
  display: "type-display",
  head: "text-head font-display font-bold",
  lead: "text-lead font-display font-bold",
  body: "text-body",
  small: "text-small",
};
const SPACE = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128];

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="mx-auto max-w-[var(--content-max)] px-[var(--gutter)] py-14">
      <h2 id={`${id}-h`} className="mb-8 text-head">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <>
      <header className="mx-auto max-w-[var(--content-max)] px-[var(--gutter)] pt-10">
        <h1 className="type-display mt-10">Styleguide</h1>
        <p className="mt-4 max-w-[52ch] text-lead">
          Tokens and shared components for the Tr. Revathi Phonics site. Not indexed, not in the navigation.
        </p>
      </header>

      <Block id="colour" title="Colour">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COLOURS.map((c) => (
            <li key={c.name} className="overflow-hidden rounded-[var(--radius-panel)] bg-surface">
              <div className="grid aspect-[4/3] content-end p-4" style={{ background: c.hex, color: c.text }}>
                <span className="font-display text-lead font-bold">Aa</span>
              </div>
              <div className="p-4 text-small">
                <p className="font-bold">{c.name}</p>
                <p>{c.hex}</p>
                <p>{c.role}</p>
                <p>
                  Text {contrast(c.hex, c.text)}:1 · on paper {contrast(c.hex, "#ffffff")}:1
                </p>
              </div>
            </li>
          ))}
        </ul>
        <h3 className="mt-12 mb-4 text-lead">Letter colours (motif only)</h3>
        <ul className="flex flex-wrap gap-3">
          {LETTERS.map(([l, hex]) => (
            <li key={l} className="text-small">
              <span className="mb-2 grid size-16 place-items-center rounded-2xl font-display text-head font-bold text-paper" style={{ background: hex }}>
                {l}
              </span>
              {hex}
            </li>
          ))}
        </ul>
      </Block>

      <Block id="type" title="Type">
        <p className="mb-8 max-w-[60ch]">
          Baloo 2 for headings and Mukta for text, both by Ek Type, Mumbai, both with Devanagari. Five sizes only.
        </p>
        <ul className="grid gap-8">
          {TYPE.map((t) => (
            <li key={t.token} className="grid gap-2 md:grid-cols-[10rem_1fr] md:items-baseline">
              <span className="text-small text-muted">
                {t.token}
                <br />
                {t.note}
              </span>
              <span className={TYPE_CLASS[t.token]}>
                {t.sample}
              </span>
            </li>
          ))}
        </ul>
      </Block>

      <Block id="balance" title="Colour balance">
        <p className="mb-8 max-w-[60ch]">
          Red and teal carry the large flat panels and the closing bands. Ink is for text, and for at most one band
          on a page. The letter colours appear only as sound tiles.
        </p>
        <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
          <div className="on-dark grid min-h-64 content-end rounded-[var(--radius-panel)] bg-red p-8 text-paper">
            <p className="text-head font-display font-bold">Red panel</p>
            <p>Main brand field: statements, the closing band.</p>
          </div>
          <div className="on-dark grid min-h-64 content-end rounded-[var(--radius-panel)] bg-teal p-8 text-paper">
            <p className="text-head font-display font-bold">Teal</p>
            <p>Second field, alternating with red.</p>
          </div>
          <div className="grid min-h-40 content-end rounded-[var(--radius-panel)] bg-surface p-8">
            <p className="text-lead font-display font-bold">Surface</p>
            <p>Cards and tiles on paper.</p>
          </div>
          <div className="on-dark grid min-h-40 content-end rounded-[var(--radius-panel)] bg-ink p-8 text-paper">
            <p className="text-lead font-display font-bold">Ink band</p>
            <p>Once per page at most.</p>
          </div>
        </div>
      </Block>

      <Block id="space" title="Spacing and radius">
        <ul className="grid gap-2">
          {SPACE.map((s) => (
            <li key={s} className="flex items-center gap-4 text-small">
              <span className="w-12 text-muted">{s}px</span>
              <span className="h-4 rounded-full bg-teal" style={{ width: s * 2 }} />
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-6 text-small">
          <div className="grid size-40 content-end rounded-[var(--radius-panel)] bg-surface p-4">Panel radius 28px</div>
          <div className="grid h-14 place-items-center rounded-full bg-surface px-6">Buttons: fully round</div>
        </div>
        <p className="mt-6 max-w-[60ch] text-small text-muted">
          Page margins 20–32px. Sections 72–160px apart. No borders or shadows on resting elements; surfaces differ by one tone step.
        </p>
      </Block>

      <Block id="logo" title="Logo">
        <div className="grid gap-6 md:grid-cols-2">
          <figure className="grid gap-3">
            <div className="grid place-items-center rounded-[var(--radius-panel)] bg-surface p-8">
              <Image src="/images/logo/logo.svg" alt="Tr. Revathi Phonics logo, SVG redraw" width={560} height={210} unoptimized className="h-auto w-full max-w-[28rem]" />
            </div>
            <figcaption className="text-small">SVG redraw, text as outlines (in use; approval pending)</figcaption>
          </figure>
          <figure className="grid gap-3">
            <div className="grid place-items-center rounded-[var(--radius-panel)] bg-surface p-8">
              <Image src="/images/logo/logo-original.png" alt="Tr. Revathi Phonics logo, client's original" width={561} height={206} className="h-auto w-full max-w-[28rem]" />
            </div>
            <figcaption className="text-small">Client&apos;s original PNG (fallback: one line in src/content/brand.ts)</figcaption>
          </figure>
        </div>
      </Block>

      <Block id="motif" title="Sound tiles">
        <p className="mb-8 max-w-[60ch]">
          The logo&apos;s seven letter colours, used as phonics flash cards. Used sparingly: the <span className="whitespace-nowrap">c–a–t</span> blend, and the footer mark.
        </p>
        <div className="grid gap-8">
          <PhonicsAccent text="c a t" start={5} className="text-display" />
          <PhonicsAccent text="Phonics" className="text-head" />
          <p className="text-head font-display font-bold">
            <PhonicsAccent text="Phonics" variant="letters" />
          </p>
        </div>
      </Block>

      <Block id="buttons" title="Buttons">
        <div className="flex flex-wrap items-center gap-4">
          <WhatsAppLink message={messages.general} variant="primary" />
          <CallLink variant="primary" />
          <WhatsAppLink message={messages.general} variant="secondary">
            WhatsApp this branch
          </WhatsAppLink>
          <CallLink variant="secondary" />
          <ButtonLink href="/styleguide#buttons">See all programs</ButtonLink>
          <WhatsAppLink message={messages.general} variant="inline">
            Ask on WhatsApp
          </WhatsAppLink>
        </div>
        <p className="mt-8 mb-3 text-small text-muted">On red and teal panels, WhatsApp turns white and Call turns ink.</p>
        <div className="on-dark flex flex-wrap items-center gap-4 rounded-[var(--radius-panel)] bg-red p-8">
          <WhatsAppLink message={messages.general} variant="primary" />
          <CallLink variant="secondary" />
        </div>
        <div className="on-dark mt-3 flex flex-wrap items-center gap-4 rounded-[var(--radius-panel)] bg-teal p-8">
          <WhatsAppLink message={messages.general} variant="primary" />
          <CallLink variant="secondary" />
        </div>
      </Block>

      <Block id="branches" title="Branches">
        <BranchList headingLevel={3} />
        <h3 className="mt-12 mb-4 text-lead">With tap-to-load map (contact page)</h3>
        <BranchList headingLevel={3} withMap />
      </Block>

      <Block id="images" title="Image slots">
        <p className="mb-8 max-w-[60ch]">Missing photos show this placeholder in development and nothing at all in production.</p>
        <div className="grid gap-4 sm:grid-cols-[1fr_1.5fr]">
          <ImageSlot id="H1" sizes="(min-width: 640px) 40vw, 100vw" className="rounded-[var(--radius-panel)]" />
          <ImageSlot id="H7" sizes="(min-width: 640px) 60vw, 100vw" className="rounded-[var(--radius-panel)]" />
        </div>
      </Block>

      <CtaBand
        id="cta-demo-teal"
        tone="teal"
        title="Training for teachers who want to teach phonics"
        text="Phonics teacher training, ECCEd and Montessori teacher training in Ambernath."
        message={messages.teacherTraining}
      />
      <CtaBand
        id="cta-demo"
        title="Ask about a batch near you"
        text="For admissions, batch timings, course details, teacher training and school workshops, please contact us."
        message={messages.general}
      />

      <Block id="motion-toolkit" title="Motion toolkit">
        <p className="mb-8 max-w-[60ch]">Heading treatments (one per page, never repeated between neighbours), and the demo primitives.</p>
        <div className="grid gap-12">
          {FX.map((fx) => (
            <FxHeading key={fx} fx={fx} className="text-head">
              {`Sounding ${fx}`}
            </FxHeading>
          ))}
        </div>
        <div className="mt-16 grid gap-10 sm:grid-cols-2">
          <FlipCard
            className="rounded-[var(--radius-panel)] bg-surface p-6"
            front={<span className="font-display text-head font-bold text-red">2023</span>}
            back={<span className="font-bold">Business Entrepreneur Award</span>}
          />
          <p className="text-lead">
            <TypeOut text="Reading, writing, speaking, comprehension." />
          </p>
          <StrokeDraw
            viewBox="0 0 200 120"
            className="max-w-xs text-red"
            guides={["M0 20H200", "M0 60H200", "M0 100H200"]}
            paths={["M120 40 C 70 30, 30 60, 50 85 C 70 105, 115 85, 120 40 L 122 100"]}
            label="The letter a being written between guide lines"
          />
          <LayoutTabs
            label="Example tabs"
            tabs={[
              { id: "a", label: "First", panel: <p>First panel</p> },
              { id: "b", label: "Second", panel: <p>Second panel</p> },
              { id: "c", label: "Third", panel: <p>Third panel</p> },
            ]}
          />
          <p className="font-display text-head font-bold">
            <CountUp value="4,500+" />
          </p>
          <ReadAloud text="Every learner deserves the right foundation to learn with confidence." className="text-lead" />
          <FanPile className="grid grid-cols-3 gap-3 sm:col-span-2">
            {["M.A.", "M.Com", "D.El.Ed"].map((q) => (
              <li key={q} className="rounded-[var(--radius-panel)] bg-surface p-4 font-display font-bold">
                {q}
              </li>
            ))}
          </FanPile>
          <MorphDemo />
        </div>
        <p className="mt-8 text-small text-muted">Tile progress is the row of small tiles fixed under the header; it lights up as this page scrolls.</p>
        <TileProgress />
      </Block>

      <Block id="sticky" title="Sticky contact bar">
        <p className="max-w-[60ch]">Phones only: fixed to the bottom of every page (visible below at 375px). Hidden from 768px up.</p>
      </Block>
    </>
  );
}
