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
