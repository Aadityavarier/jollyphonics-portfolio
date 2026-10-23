import type { CSSProperties } from "react";
import { PHONICS_TILES } from "@/components/blocks/PhonicsAccent";
import { coachingSteps } from "@/content/coaching";
import { schools } from "@/content/schools";

/** Small CSS-only miniatures of the demos on the pages they link to. Server markup; motion lives in home-showcase.css. */

const COLS = 7;
const ROWS = 6;

export function SoundWallPreview() {
  const cx = (COLS - 1) / 2;
  const cy = (ROWS - 1) / 2;
  return (
    <div data-preview aria-hidden="true" className="sc-wall">
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const c = i % COLS;
        const r = Math.floor(i / COLS);
        const d = Math.round(Math.hypot(c - cx, r - cy) * 60);
        return <i key={i} data-sound style={{ "--d": `${d}ms`, background: PHONICS_TILES[(c + r) % PHONICS_TILES.length].bg } as CSSProperties} />;
      })}
    </div>
  );
}

const SENTENCE = [
  { text: "The", pos: undefined },
  { text: "dog", pos: "noun" },
  { text: "runs", pos: "verb" },
  { text: "fast", pos: "adverb" },
] as const;
/** Visual slot each word starts in while jumbled (the DOM order stays the sentence). */
const JUMBLE = [2, 0, 3, 1];
const POS_COLOUR = { noun: "var(--color-letter-o)", verb: "var(--color-letter-p)", adverb: "var(--color-letter-c)" } as const;

export function SentencePreview() {
  return (
    <div data-preview aria-hidden="true" className="sc-sentence">
      {SENTENCE.map((w, i) => (
        <span
          key={w.text}
          data-word
          className="sc-word"
          style={{ "--j": JUMBLE[i] - i, "--i": i, "--pos": w.pos ? POS_COLOUR[w.pos] : "transparent" } as CSSProperties}
        >
          {w.text}
        </span>
      ))}
    </div>
  );
}

export function BubblePreview({ text }: { text: string }) {
  return (
    <div data-preview aria-hidden="true" className="sc-bubble-wrap">
      <div className="sc-bubble">
        <span className="sc-type">{text}</span>
      </div>
      <span className="sc-waves">
        {[0, 1, 2, 3, 4].map((i) => (
          <i key={i} style={{ "--i": i } as CSSProperties} />
        ))}
      </span>
    </div>
  );
}

const A = {
  bowl: "M38 62 A18 18 0 1 0 2 62 A18 18 0 1 0 38 62",
  stem: "M38 44 L38 80",
};

export function HandwritingPreview() {
  return (
    <svg data-preview aria-hidden="true" focusable="false" viewBox="0 0 40 90" className="sc-hand">
      <path d="M0 8H40M0 44H40M0 80H40" className="sc-guide" />
      {[A.bowl, A.stem].map((d, i) => (
        <path key={i} d={d} pathLength={1} className="sc-stroke" style={{ "--i": i } as CSSProperties} />
      ))}
    </svg>
  );
}

export function StaircasePreview() {
  return (
    <div data-preview aria-hidden="true" className="sc-stairs">
      {coachingSteps.map((s, i) => (
        <i key={s} style={{ "--k": i } as CSSProperties} />
      ))}
      <b className="sc-climber" />
    </div>
  );
}

export function StackPreview({ labels }: { labels: readonly string[] }) {
  return (
    <div data-preview aria-hidden="true" className="sc-stack">
      {labels.map((l, i) => (
        <span key={l} style={{ "--k": i } as CSSProperties}>
          {l}
        </span>
      ))}
    </div>
  );
}

export function TabsPreview() {
  const tabs = schools.tracks.map((t) => t.audience.replace("For ", ""));
  return (
    <div data-preview aria-hidden="true" className="sc-tabs">
      <div className="sc-tab-row">
        <span className="sc-indicator" />
        {tabs.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <span className="sc-line" />
      <span className="sc-line sc-line-short" />
    </div>
  );
}
