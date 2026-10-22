import { coaching } from "./coaching";

/** Home-page headings. Facts come from the other content files; these are only the page's own words. */
export const home = {
  hero: {
    /** Keeps "Ambernath" for local search; 2–3 lines on a 375px phone (approved at STOP B). */
    title: "Phonics & English classes in Ambernath",
    /** Coaching moves out of the h1 to the line below it. */
    subline: `Coaching classes from ${coaching.range}, and teacher training.`,
  },
  learningPath: {
    title: "The learning path",
  },
} as const;
