import { coaching } from "@/content/coaching";
import { programs } from "@/content/programs";
import { teacherTraining } from "@/content/teacher-training";
import { Panel } from "@/components/layout/Panel";
import { SectionHeading } from "@/components/layout/Section";
import { PlayTile } from "./showcase/PlayTile";
import {
  BubblePreview,
  HandwritingPreview,
  SentencePreview,
  SoundWallPreview,
  StackPreview,
  StaircasePreview,
  TabsPreview,
} from "./showcase/previews";
import { labels } from "@/content/labels";

const TT = [teacherTraining.phonics.title, teacherTraining.ecced.title, teacherTraining.montessori.title].map((t) => t.replace(" Teacher Training", ""));
const S = labels.home.showcase;
const TILE = "sc-tile group relative isolate grid content-between gap-4 overflow-clip rounded-[var(--radius-panel)] p-5 sm:p-6";

function Label({ title, line }: { title: string; line?: string }) {
  return (
    <span className="grid gap-0.5">
      <h3 className="font-display text-lead leading-tight font-bold">{title}</h3>
      {line && <span className="text-small">{line}</span>}
    </span>
  );
}

/**
 * The showroom: seven small live previews, one per page or demo the site leads to. Each tile is just a link; its
 * miniature plays once while the tile is in view and rests off screen (see home-showcase.css).
 */
export function Showcase() {
  return (
    <Panel id="showcase" tone="ink">
      <div className="mx-auto grid max-w-[var(--content-max)] gap-10 px-[var(--gutter)] py-[var(--section-gap)]">
        <div className="grid gap-3">
          <SectionHeading id="showcase-title">{S.title}</SectionHeading>
          <p className="max-w-[48ch] text-lead">{S.intro}</p>
        </div>
        <div className="sc-grid">
          <PlayTile href="/programs#phonics" className={`${TILE} sc-phonics bg-red text-paper`}>
            <SoundWallPreview />
            <Label title={programs.phonics.title} line="42 sounds" />
          </PlayTile>
          <PlayTile href="/programs#grammar" className={`${TILE} sc-grammar bg-paper text-ink`}>
            <SentencePreview />
            <Label title={programs.grammar.title} line={programs.grammar.intro} />
          </PlayTile>
          <PlayTile href="/programs#english" className={`${TILE} sc-english bg-paper text-ink`}>
            <BubblePreview text={programs.english.items.slice(0, 3).map((i) => i.title).join(" · ")} />
            <Label title={S.english} />
          </PlayTile>
          <PlayTile href="/programs#handwriting" className={`${TILE} sc-handwriting bg-paper text-ink`}>
            <HandwritingPreview />
            <Label title={S.handwriting} />
          </PlayTile>
          <PlayTile href="/coaching" className={`${TILE} sc-coaching bg-surface text-ink`}>
            <StaircasePreview />
            <Label title={S.coaching} line={coaching.range} />
          </PlayTile>
          <PlayTile href="/teacher-training" className={`${TILE} sc-training bg-surface text-ink`}>
            <StackPreview labels={TT} />
            <Label title={S.teacherTraining} />
          </PlayTile>
          <PlayTile href="/for-schools" className={`${TILE} sc-schools bg-paper text-ink`}>
            <TabsPreview />
            <Label title={S.schools} />
          </PlayTile>
        </div>
      </div>
    </Panel>
  );
}
