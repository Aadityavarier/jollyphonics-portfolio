export interface Certification {
  id: string;
  name: string;
  detail?: string;
  /** When she trained, exactly as content.md writes it. */
  trained?: readonly string[];
}

export interface Award {
  id: string;
  name: string;
  detail: string;
  year: string;
  /** Exact date, when content.md gives one. */
  date?: string;
  note?: string;
  /** Show it as a stop on the About journey (stops in the same year share one stop). */
  journey?: boolean;
}

export interface Role {
  id: string;
  role: string;
  period: string;
  journey?: boolean;
}

export const founder = {
  fullName: "Revathi Raghunath Varier",
  knownAs: "Trainer Revathi",
  role: "Founder, Tr. Revathi Phonics & Coaching Classes",
  titleLine: ["Educationist", "Entrepreneur", "Internationally Certified Jolly Phonics Trainer", "Community Leader"],
  founded: "2023",
  credential: "Internationally Certified Jolly Phonics Trainer — CPD College UK, London",
  belief: "Every learner deserves the right foundation to learn with confidence.",
  vision:
    "Passionate about creating strong foundations in English language learning and empowering learners through effective teaching methodologies.",
  bio: [
    "Experienced educator, phonics trainer, teacher trainer and education entrepreneur with 20+ years in education.",
    "Founder of Tr. Revathi Phonics & Coaching Classes, established in 2023.",
    "Teaching Jolly Phonics since 2001 across Ambernath and Ulhasnagar, helping children build reading, writing, spelling, pronunciation and English skills through systematic phonics.",
    "Has worked with children of different ages and learning levels, plus parents, teachers and educators.",
  ],
  qualifications: [
    { title: "M.A.", detail: "English" },
    { title: "M.Com", detail: "Master of Commerce" },
    { title: "D.El.Ed", detail: "Diploma in Elementary Education (secured 70%)" },
    {
      title: "ECCEd / DECCED",
      detail: "Diploma in Early Childhood Care, Education & Development, ITES Board (one-year, secured 73%)",
    },
  ],
  certifications: [
    { id: "jolly-phonics", name: "Internationally Certified Jolly Phonics Trainer", detail: "CPD College UK, London" },
    // A certification only: Rapid Teacher's Training is a separate organisation, never a program here.
    { id: "rapid-ecced", name: "Rapid Teacher's Training for ECCEd" },
    {
      id: "cpd",
      name: "Teacher-training and professional-development programs in early childhood education and classroom practice",
    },
  ] satisfies readonly Certification[],
  expertise: [
    "Jolly Phonics & Jolly Grammar",
    "Jolly English",
    "English Reading, Writing & Spelling",
    "English Speaking",
    "English Grammar",
    "Handwriting Improvement",
    "Tuition & Coaching Classes",
    "ECCEd Teacher Training",
    "Drawing & Art",
    "Vedic Mathematics",
    "Olympiad Preparation",
    "Scholarship Drawing",
  ],
  workedWith: [
    "Preschool children",
    "Kindergarten",
    "Primary school children",
    "School students",
    "Teenagers",
    "Adults",
    "Parents",
    "Teachers",
    "Educators",
    "Early childhood educators",
  ],
  /** Newest first. */
  awards: [
    {
      id: "innovative-teaching",
      name: "Innovative Teaching Award",
      detail: "India Preschool Products Expo 2026 Conference, Nehru Centre, Worli, Mumbai",
      year: "2026",
      date: "8 October 2026",
      note: "For her dedication and contributions to education",
      journey: true,
    },
    {
      id: "rovex",
      name: "ROVEX Award – SHAKTI",
      detail: "Honoured among 61 Remarkable Women",
      year: "2025",
      date: "9 October 2025",
      journey: true,
    },
    {
      id: "nation-builder",
      name: "Nation Builder Award",
      detail: "Rotary Club of Ambernath North (RCAN)",
      year: "2025",
      note: "For her contribution to education",
      journey: true,
    },
    { id: "business", name: "Business Entrepreneur Award", detail: "India News Index, City Excellence Award", year: "2023", journey: true },
  ] satisfies readonly Award[],
  community: {
    innerWheel: {
      org: "Inner Wheel Club of Ambernath",
      roles: [
        { id: "member", role: "Member", period: "since 2017", journey: true },
        { id: "correspondent", role: "Club Correspondent", period: "2022–23" },
        { id: "centurion-secretary", role: "Centurion Secretary", period: "2023–24" },
        { id: "president", role: "President", period: "2024–25", journey: true },
        { id: "ipp", role: "IPP (Immediate Past President)", period: "2025–26" },
      ] satisfies readonly Role[],
    },
    rotary: { role: "Rotarian", org: "Rotary Club of Ambernath East" },
    roles: [
      { role: "Project Coordinator", org: "Medical Project Jeevan Shakti (Zone 6)" },
      { role: "Zone 6 Coordinator", org: "MindShield Yagna" },
    ],
    initiatives:
      "Initiatives in literacy, education, child safety, women empowerment, community service, health and awareness programs",
  },
} as const;

/** "Name (detail)", plus ", trained <dates>" when content.md gives training dates. */
export function certificationLine(c: Certification): string {
  const base = c.detail ? `${c.name} (${c.detail})` : c.name;
  return c.trained?.length ? `${base}, trained ${c.trained.join(" and ")}` : base;
}
