import type { Branch } from "@/content/types";
import { branchMessage } from "@/lib/contact";
import { branchPhotosReady, directionsUrl, mapEmbedUrl } from "@/lib/branches";
import { branchPhotoSlot } from "@/content/images";
import { ImageSlot } from "@/components/blocks/ImageSlot";
import { WhatsAppLink } from "./WhatsAppLink";
import { BranchMap } from "./BranchMap";

interface Props {
  branch: Branch;
  withMap?: boolean;
  headingLevel?: 2 | 3 | 4;
}

/** One layout for every branch, everywhere. No per-branch conditionals (Task 4 parity test). */
export function BranchCard({ branch, withMap = false, headingLevel = 3 }: Props) {
  const Heading = `h${headingLevel}` as const;
  const [side, place] = branch.name.split(" — ");

  return (
    <article data-testid="branch-card" className="branch-card flex h-full flex-col gap-1.5 rounded-[var(--radius-panel)] bg-surface p-5 text-ink md:p-6">
      {branchPhotosReady() && (
        <div data-part="photo" className="branch-card-photo -mx-5 -mt-5 mb-2 md:-mx-6 md:-mt-6 overflow-hidden rounded-t-[var(--radius-panel)]">
          <ImageSlot id={branchPhotoSlot[branch.id]} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
        </div>
      )}
      <Heading data-part="name" className="branch-card-name text-lead font-extrabold leading-tight">
        {side} —{" "}<span className="block">{place}</span>
      </Heading>
      <p data-part="secondary" className="branch-card-secondary font-medium text-muted">
        {branch.secondary}
      </p>
      <address data-part="address" className="branch-card-address not-italic [overflow-wrap:anywhere]">
        {branch.address}
      </address>
      <div className="branch-card-actions mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pt-3">
        <a
          data-part="directions"
          href={directionsUrl(branch)}
          target="_blank"
          rel="noopener"
          className="branch-card-directions cta cta-inline"
        >
          Get directions
        </a>
        <span data-part="whatsapp" className="branch-card-whatsapp">
          <WhatsAppLink message={branchMessage(branch)} variant="secondary" className="whitespace-nowrap">
            WhatsApp us
          </WhatsAppLink>
        </span>
      </div>
      {withMap && <BranchMap name={branch.name} src={mapEmbedUrl(branch)} />}
    </article>
  );
}
