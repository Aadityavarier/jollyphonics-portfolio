import type { Todo } from "./types";

export function todo(id: string, note: string): Todo {
  return { kind: "todo", id, note };
}

export function isTodo(v: unknown): v is Todo {
  return typeof v === "object" && v !== null && (v as { kind?: unknown }).kind === "todo";
}
