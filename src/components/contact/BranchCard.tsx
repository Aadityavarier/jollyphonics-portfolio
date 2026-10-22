import type { Branch } from "@/content/types";
import { branchMessage } from "@/lib/contact";
import { branchPhotosReady, directionsUrl, mapEmbedUrl } from "@/lib/branches";
import { branchPhotoSlot } from "@/content/images";
import { ImageSlot } from "@/components/blocks/ImageSlot";
import { WhatsAppLink } from "./WhatsAppLink";
import { BranchMap } from "./BranchMap";

interface Props {
  branch: Branch;
  /** Inside an "Ambernath East / West" group: title is the locality alone. */
  grouped?: boolean;
  withMap?: boolean;
  headingLevel?: 2 | 3 | 4;
}

function DirectionsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-5 sm:hidden"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11 21 3l-8 18-2-8-8-2Z" />
    </svg>
  );
}

/**
 * One layout for every branch, everywhere. No per-branch conditionals (Task 4 parity test):
 * the secondary line is always rendered and simply empty (and hidden) for branches 1–2.
 * Below 640px the card is compact: address and the two actions share one row, actions as icons.
 */
export function BranchCard({ branch, grouped = false, withMap = false, headingLevel = 3 }: Props) {
  const Heading = `h${headingLevel}` as const;

  return (
    <article
      data-testid="branch-card"
      className="branch-card flex h-full flex-col gap-1 rounded-[var(--radius-panel)] bg-surface p-4 text-ink sm:gap-1.5 sm:p-6"
    >
      {branchPhotosReady() && (
        <div data-part="photo" className="-mx-4 -mt-4 mb-2 overflow-hidden rounded-t-[var(--radius-panel)] sm:-mx-6 sm:-mt-6">
          <ImageSlot id={branchPhotoSlot[branch.id]} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
        </div>
      )}
      <Heading data-part="name" className="text-lead font-bold leading-tight">
        {grouped ? branch.locality : branch.name}
      </Heading>
      <p data-part="secondary" className="font-medium text-muted empty:hidden">
        {branch.secondary ?? ""}
      </p>
      <div className="mt-1 flex items-start gap-3 sm:flex-1 sm:flex-col sm:gap-4">
        <address
          data-part="address"
          className="flex-1 text-small not-italic [overflow-wrap:anywhere] sm:flex-none sm:text-body"
        >
          {branch.address}
        </address>
        <div className="flex shrink-0 items-center gap-2 sm:mt-auto sm:w-full sm:flex-wrap sm:justify-between sm:gap-x-4 sm:gap-y-3">
          <a
            data-part="directions"
            href={directionsUrl(branch)}
            target="_blank"
            rel="noopener"
            className="branch-directions inline-grid size-11 place-items-center rounded-full bg-paper sm:inline sm:size-auto sm:rounded-none sm:bg-transparent sm:font-bold sm:underline sm:decoration-2 sm:underline-offset-4"
          >
            <DirectionsIcon />
            <span className="sr-only sm:not-sr-only">Get directions</span>
          </a>
          <span data-part="whatsapp" className="contents">
            <WhatsAppLink message={branchMessage(branch)} variant="secondary" className="branch-whatsapp whitespace-nowrap">
              <span className="sr-only sm:not-sr-only">WhatsApp us</span>
            </WhatsAppLink>
          </span>
        </div>
      </div>
      {withMap && <BranchMap name={branch.name} src={mapEmbedUrl(branch)} />}
    </article>
  );
}
