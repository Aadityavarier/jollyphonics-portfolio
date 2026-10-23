import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { buildEnquiryMessage, whatsappUrl } from "@/lib/contact";

beforeEach(() => {
  window.matchMedia = ((q: string) => ({ matches: q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

const sendLink = () => screen.getByRole("link", { name: /send on whatsapp/i });

describe("EnquiryForm", () => {
  it("asks one question at a time and every question is optional", () => {
    render(<EnquiryForm />);
    expect(screen.getByRole("group", { name: /what would you like to know about/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/what should we call you/i)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByLabelText(/what should we call you/i)).toBeInTheDocument();
  });

  it("builds the wa.me link from the answers, skipping the rest", () => {
    render(<EnquiryForm />);
    fireEvent.click(screen.getByLabelText("Jolly Phonics"));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: /skip to my message/i }));
    expect(sendLink()).toHaveAttribute("href", whatsappUrl(buildEnquiryMessage({ topic: "Jolly Phonics" })));
  });

  it("with no answers at all the shortest path still opens a valid greeting", () => {
    render(<EnquiryForm />);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: /skip to my message/i }));
    expect(sendLink()).toHaveAttribute("href", whatsappUrl(buildEnquiryMessage({})));
  });

  it("Enter in the name field moves on, and the typed message includes the name", () => {
    render(<EnquiryForm />);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.change(screen.getByLabelText(/what should we call you/i), { target: { value: "Priya" } });
    fireEvent.submit(screen.getByLabelText(/what should we call you/i).closest("form")!);
    fireEvent.click(screen.getByRole("button", { name: "See my message" }));
    expect(decodeURIComponent(sendLink().getAttribute("href")!)).toContain("Name: Priya");
  });

  it("Show all fields is the plain form with the same link", () => {
    render(<EnquiryForm />);
    fireEvent.click(screen.getByRole("button", { name: /show all fields/i }));
    fireEvent.change(screen.getByLabelText(/i.m enquiring about/i), { target: { value: "ECCEd" } });
    expect(sendLink()).toHaveAttribute("href", whatsappUrl(buildEnquiryMessage({ topic: "ECCEd" })));
  });
});
