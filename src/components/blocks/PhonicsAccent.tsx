/**
 * The logo's "Phonics" letter colours, used as a motif: letters on sound tiles, like phonics flash cards.
 * Colours cycle in logo order (P h o n i c s); each tile's letter colour keeps large-text contrast.
 */
const TILES = [
  { bg: "var(--color-letter-p)", fg: "#ffffff" },
  { bg: "var(--color-letter-h)", fg: "var(--color-ink)" },
  { bg: "var(--color-letter-o)", fg: "var(--color-ink)" },
  { bg: "var(--color-letter-n)", fg: "#ffffff" },
  { bg: "var(--color-letter-i)", fg: "var(--color-ink)" },
  { bg: "var(--color-letter-c)", fg: "var(--color-ink)" },
  { bg: "var(--color-letter-s)", fg: "#ffffff" },
] as const;

interface Props {
  text: string;
  variant?: "tiles" | "letters";
  /** Index into the logo colour sequence for the first letter. */
  start?: number;
  className?: string;
}

export function PhonicsAccent({ text, variant = "tiles", start = 0, className = "" }: Props) {
  let i = start;
  const chars = Array.from(text).map((ch, k) => {
    if (ch.trim() === "") return <span key={k} className="inline-block w-[0.3em]" />;
    const tile = TILES[i++ % TILES.length];
    return variant === "tiles" ? (
      <span
        key={k}
        className="inline-grid size-[1.35em] place-items-center rounded-[0.24em] font-display font-bold leading-none"
        style={{ background: tile.bg, color: tile.fg }}
      >
        <span className="translate-y-[0.06em]">{ch}</span>
      </span>
    ) : (
      <span key={k} style={{ color: tile.bg }}>
        {ch}
      </span>
    );
  });

  return (
    <span className={`inline-flex flex-wrap items-center gap-[0.12em] ${className}`.trim()}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="contents">
        {chars}
      </span>
    </span>
  );
}
