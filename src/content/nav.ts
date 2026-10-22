import type { PageKey } from "./types";

export interface NavItem {
  key: PageKey;
  label: string;
  href: string;
}

export const nav: NavItem[] = [
  { key: "about", label: "About", href: "/about" },
  { key: "programs", label: "Programs", href: "/programs" },
  { key: "coaching", label: "Coaching", href: "/coaching" },
  { key: "teacher-training", label: "Teacher Training", href: "/teacher-training" },
  { key: "for-schools", label: "For Schools", href: "/for-schools" },
  { key: "gallery", label: "Gallery", href: "/gallery" },
  { key: "contact", label: "Contact", href: "/contact" },
];
