import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
  href: string;
  variant?: "primary" | "secondary" | "inline";
  className?: string;
  children: ReactNode;
}

/** Internal navigation styled as the site's one button shape. WhatsApp/Call use WhatsAppLink/CallLink. */
export function ButtonLink({ href, variant = "secondary", className = "", children }: Props) {
  const tone = variant === "primary" ? "cta-call" : "";
  return (
    <Link href={href} className={`cta cta-${variant} ${tone} ${className}`.trim()}>
      {children}
    </Link>
  );
}
