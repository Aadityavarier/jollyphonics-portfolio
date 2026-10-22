import type { Branch } from "@/content/types";
import { branchMessage } from "@/lib/contact";
import { directionsUrl, mapEmbedUrl } from "@/lib/branches";
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

  return (
    <article data-testid="branch-card" className="branch-card">
      <Heading data-part="name" className="branch-card-name">
        {branch.name}
      </Heading>
      <p data-part="secondary" className="branch-card-secondary">
        {branch.secondary}
      </p>
      <address data-part="address" className="branch-card-address [overflow-wrap:anywhere]">
        {branch.address}
      </address>
      <div className="branch-card-actions">
        <a
          data-part="directions"
          href={directionsUrl(branch)}
          target="_blank"
          rel="noopener"
          className="branch-card-directions"
        >
          Get directions
        </a>
        <span data-part="whatsapp" className="branch-card-whatsapp">
          <WhatsAppLink message={branchMessage(branch)} variant="secondary">
            WhatsApp this branch
          </WhatsAppLink>
        </span>
      </div>
      {withMap && <BranchMap name={branch.name} src={mapEmbedUrl(branch)} />}
    </article>
  );
}
