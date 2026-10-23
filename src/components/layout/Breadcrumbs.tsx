import Link from "next/link";
import { JsonLd } from "@/components/blocks/JsonLd";
import { breadcrumbGraph } from "@/lib/jsonld";

export interface Crumb {
  name: string;
  path: string;
}

/** Visual breadcrumbs for inner pages, with the matching BreadcrumbList JSON-LD from the same trail. */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-small">
      <JsonLd data={breadcrumbGraph(trail)} />
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted">
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="font-medium text-ink">
                  {c.name}
                </span>
              ) : (
                <>
                  <Link href={c.path} className="underline decoration-1 underline-offset-4 hover:text-ink">
                    {c.name}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
