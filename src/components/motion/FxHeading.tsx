import { Fragment, type CSSProperties, type ElementType } from "react";
import { RevealTarget } from "./RevealTarget";

export type Fx = "stroke" | "soundout" | "tileflip" | "wipe" | "wordslide" | "lightup";

const LETTER_COLOURS = ["#f80000", "#f87000", "#00b8e8", "#f80098", "#f8b000", "#10b800", "#1848a0"];

interface Props {
  as?: "h1" | "h2" | "h3" | "span";
  fx: Fx;
  id?: string;
  className?: string;
  /** Plays at first paint (above-the-fold heading) instead of when scrolled into view. */
  load?: boolean;
  children: string;
}

type Var = CSSProperties & Record<`--${string}`, string | number>;

/**
 * A heading with a phonics-flavoured entrance. The accessible name is one plain-text span; the split
 * pieces are aria-hidden decoration. Fully visible in server HTML and under reduced motion.
 */
export function FxHeading({ as: Tag = "h2", fx, id, className = "", load, children }: Props) {
  const text = children;
  const words = text.split(" ");
  const letterCount = text.replace(/ /g, "").length;
  const step = Math.max(14, Math.min(55, Math.floor(600 / Math.max(1, letterCount))));
  let li = 0;
  let body;
  if (fx === "stroke") {
    body = <span className="fx-text">{text}</span>;
  } else if (fx === "wipe") {
    body = <span className="fx-p">{text}</span>;
  } else if (fx === "wordslide") {
    body = words.map((w, i) => (
      <Fragment key={i}>
        <span className="fx-w">
          <span className="fx-p" style={{ "--i": i, "--step": "70ms" } as Var}>
            {w}
          </span>
        </span>{" "}
      </Fragment>
    ));
  } else {
    const mid = (letterCount - 1) / 2;
    body = words.map((w, wi) => (
      <Fragment key={wi}>
      <span className="fx-w">
        {Array.from(w).map((ch, ci) => {
          const i = li++;
          const c = LETTER_COLOURS[i % LETTER_COLOURS.length];
          return (
            <span
              key={ci}
              className="fx-p"
              data-c={ch}
              style={{ "--i": i, "--step": `${step}ms`, "--n": letterCount, "--sp": `${((i - mid) * 0.32).toFixed(2)}em`, "--tc": c } as Var}
            >
              {ch}
            </span>
          );
        })}
      </span>{" "}
      </Fragment>
    ));
  }
  return (
    <RevealTarget as={Tag as ElementType} attr="data-reveal" value={`fx-${fx}`} id={id} className={className} {...(load ? { "data-load": "" } : {})}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="fx-wrap">
        {body}
        {fx === "stroke" && (
          <svg className="fx-line" viewBox="0 0 200 12" preserveAspectRatio="none" focusable="false">
            <path pathLength="1" d="M2 8 C 34 2, 62 11, 98 6 S 168 3, 198 7" />
          </svg>
        )}
      </span>
    </RevealTarget>
  );
}
