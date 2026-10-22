"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/content/nav";

interface Props {
  items: NavItem[];
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
}

export function NavLinks({ items, className = "", linkClassName = "", onNavigate }: Props) {
  const pathname = usePathname();
  return (
    <ul className={className}>
      {items.map((item) => {
        const current = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              onClick={onNavigate}
              className={`${linkClassName} ${current ? "underline decoration-red decoration-[3px] underline-offset-8" : ""}`.trim()}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
