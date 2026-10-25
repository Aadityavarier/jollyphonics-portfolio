import { founder } from "./founder";
import type { TitledText } from "./types";

export const why = {
  points: [
    { title: "Experience", text: "20+ years in education" },
    { title: "Expertise", text: "Internationally Certified Jolly Phonics Trainer" },
    { title: "Reach", text: "4,500+ students trained" },
    { title: "Qualifications", text: founder.qualifications.map((q) => (q.title === "M.A." ? `M.A. ${q.detail}` : q.title)).join(", ") },
    { title: "Practical knowledge", text: "Years of classroom teaching and teacher training" },
    { title: "Holistic approach", text: "Reading, writing, grammar, communication, confidence" },
    { title: "Teacher empowerment", text: "Programs for educators and aspiring teachers" },
    { title: "Personal attention", text: "Individual learning needs" },
  ] satisfies TitledText[],
  whoWeServe: [
    "Children",
    "Students",
    "Parents",
    "Adults",
    "Teachers",
    "Educators",
    "Preschool Teachers",
    "Schools",
    "Homemakers",
  ],
};
