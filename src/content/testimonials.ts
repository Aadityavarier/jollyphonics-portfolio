/**
 * Real testimonials only, in the parent's or student's own words, with their permission (content.md Q7).
 * The Home section stays hidden while this list is empty and appears on its own once one entry is added.
 *
 * Example entry:
 *   { quote: "…", name: "Priya S.", context: "Parent, Jolly Phonics, Ambernath East" }
 */
export interface Testimonial {
  quote: string;
  name: string;
  /** Who they are, e.g. "Parent, Jolly Phonics" or "Teacher, Phonics TT". */
  context?: string;
}

export const testimonials: Testimonial[] = [];
