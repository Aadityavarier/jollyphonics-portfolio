import { todo } from "./todo";
import type { Branch } from "./types";

/** content.md order. All four are presented identically; `schema` only affects JSON-LD (C2). */
export const branches: Branch[] = [
  {
    id: "om-dubey-dham",
    side: "east",
    name: "Ambernath East — Om Dubey Dham",
    secondary: "above Shobha Hospital",
    address: "302, Om Dubey Dham, Above Shobha Hospital, Ambernath East",
    schema: "LocalBusiness",
  },
  {
    id: "chinchpada",
    side: "west",
    name: "Ambernath West — Chinchpada",
    secondary: "Navare Residency, next to Y-Cafe",
    address:
      "Ground floor, Navare Residency and Library, Next to Y-Cafe, Near Fire Brigade Office, Chinchpada, Ambernath West",
    schema: "LocalBusiness",
  },
  {
    id: "vadavali",
    side: "east",
    name: "Ambernath East — Vadavali",
    secondary: "at Little Champs Playschool, Shivaji Nagar",
    address: "Shop No. 02, New Dhavalgiri Apartment, Shivaji Nagar, Vadavali Section, Ambernath East",
    schema: "Place",
    hostBusiness: "Little Champs Playschool",
  },
  {
    id: "nisarg-green",
    side: "east",
    name: "Ambernath East — Nisarg Green",
    secondary: "at Flying Bird Preschool, Phase 2E",
    address:
      "Shop No. 9 & 10, Nisarg Green, Phase 2E, Sunflower Building No. 11, Ground Floor, Ambernath East",
    schema: "Place",
    hostBusiness: "Flying Bird Preschool",
  },
];

export const branchesTodo = todo("pincodes", "Pincodes and map pins for all four branches (content.md, Branches).");
