interface Props {
  items: readonly string[];
  /** "surface" on paper; "paper" on a surface or coloured panel. */
  tone?: "surface" | "paper";
  className?: string;
}

export function ChipList({ items, tone = "surface", className = "" }: Props) {
  const bg = tone === "surface" ? "bg-surface" : "bg-paper text-ink";
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`.trim()}>
      {items.map((item) => (
        <li key={item} className={`rounded-full px-3.5 py-1.5 text-small font-medium ${bg}`}>
          {item}
        </li>
      ))}
    </ul>
  );
}
