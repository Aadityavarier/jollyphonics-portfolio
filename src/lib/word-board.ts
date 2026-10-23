/** The word the filled slots spell, if it is on the list. Slots are read left to right; empty slots never match. */
export function matchWord(slots: readonly (string | null)[], words: readonly string[]): string | null {
  if (slots.some((s) => !s)) return null;
  const word = slots.join("");
  return words.includes(word) ? word : null;
}

/** Index of the first empty slot, or -1 when every slot is filled. */
export function nextSlot(slots: readonly (string | null)[]): number {
  return slots.findIndex((s) => !s);
}
