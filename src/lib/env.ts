/** Dev-only TODO markers and image placeholders. Read at call time so tests can stub NODE_ENV. */
export function showTodos(): boolean {
  return process.env.NODE_ENV !== "production";
}
