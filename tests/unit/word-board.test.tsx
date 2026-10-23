import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { matchWord, nextSlot } from "@/lib/word-board";
import { WordBoard } from "@/components/home/WordBoard";
import { home } from "@/content/home";

function stubEnv(reduced: boolean) {
  window.matchMedia = ((q: string) => ({ matches: reduced && q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
}

const words = home.board.words;
const boardLetters: readonly string[] = home.board.letters;

describe("matchWord / nextSlot", () => {
  it("matches a full slot row against the word list, in order", () => {
    expect(matchWord(["c", "a", "t"], words)).toBe("cat");
    expect(matchWord(["t", "c", "a"], words)).toBeNull();
    expect(matchWord(["c", "a", null], words)).toBeNull();
  });
  it("finds the next empty slot, or -1 when full", () => {
    expect(nextSlot([null, null, null])).toBe(0);
    expect(nextSlot(["c", null, null])).toBe(1);
    expect(nextSlot(["c", "a", "t"])).toBe(-1);
  });
  it("keeps the less familiar words out of the list", () => {
    expect(words).not.toContain("sap");
    expect(words).not.toContain("spa");
    expect(words.every((w) => w.length === 3 && [...w].every((ch) => boardLetters.includes(ch)))).toBe(true);
  });
});

describe("WordBoard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    stubEnv(false);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("server-renders the cat example, readable without JavaScript", () => {
    const html = renderToString(<WordBoard />);
    expect(html).toContain("c – a – t → cat");
  });

  it("a first tap clears the example and builds a word of your own", () => {
    render(<WordBoard />);
    for (const l of ["s", "i", "t"]) fireEvent.click(screen.getByRole("button", { name: `Add sound ${l}` }));
    expect(screen.getByText("s – i – t → sit")).toBeInTheDocument();
  });

  it("tapping a sound once the board is full starts a new word instead of doing nothing", () => {
    render(<WordBoard />);
    for (const l of ["s", "i", "t"]) fireEvent.click(screen.getByRole("button", { name: `Add sound ${l}` }));
    fireEvent.click(screen.getByRole("button", { name: "Add sound p" }));
    expect(screen.getByTestId("board-slots").textContent).toBe("p");
  });

  it("an unknown combination is spelled out without a word", () => {
    render(<WordBoard />);
    for (const l of ["t", "c", "a"]) fireEvent.click(screen.getByRole("button", { name: `Add sound ${l}` }));
    expect(screen.getByText(/t – c – a/)).toBeInTheDocument();
    expect(screen.queryByText(/→/)).not.toBeInTheDocument();
  });

  it("Backspace removes the last sound", () => {
    render(<WordBoard />);
    fireEvent.click(screen.getByRole("button", { name: "Add sound p" }));
    fireEvent.click(screen.getByRole("button", { name: "Add sound a" }));
    fireEvent.keyDown(screen.getByRole("group", { name: /word board/i }), { key: "Backspace" });
    expect(screen.getByTestId("board-slots").textContent).toContain("p");
    expect(screen.getByTestId("board-slots").textContent).not.toContain("a");
  });

  it("a tap during the auto-demo cancels it", () => {
    render(<WordBoard />);
    act(() => void vi.advanceTimersByTime(1300)); // demo starts: example cleared
    expect(screen.getByTestId("board-slots").textContent).toBe("");
    fireEvent.click(screen.getByRole("button", { name: "Add sound n" }));
    act(() => void vi.advanceTimersByTime(6000));
    expect(screen.getByTestId("board-slots").textContent).toBe("n");
  });

  it("never plays the demo or animates under reduced motion", () => {
    stubEnv(true);
    const animate = vi.fn();
    Element.prototype.animate = animate as never;
    render(<WordBoard />);
    act(() => void vi.advanceTimersByTime(6000));
    expect(screen.getByText("c – a – t → cat")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Add sound p" }));
    expect(animate).not.toHaveBeenCalled();
  });
});
