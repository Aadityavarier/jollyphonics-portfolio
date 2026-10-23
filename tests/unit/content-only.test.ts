import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

/**
 * CLAUDE.md: "All copy lives in src/content/ (typed data from content.md), not hardcoded in JSX."
 * Scans every component and page for words written straight into JSX: text between tags, and the
 * human-facing attributes (aria-label, title, alt, placeholder). Styleguide and opengraph images are
 * internal, and Todo.tsx is the dev-only "TODO:" marker (never shipped), so they are exempt.
 */
const ROOTS = ["src/components", "src/app"];
const SKIP = /styleguide|opengraph-image|twitter-image|icon\.tsx|apple-icon|blocks[\\/]Todo\.tsx/;
const ATTRS = new Set(["aria-label", "title", "alt", "placeholder"]);
const WORDY = /[A-Za-z]{3,}/;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? files(p) : p.endsWith(".tsx") ? [p] : [];
  });
}

function hardcoded(file: string): string[] {
  const src = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const out: string[] = [];
  const visit = (n: ts.Node) => {
    if (ts.isJsxText(n) && WORDY.test(n.text)) out.push(n.text.trim().replace(/\s+/g, " "));
    if (ts.isJsxAttribute(n) && ATTRS.has(n.name.getText()) && n.initializer && ts.isStringLiteral(n.initializer) && WORDY.test(n.initializer.text))
      out.push(`${n.name.getText()}="${n.initializer.text}"`);
    ts.forEachChild(n, visit);
  };
  visit(src);
  return out;
}

describe("copy lives in src/content", () => {
  it("no component or page hardcodes words in JSX", () => {
    const found = ROOTS.flatMap(files)
      .filter((f) => !SKIP.test(f))
      .flatMap((f) => hardcoded(f).map((t) => `${relative(process.cwd(), f).replace(/\\/g, "/")}: ${t}`));
    expect(found).toEqual([]);
  });
});
