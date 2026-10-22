import { todo } from "./todo";

/** Logo shown site-wide. The PNG is the client's original; "/images/logo/logo.svg" is the redraw (approval pending). */
export const LOGO_SRC = "/images/logo/logo-original.png";

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
