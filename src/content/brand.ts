import { todo } from "./todo";

/**
 * Logo shown site-wide: the SVG redraw (client approval pending, todo:logo-approval).
 * Fallback to the client's original: "/images/logo/logo-original.png" with LOGO_SIZE 561×206.
 */
export const LOGO_SRC = "/images/logo/logo.svg";

/** Intrinsic size of the logo file in LOGO_SRC (SVG: 560×210, PNG: 561×206). */
export const LOGO_SIZE = { width: 560, height: 210 } as const;

export const brand = {
  name: "Tr. Revathi Phonics",
  fullName: "Tr. Revathi Phonics & Coaching Classes",
  tagline: "Teach • Guide • Transform",
  subTagline: "Building Strong Foundations. Creating Confident Readers. Empowering Educators.",
  secondaryLine: "Follow • Learn • Grow With Us",
  programsStrip: [
    "Jolly Phonics",
    "Jolly Grammar",
    "English",
    "Coaching Classes",
    "Teacher Training",
    "ECCEd",
    "Montessori",
    "Handwriting",
    "Reading & Spoken English",
  ],
  numbers: { years: "20+", students: "4,500+", since: "2001" },
  trademarkNote: "Jolly Phonics and Jolly Grammar are trademarks of Jolly Learning Ltd.",
  logoTodo: todo("logo-approval", "Client approval for the SVG logo redraw, or the original high-resolution logo (content.md Q10)."),
} as const;
