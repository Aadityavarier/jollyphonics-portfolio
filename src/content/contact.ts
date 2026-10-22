import { todo } from "./todo";

export const contact = {
  phoneDisplay: "9022582988",
  phoneE164: "+919022582988",
  whatsappNumber: "919022582988",
  area: "Ambernath East & Ambernath West, Maharashtra",
  line: "For admissions, batch timings, course details, teacher training and school workshops, please contact us.",
  status: "Admissions & Enquiries Open",
  timingsLine: "WhatsApp us for current batch timings",
  timingsTodo: todo("batch-timings", "Batch timings, days, fees and class mode (offline / online) (content.md Q4)."),
  programsPerBranchTodo: todo("programs-per-branch", "Which programs run at which branch (content.md Q3)."),
  social: {
    name: "Tr. Revathi Phonics & Coaching Classes",
    instagram: todo("social-urls", "Instagram, Facebook and YouTube URLs (content.md Q8)."),
    facebook: todo("social-urls", "Instagram, Facebook and YouTube URLs (content.md Q8)."),
    youtube: todo("social-urls", "Instagram, Facebook and YouTube URLs (content.md Q8)."),
  },
  enquireAbout: [
    "Jolly Phonics",
    "Jolly Grammar",
    "English",
    "Coaching Classes",
    "Reading & Spelling",
    "Spoken English",
    "Handwriting",
    "ECCEd",
    "Montessori Teacher Training",
    "Phonics Teacher Training",
    "School Workshops",
  ],
} as const;
