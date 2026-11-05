import { CONTENT_WIDTH } from "@/components/shared/layout"
import { HighlightCell, ImageCell, LogoCell, NumberCell, StatCell } from "./bento-cells"

// Figma frame: max width 1540, gap 10, padding 16 × 80. Dark rounded panel with the heading
// and a 4-column bento (3 rows) in the shared content column. Rows have a minimum height that
// keeps cells roughly square (282/1200 of the column) and grow when text or images need more.
export function BriefingBentoSection() {
  return (
    <section className="mx-auto w-full max-w-[1540px] px-4 py-20">
      <div className="rounded-3xl bg-foreground px-4 pt-20 pb-5 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="mb-4 text-xs font-medium tracking-wide text-primary uppercase">
            Less to sift through. More to take away.
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-background sm:text-4xl lg:text-5xl">
            A daily briefing
            <br />
            with a clear purpose.
          </h2>
        </div>

        <div className={`${CONTENT_WIDTH} @container mt-16 lg:mt-28`}>
          <div className="grid auto-rows-[minmax(max(12rem,23.5cqw),auto)] grid-cols-2 gap-3 md:grid-cols-4">
            {/* Row 1 */}
            <NumberCell value="100" caption="Stories selected for your daily catch-up." />
            <ImageCell />
            <StatCell
              className="col-span-2"
              label="Training costs saved by"
              value="68%"
              title="Saved training costs and manual hours"
              description="Shortened time to productivity while increasing customer satisfaction"
            />

            {/* Row 2 */}
            <HighlightCell
              className="col-span-2"
              value="1 app"
              caption="Your updates and deeper explainers, together."
            />
            <LogoCell name="Wiki Wiki Poke" caption="5 locations across Austria and Germany" />
            <ImageCell />

            {/* Row 3 */}
            <LogoCell name="Kaimug" caption="15 locations across Germany" />
            <ImageCell />
            <StatCell
              className="col-span-2"
              tone="success"
              label="Increase upselling by"
              value="23%"
              title="Kaimug increased their upselling"
              description="at locations with high Bounti usage rates"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
