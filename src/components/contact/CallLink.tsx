import type { ReactNode } from "react";
import { contact } from "@/content/contact";
import { telHref } from "@/lib/contact";
import type { LinkVariant } from "./WhatsAppLink";

interface Props {
  variant?: LinkVariant;
  className?: string;
  children?: ReactNode;
}

export function PhoneIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

export function CallLink({ variant = "secondary", className = "", children = `Call ${contact.phoneDisplay}` }: Props) {
  return (
    <a href={telHref()} data-variant={variant} className={`cta cta-call cta-${variant} ${className}`.trim()}>
      {variant !== "inline" && <PhoneIcon />}
      <span>{children}</span>
    </a>
  );
}
