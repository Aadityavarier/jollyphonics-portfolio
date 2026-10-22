/** Prefilled WhatsApp messages (C1). UI copy, not facts. */
export const messages = {
  general: "Hi, I'd like to know more about your classes.",
  phonicsSuitability: "Hi, I'd like to know if phonics is suitable for my child (age __).",
  phonics: "Hi, I'd like to know more about Jolly Phonics classes.",
  grammar: "Hi, I'd like to know more about Jolly Grammar classes.",
  english: "Hi, I'd like to know more about your English classes.",
  handwriting: "Hi, I'd like to know more about handwriting improvement classes.",
  specialClasses: "Hi, I'd like to know about upcoming special classes.",
  coaching: "Hi, I'd like to know about coaching for my child (Std. __).",
  teacherTraining: "Hi, I'd like to know more about your teacher training programs.",
  schools: "Hi, I'd like to book a phonics workshop for our school.",
  about: "Hi Trainer Revathi, I'd like to know more about your classes.",
} as const;

export type MessageKey = keyof typeof messages;
