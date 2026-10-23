"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { armReveal } from "./reveal-engine";

interface Props {
  as?: ElementType;
  /** Attribute that selects the CSS treatment: data-reveal or data-stagger. */
  attr: "data-reveal" | "data-stagger";
  value: string;
  className?: string;
  id?: string;
  "aria-hidden"?: true;
  "data-load"?: string;
  "data-failsafe"?: number;
  children?: ReactNode;
}

/** A hydrated leaf that reveals itself. It only ever writes attributes on its own node, after hydration. */
export function RevealTarget({ as: Tag = "div", attr, value, children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => (ref.current ? armReveal(ref.current) : undefined), []);
  const Component = Tag as ElementType;
  return (
    <Component ref={ref} {...{ [attr]: value }} {...rest}>
      {children}
    </Component>
  );
}
