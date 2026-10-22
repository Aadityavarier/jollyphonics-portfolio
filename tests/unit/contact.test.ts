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
