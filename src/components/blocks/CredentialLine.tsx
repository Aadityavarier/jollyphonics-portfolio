import { founder } from "@/content/founder";

function BadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-teal" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="6" />
      <path d="m9 14.5-1.5 7L12 19l4.5 2.5-1.5-7" />
    </svg>
  );
}

/** "Internationally Certified Jolly Phonics Trainer — CPD College UK, London" */
export function CredentialLine({ className = "" }: { className?: string }) {
  return (
    <p className={`flex items-start gap-2 font-medium ${className}`.trim()}>
      <BadgeIcon />
      <span>{founder.credential}</span>
    </p>
  );
}
