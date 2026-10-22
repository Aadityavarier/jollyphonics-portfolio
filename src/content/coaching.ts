import { todo } from "./todo";

export const coaching = {
  title: "Coaching & Tuition",
  range: "Sr. KG to Std. 8",
  subjects: [
    "English",
    "English Grammar",
    "Mathematics",
    "Hindi",
    "Marathi",
    "EVS",
    "Computer",
    "Reading",
    "Writing",
    "School academics",
  ],
  subjectsTodo: todo("coaching-subjects-confirm", "Confirm the coaching subject list (content.md Q6)."),
  boardsTodo: todo("coaching-boards", "Which boards coaching covers: SSC / CBSE / ICSE (content.md Q6)."),
  focus: "Understanding concepts and building confidence, not just finishing the syllabus.",
};
