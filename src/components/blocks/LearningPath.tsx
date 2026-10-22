/** An ordered sequence (e.g. Hear → Recognise → Blend → Read → Spell → Write). */
export function LearningPath({ steps, className = "" }: { steps: readonly string[]; className?: string }) {
  return (
    <ol className={`flex flex-wrap items-center gap-x-1 gap-y-2 ${className}`.trim()}>
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-1">
          <span className="rounded-full bg-paper px-3.5 py-1.5 font-display font-bold text-ink">{step}</span>
          {i < steps.length - 1 && (
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 opacity-70" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          )}
        </li>
      ))}
    </ol>
  );
}
