import { todo } from "./todo";
import type { Branch } from "./types";

/** content.md order. All four are presented identically; `schema` only affects JSON-LD (C2). */
export const branches: Branch[] = [
  {
    id: "om-dubey-dham",
    side: "east",
    name: "Ambernath East — Om Dubey Dham",
    locality: "Om Dubey Dham",
    address: "302, Om Dubey Dham, Above Shobha Hospital, Ambernath East",
    schema: "LocalBusiness",
  },
  {
    id: "chinchpada",
    side: "west",
    name: "Ambernath West — Chinchpada",
    locality: "Chinchpada",
    address:
      "Ground floor, Navare Residency and Library, Next to Y-Cafe, Near Fire Brigade Office, Chinchpada, Ambernath West",
    schema: "LocalBusiness",
  },
  {
    id: "vadavali",
    side: "east",
    name: "Ambernath East — Vadavali",
    locality: "Vadavali",
    secondary: "at Little Champs Playschool",
    address: "Shop No. 02, New Dhavalgiri Apartment, Shivaji Nagar, Vadavali Section, Ambernath East",
    schema: "Place",
    hostBusiness: "Little Champs Playschool",
  },
  {
    id: "nisarg-green",
    side: "east",
    name: "Ambernath East — Nisarg Green",
    locality: "Nisarg Green",
    secondary: "at Flying Bird Preschool",
    address:
      "Shop No. 9 & 10, Nisarg Green, Phase 2E, Sunflower Building No. 11, Ground Floor, Ambernath East",
    schema: "Place",
    hostBusiness: "Flying Bird Preschool",
  },
];

export const branchesTodo = todo("pincodes", "Pincodes and map pins for all four branches (content.md, Branches).");
