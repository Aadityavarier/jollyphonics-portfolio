import { contact } from "@/content/contact";
import type { Branch } from "@/content/types";

const WHATSAPP_BASE = `https://wa.me/${contact.whatsappNumber}`;

export function whatsappUrl(message?: string): string {
  if (!message || !message.trim()) return WHATSAPP_BASE;
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
}

export function telHref(): string {
  return `tel:${contact.phoneE164}`;
}

export function branchMessage(branch: Branch): string {
  return `Hi, I'm enquiring about the ${branch.name} branch.`;
}

export interface EnquiryAnswers {
  topic?: string;
  branch?: string;
  name?: string;
  note?: string;
}

/** The enquiry as one WhatsApp message. Blank answers are left out; with none at all it is the general greeting. */
export function buildEnquiryMessage({ topic, branch, name, note }: EnquiryAnswers): string {
  const t = topic?.trim();
  const lines = [
    t ? `Hi, I'd like to enquire about ${t}.` : "Hi, I'd like to know more about your classes.",
    name?.trim() && `Name: ${name.trim()}`,
    branch?.trim() && `Preferred branch: ${branch.trim()}`,
    note?.trim() && `Note: ${note.trim()}`,
  ].filter(Boolean);
  return lines.join("\n");
}
