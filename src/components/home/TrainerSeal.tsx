import { useId } from "react";
import { brand } from "@/content/brand";
import { founder } from "@/content/founder";
import { RevealTarget } from "@/components/motion/RevealTarget";

/** "INTERNATIONALLY CERTIFIED … TRAINER • CPD COLLEGE UK, LONDON •": the credential from content.md, set on a ring. */
const RING = `${founder.credential.replace(" — ", " • ")} •`.toUpperCase();
const [FIRST, ...LAST] = founder.knownAs.split(" ");

/**
 * Our own typographic stamp for the credential (no Jolly or CPD logo). It presses in once on scroll-in, then rests.
 * The SVG is decorative; the credential is real text beside it in the section.
 */
export function TrainerSeal({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <RevealTarget as="div" attr="data-reveal" value="stamp" className={className} aria-hidden>
      <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false" className="seal block h-auto w-full text-paper">
        <defs>
          <path id={`${id}-ring`} d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" />
        </defs>
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 5" strokeLinecap="round" />
        <text fill="currentColor" fontFamily="var(--font-display)" fontWeight="700" fontSize="12.5">
          <textPath href={`#${id}-ring`} textLength="458" lengthAdjust="spacing">
            {RING}
          </textPath>
        </text>
        <text x="100" y="92" textAnchor="middle" fill="currentColor" fontFamily="var(--font-display)" fontWeight="800" fontSize="22">
          {FIRST}
        </text>
        <text x="100" y="114" textAnchor="middle" fill="currentColor" fontFamily="var(--font-display)" fontWeight="800" fontSize="22">
          {LAST.join(" ")}
        </text>
        <text x="100" y="136" textAnchor="middle" fill="currentColor" fontFamily="var(--font-body)" fontWeight="600" fontSize="11">
          since {brand.numbers.since}
        </text>
      </svg>
    </RevealTarget>
  );
}
