import { CONTENT_WIDTH } from "@/components/shared/layout"
import { dummyImage } from "@/lib/dummy-media"
import { HighlightCell, ImageCell, LogoCell, NumberCell, StatCell } from "./bento-cells"
import { FadeIn } from "@/components/shared/fade-in"

// Dark rounded panel with the heading and a 4-column bento (3 rows). The panel sits in the
// shared content column so its edges line up with every other section. Rows have a minimum
// height that keeps cells roughly square and grow when text or images need more.
export function BriefingBentoSection() {
  return (
    <section className="w-full px-4 py-8">
      <div className={`${CONTENT_WIDTH} rounded-3xl bg-foreground px-4 pt-8 pb-4 sm:px-6`}>
        <FadeIn className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="mb-3 text-xs font-medium tracking-wide text-primary uppercase">
            Less to sift through. More to take away.
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-background sm:text-3xl lg:text-4xl">
            A daily briefing
            <br />
            with a clear purpose.
          </h2>
        </FadeIn>

        <FadeIn className="@container mt-6 w-full">
          <div className="grid auto-rows-[minmax(max(7rem,12cqw),auto)] grid-cols-2 gap-3 md:grid-cols-4">
            {/* Row 1 */}
            <NumberCell value="100" caption="Stories selected for your daily catch-up." />
            <ImageCell src={dummyImage(400, 600, 600)} />
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
              image="/brand-logos/one-app.png"
              caption="Your updates and deeper explainers, together."
            />
            <LogoCell
              name="Wiki Wiki Poke"
              logo="/brand-logos/wiki-wiki-poke.png"
              caption="5 locations across Austria and Germany"
            />
            <ImageCell src={dummyImage(410, 600, 600)} />

            {/* Row 3 */}
            <LogoCell
              name="Kaimug"
              logo="/brand-logos/kaimug.png"
              caption="15 locations across Germany"
            />
            <ImageCell src={dummyImage(420, 600, 600)} />
            <StatCell
              className="col-span-2"
              tone="success"
              label="Increase upselling by"
              value="23%"
              title="Kaimug increased their upselling"
              description="at locations with high Bounti usage rates"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
