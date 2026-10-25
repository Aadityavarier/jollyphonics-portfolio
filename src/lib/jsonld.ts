import { SITE_URL } from "@/lib/site";
import { brand, LOGO_SRC } from "@/content/brand";
import { contact } from "@/content/contact";
import { branches } from "@/content/branches";
import { founder } from "@/content/founder";
import type { Branch } from "@/content/types";

const url = (path = "/") => `${SITE_URL}${path}`;
export const ORG_ID = `${SITE_URL}/#org`;
export const PERSON_ID = `${SITE_URL}/#revathi`;

function address(b: Branch) {
  return {
    "@type": "PostalAddress",
    streetAddress: b.address,
    addressLocality: "Ambernath",
    addressRegion: "Maharashtra",
    ...(b.postalCode ? { postalCode: b.postalCode } : {}),
    addressCountry: "IN",
  };
}

/** Branches 1-2 are the organisation's own (LocalBusiness); 3-4 are hosted at partner preschools (Place). */
export function branchNode(b: Branch) {
  const base = {
    "@type": b.schema,
    "@id": `${SITE_URL}/#branch-${b.id}`,
    name: b.name,
    address: address(b),
    ...(b.geo ? { geo: { "@type": "GeoCoordinates", latitude: b.geo.lat, longitude: b.geo.lng } } : {}),
    ...(b.secondary ? { description: `${brand.fullName} ${b.secondary}` } : {}),
  };
  return b.schema === "LocalBusiness"
    ? { ...base, telephone: contact.phoneE164, parentOrganization: { "@id": ORG_ID }, url: url("/contact") }
    : base;
}

export function organizationNode() {
  return {
    "@type": "EducationalOrganization",
    "@id": ORG_ID,
    name: brand.fullName,
    alternateName: brand.name,
    url: url(),
    logo: url(LOGO_SRC),
    description: `${brand.tagline}. ${brand.subTagline}`,
    telephone: contact.phoneE164,
    areaServed: contact.area,
    foundingDate: founder.founded,
    founder: { "@id": PERSON_ID },
    location: branches.map((b) => ({ "@id": `${SITE_URL}/#branch-${b.id}` })),
  };
}

export function personNode() {
  const iw = founder.community.innerWheel;
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: founder.fullName,
    alternateName: founder.knownAs,
    jobTitle: founder.role,
    description: founder.credential,
    worksFor: { "@id": ORG_ID },
    hasCredential: [
      ...founder.qualifications.map((q) => ({ "@type": "EducationalOccupationalCredential", credentialCategory: "degree", name: q.title, description: q.detail })),
      ...founder.certifications.map((c) => ({ "@type": "EducationalOccupationalCredential", credentialCategory: "certification", name: c.name, ...("detail" in c ? { description: c.detail } : {}) })),
    ],
    award: founder.awards.map((a) => `${a.name} (${a.year})`),
    knowsAbout: founder.expertise,
    memberOf: [
      {
        "@type": "OrganizationRole",
        memberOf: { "@type": "Organization", name: iw.org },
        roleName: iw.roles.at(-1)!.role,
        startDate: iw.roles[0].period.replace(/^since\s+/, ""),
      },
      { "@type": "OrganizationRole", memberOf: { "@type": "Organization", name: founder.community.rotary.org }, roleName: founder.community.rotary.role },
    ],
  };
}

/** Site-wide graph: the organisation, its four branches, and the founder reference target. */
export function siteGraph() {
  return { "@context": "https://schema.org", "@graph": [organizationNode(), ...branches.map(branchNode)] };
}

export function personGraph() {
  return { "@context": "https://schema.org", "@graph": [personNode()] };
}

export function breadcrumbGraph(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: url(c.path) })),
  };
}

export function faqGraph(items: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
}
