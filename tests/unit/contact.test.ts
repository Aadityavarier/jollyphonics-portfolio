import { describe, expect, it } from "vitest";
import { branchMessage, telHref, whatsappUrl } from "@/lib/contact";
import { messages } from "@/content/messages";
import { branches } from "@/content/branches";

describe("whatsappUrl", () => {
  it("links to the business number with no text when no message is given", () => {
    expect(whatsappUrl()).toBe("https://wa.me/919022582988");
  });

  it("round-trips special characters, newlines and Devanagari in the message", () => {
    const text = "A & B #1?\nनमस्ते";
    expect(new URL(whatsappUrl(text)).searchParams.get("text")).toBe(text);
  });

  it("treats a blank message like no message", () => {
    expect(whatsappUrl("   ")).toBe("https://wa.me/919022582988");
  });
});

describe("telHref", () => {
  it("dials the business number in E.164", () => {
    expect(telHref()).toBe("tel:+919022582988");
  });
});

describe("branchMessage", () => {
  it("names the branch by its area-first name", () => {
    const vadavali = branches.find((b) => b.id === "vadavali")!;
    expect(branchMessage(vadavali)).toContain("Ambernath East — Vadavali");
  });
});

describe("messages", () => {
  it.each(Object.entries(messages))("%s is non-empty and builds a valid wa.me URL", (_key, text) => {
    expect(text.trim().length).toBeGreaterThan(0);
    const url = new URL(whatsappUrl(text));
    expect(url.origin + url.pathname).toBe("https://wa.me/919022582988");
    expect(url.searchParams.get("text")).toBe(text);
  });
});

import { buildEnquiryMessage } from "@/lib/contact";

describe("buildEnquiryMessage", () => {
  it("is the general greeting when nothing is answered", () => {
    expect(buildEnquiryMessage({})).toBe("Hi, I'd like to know more about your classes.");
  });

  it("includes only the answers that were given, in a fixed order", () => {
    expect(buildEnquiryMessage({ topic: "Jolly Phonics", name: " Priya ", branch: "Ambernath East — Vadavali", note: "Age 5" })).toBe(
      ["Hi, I'd like to enquire about Jolly Phonics.", "Name: Priya", "Preferred branch: Ambernath East — Vadavali", "Note: Age 5"].join("\n"),
    );
    expect(buildEnquiryMessage({ topic: "ECCEd", note: "  " })).toBe("Hi, I'd like to enquire about ECCEd.");
  });

  it("survives the wa.me round trip, including Devanagari", () => {
    const text = buildEnquiryMessage({ name: "प्रिया", note: "A & B #1?" });
    expect(new URL(whatsappUrl(text)).searchParams.get("text")).toBe(text);
  });
});
