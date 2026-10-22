"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/content/nav";
import { NavLinks } from "./NavLinks";

/** Menu toggle + drop-down panel below the header bar. Escape closes and returns focus to the toggle. */
export function MobileNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  // The menu belongs to the page it was opened on, so navigating closes it without an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (next: boolean) => setOpenOn(next ? pathname : null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenOn(null);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
        className="grid h-11 min-w-11 place-items-center rounded-full bg-surface px-4 font-display text-[1.0625rem] font-bold"
      >
        {open ? "Close" : "Menu"}
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full z-30 bg-paper px-[var(--gutter)] pt-2 pb-8 shadow-[0_12px_24px_rgba(22,32,74,0.12)]"
      >
        <NavLinks
          items={items}
          onNavigate={() => setOpen(false)}
          className="grid"
          linkClassName="block py-3 font-display text-lead font-bold"
        />
      </div>
    </>
  );
}
