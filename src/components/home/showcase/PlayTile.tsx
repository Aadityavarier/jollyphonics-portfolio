"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { usePlayInView } from "@/components/motion/usePlayInView";

interface Props {
  href: string;
  className: string;
  children: ReactNode;
}

/** One bento tile: a plain link whose miniature plays while the tile is at least half in view and rests off screen. */
export function PlayTile({ href, className, children }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  usePlayInView(ref, { threshold: 0.5 });
  return (
    <Link ref={ref} href={href} data-showcase-tile className={className}>
      {children}
    </Link>
  );
}
