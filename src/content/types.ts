/** Marks a fact that content.md does not have yet. Rendered as a visible TODO in dev, nothing in prod. */
export type Todo = { readonly kind: "todo"; readonly id: string; readonly note: string };

export type Side = "east" | "west";

export type BranchId = "om-dubey-dham" | "chinchpada" | "vadavali" | "nisarg-green";

export interface Branch {
  id: BranchId;
  side: Side;
  /** Area-first headline, e.g. "Ambernath East — Vadavali". */
  name: string;
  /** Secondary line under the name. */
  secondary: string;
  /** Full address, verbatim from content.md. */
  address: string;
  /** Structured-data type only (C2). Never used for visual presentation. */
  schema: "LocalBusiness" | "Place";
  hostBusiness?: string;
}

export type PageKey =
  | "home"
  | "about"
  | "programs"
  | "coaching"
  | "teacher-training"
  | "for-schools"
  | "gallery"
  | "contact";

export interface PageSeo {
  path: string;
  /** Final document title, exactly as in PLAN.md §6. */
  title: string;
  description: string;
  keyword: string;
}

export interface FaqItem {
  q: string;
  a: string;
  /** Set when part of the answer is still missing from content.md. */
  todo?: Todo;
}

export interface TitledText {
  title: string;
  text: string;
}
