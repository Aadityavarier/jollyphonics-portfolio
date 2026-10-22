import type { ReactNode } from "react";
import type { Todo as TodoValue } from "@/content/types";
import { isTodo } from "@/content/todo";
import { showTodos } from "@/lib/env";

/** Visible in dev so gaps are obvious; renders nothing in production. */
export function Todo({ value }: { value: TodoValue }) {
  if (!showTodos()) return null;
  return (
    <span data-todo={value.id} className="todo-marker">
      TODO: {value.note}
    </span>
  );
}

export function renderMaybeTodo(v: string | TodoValue): ReactNode {
  return isTodo(v) ? <Todo value={v} /> : v;
}
