import { todo } from "./todo";
import type { FaqItem } from "./types";

export const faq: FaqItem[] = [
  {
    q: "What age can children start phonics?",
    a: "Phonics can be introduced in the early years, adapted to the child's age and stage.",
    todo: todo("phonics-age", "Exact starting age for phonics (content.md Q5)."),
  },
  {
    q: "Is phonics only for small children?",
    a: "No — it also helps older students and adults with reading, spelling, pronunciation and English.",
  },
  {
    q: "Do you teach adults?",
    a: "Yes — adults, parents, homemakers and others improving reading, spelling, grammar or communication.",
  },
  {
    q: "Do you train teachers?",
    a: "Yes — phonics teacher training and early childhood education programs.",
  },
  {
    q: "Do you provide academic coaching?",
    a: "Yes — Sr. KG to Std. 8.",
  },
  {
    q: "Where are classes held?",
    a: "Ambernath East and Ambernath West (see branches).",
  },
  {
    q: "Do you conduct school workshops?",
    a: "Yes — phonics workshops and teacher-training sessions for schools and institutions.",
  },
];

export function faqByQuestion(...questions: string[]): FaqItem[] {
  return questions.map((q) => {
    const item = faq.find((f) => f.q === q);
    if (!item) throw new Error(`Unknown FAQ question: ${q}`);
    return item;
  });
}
