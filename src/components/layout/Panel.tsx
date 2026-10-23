import type { ReactNode } from "react";
import { RevealTarget } from "@/components/motion/RevealTarget";
import { DecorTiles, type DecorLayout } from "@/components/blocks/DecorTiles";

export type PanelTone = "red" | "teal" | "ink";

const TONE: Record<PanelTone, string> = {
  red: "bg-red",
  teal: "bg-teal",
  ink: "bg-ink",
};

interface Props {
  id: string;
  tone: PanelTone;
  labelledBy?: string;
  /** Large faint sound tiles bleeding off the edges. Home uses these on at most 2–3 sections. */
  decor?: DecorLayout;
  className?: string;
  children: ReactNode;
}

/**
 * A full-bleed colour field. The colour sits on its own grained layer that opens from a slightly inset
 * field to full bleed as it scrolls in (transform only; it is always opaque, so text is never on paper).
 */
export function Panel({ id, tone, labelledBy, decor, className = "", children }: Props) {
  return (
    <section id={id} aria-labelledby={labelledBy ?? `${id}-title`} className={`on-dark relative isolate overflow-clip text-paper ${className}`.trim()}>
      <RevealTarget as="span" attr="data-reveal" value="panel" aria-hidden className={`grain absolute inset-0 -z-10 ${TONE[tone]}`} />
      {decor && <DecorTiles layout={decor} />}
      {children}
    </section>
  );
}
