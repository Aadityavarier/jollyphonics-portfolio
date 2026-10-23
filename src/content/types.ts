/** Marks a fact that content.md does not have yet. Rendered as a visible TODO in dev, nothing in prod. */
export type Todo = { readonly kind: "todo"; readonly id: string; readonly note: string };

export type Side = "east" | "west";

export type BranchId = "om-dubey-dham" | "chinchpada" | "vadavali" | "nisarg-green";

export interface Branch {
  id: BranchId;
  side: Side;
  /** Area-first headline, e.g. "Ambernath East — Vadavali". */
  name: string;
  /** Locality alone, used as the card title inside an East/West group. */
  locality: string;
  /** Host-preschool line, branches 3–4 only. */
  secondary?: string;
  /** Full address, verbatim from content.md. */
  address: string;
  /** Structured-data type only (C2). Never used for visual presentation. */
  schema: "LocalBusiness" | "Place";
  hostBusiness?: string;
  /** Pincode, once the client supplies it (TODO pincodes). Goes into the structured data. */
  postalCode?: string;
  /** Exact map pin, once supplied: directions and the map then land on it instead of an address search. */
  geo?: { lat: number; lng: number };
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
