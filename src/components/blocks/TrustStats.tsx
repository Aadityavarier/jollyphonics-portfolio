import { brand } from "@/content/brand";

const STATS = [
  { figure: `${brand.numbers.years}`, label: "years in education" },
  { figure: brand.numbers.students, label: "students trained" },
  { figure: brand.numbers.since, label: "started teaching Jolly Phonics" },
] as const;

/** The three founder numbers from content.md, exactly as written there. */
export function TrustStats({ className = "" }: { className?: string }) {
  return (
    <dl className={`grid grid-cols-3 gap-3 ${className}`.trim()}>
      {STATS.map((s) => (
        <div key={s.label} className="flex flex-col-reverse gap-0.5">
          <dt className="text-small leading-snug text-muted">{s.label}</dt>
          <dd className="font-display text-[clamp(1.75rem,1.2rem+2.4vw,3rem)] leading-none font-bold">{s.figure}</dd>
        </div>
      ))}
    </dl>
  );
}
