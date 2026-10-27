import type { PageKey, PageSeo } from "./types";

/** PLAN.md §6, verbatim. `title` is the final document title. */
export const seo: Record<PageKey, PageSeo> = {
  home: {
    path: "/",
    title: "Phonics Classes in Ambernath | Tr. Revathi Phonics",
    description:
      "Phonics, English and coaching classes in Ambernath East & West with an Internationally Certified Jolly Phonics Trainer. 20+ years, 4,500+ students.",
    keyword: "phonics classes in Ambernath",
  },
  about: {
    path: "/about",
    title: "Trainer Revathi, Jolly Phonics Trainer in Ambernath",
    description:
      "Meet Trainer Revathi Varier: Internationally Certified Jolly Phonics Trainer (CPD College UK), M.A. English, D.El.Ed, ECCEd, teaching phonics since 2001.",
    keyword: "Jolly Phonics trainer Ambernath",
  },
  programs: {
    path: "/programs",
    title: "Jolly Phonics, Grammar & English Classes, Ambernath",
    description:
      "Jolly Phonics, Jolly Grammar, reading, spoken English and handwriting classes in Ambernath, taught by an Internationally Certified Jolly Phonics Trainer.",
    keyword: "Jolly Phonics classes Ambernath",
  },
  coaching: {
    path: "/coaching",
    title: "Tuition Classes in Ambernath, Sr. KG to Std. 8",
    description:
      "Coaching and tuition for Sr. KG to Std. 8 in Ambernath East & West, focused on understanding concepts and building confidence.",
    keyword: "tuition classes Ambernath East",
  },
  "teacher-training": {
    path: "/teacher-training",
    title: "Phonics, ECCEd & Montessori Teacher Training, Ambernath",
    description:
      "Phonics, ECCEd and Montessori teacher training in Ambernath by an Internationally Certified Jolly Phonics Trainer with 20+ years in education.",
    keyword: "teacher training Ambernath",
  },
  "for-schools": {
    path: "/for-schools",
    title: "Phonics Workshops for Schools | Tr. Revathi Phonics",
    description:
      "Phonics workshops and teacher training for schools: sessions for teachers, students and parents by an Internationally Certified Jolly Phonics Trainer.",
    keyword: "phonics workshop for schools Ambernath",
  },
  gallery: {
    path: "/gallery",
    title: "Gallery | Tr. Revathi Phonics",
    description:
      "Phonics classes, teacher training, workshops and student activities at Tr. Revathi Phonics, Ambernath.",
    keyword: "Tr. Revathi Phonics Ambernath",
  },
  contact: {
    path: "/contact",
    title: "Contact & Branches in Ambernath | Tr. Revathi Phonics",
    description:
      "Call or WhatsApp 9022582988. Branches in Ambernath East and Ambernath West. Admissions and enquiries open.",
    keyword: "phonics classes near me Ambernath",
  },
};
