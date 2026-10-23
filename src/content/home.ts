import { coaching } from "./coaching";

/** Home-page headings. Facts come from the other content files; these are only the page's own words. */
export const home = {
  hero: {
    /** Keeps "Ambernath" for local search; 2–3 lines on a 375px phone (approved at STOP B). */
    title: "Phonics & English classes in Ambernath",
    /** Set as sound tiles inside the h1 (the plain word stays for screen readers and search). */
    tileWord: "Phonics",
    /** Coaching moves out of the h1 to the line below it. */
    subline: `Coaching classes from ${coaching.range}, and teacher training.`,
  },
  /** The hero word board: tap sounds to build a word. Illustrative UI words, not facts (approved). Short, familiar three-letter words only. */
  board: {
    letters: ["c", "a", "t", "s", "p", "n", "i"],
    words: ["cat", "sat", "pat", "tap", "nap", "pan", "can", "tan", "ant", "pin", "tin", "sip", "nip", "tip", "pit", "sit"],
    example: "cat",
    prompt: "Your turn: tap a sound",
    title: "Build a word",
  },
  learningPath: {
    title: "The learning path",
  },
} as const;
