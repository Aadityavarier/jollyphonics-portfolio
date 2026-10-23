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

/** The classes in "Sr. KG to Std. 8", lowest first (the range is content.md's; each standard in it is implied). */
export const coachingSteps = ["Sr. KG", "Std. 1", "Std. 2", "Std. 3", "Std. 4", "Std. 5", "Std. 6", "Std. 7", "Std. 8"] as const;
