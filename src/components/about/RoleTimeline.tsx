"use client";

import { useEffect, useRef } from "react";
import { loadGsap, whenNear } from "@/components/motion/gsap";
import { prefersReducedMotion } from "@/components/motion/tokens";

interface Role {
  role: string;
  period: string;
}

interface Props {
  org: string;
  roles: readonly Role[];
}

/** Inner Wheel roles, 2017 → 2024–25: a line draws down the timeline as each role reveals in turn. */
export function RoleTimeline({ org, roles }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    let cancelled = false;

    const stop = whenNear(el, async () => {
      const { gsap } = await loadGsap();
      if (cancelled) return;
      const items = gsap.utils.toArray<HTMLElement>(".role-item", el);
      items.forEach((item, i) => {
        gsap.from(item, {
          x: -24,
          opacity: 0,
          duration: 0.6,
          ease: "expo.out",
          scrollTrigger: { trigger: item, start: "top 85%", once: true },
          delay: i * 0.05,
        });
      });
      gsap.fromTo(
        el.querySelector(".role-line"),
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 70%", scrub: 0.4 },
        },
      );
    });

    return () => {
      cancelled = true;
      stop();
    };
  }, []);

  return (
    <div ref={root} className="grid gap-4">
      <h3 className="text-lead">{org}</h3>
      <ol className="relative grid gap-5 pl-8">
        <span aria-hidden="true" className="role-line absolute top-1 bottom-1 left-2 w-1 origin-top rounded-full bg-red" />
        {roles.map((r) => (
          <li key={r.role} className="role-item relative">
            <span aria-hidden="true" className="absolute top-1.5 -left-6 size-3 rounded-full bg-red" />
            <p className="font-display text-lead leading-tight font-bold">{r.role}</p>
            <p className="text-small text-muted">{r.period}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
