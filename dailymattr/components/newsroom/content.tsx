import { B, Callout, Hl, Li, List, P } from "@/components/privacy/prose"

// Copy for the Newsroom page. Same layout as the Privacy Policy page (Figma 8697:507).

export const hero = {
  eyebrow: "Newsroom",
  title: ["The people. The process.", "The stories."],
  lead: "Behind every story is a process.",
  body: [
    "Every headline represents a decision about what matters, what is verified, and what readers need to understand.",
    "The dailymattr Newsroom brings together the editorial work behind our coverage. From researching developments and checking facts to writing concise summaries and adding context, our team works to make important information easier to understand.",
    "Our focus is simple: give readers the facts, the context, and a clearer picture of what's happening.",
  ],
}

export const cta = {
  title: "Stay informed. Understand more.",
  button: { label: "Read today's stories", href: "/" },
}

export type NewsroomSection = {
  /** Label in the "On this page" contents. */
  nav: string
  title: string
  body: React.ReactNode
}

/** Large sub-heading that sits right under a section title. */
function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="pt-4 text-lg leading-7 font-semibold tracking-[-0.0125rem] text-[#141417] lg:text-xl lg:leading-8">
      {children}
    </p>
  )
}

/** Numbered process steps as a two-column card grid. */
function Steps({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ol className="grid grid-cols-1 gap-3 pt-5 sm:grid-cols-2">
      {items.map((step, i) => (
        <li key={step.title} className="rounded-[1.125rem] border border-[#ececf0] bg-[#f6f6f8] p-5">
          <span className="text-xs leading-[1.3125rem] font-bold tracking-[0.15625rem] text-[#3979ff]">
            STEP {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="pt-1.5 text-base leading-7 font-bold text-[#141417]">{step.title}</h3>
          <p className="pt-1 text-[0.90625rem] leading-[1.5859rem] text-[#3a3a40]">{step.body}</p>
        </li>
      ))}
    </ol>
  )
}

export const sections: NewsroomSection[] = [
  {
    nav: "Behind the Headlines",
    title: "What happens behind the headlines?",
    body: (
      <>
        <Lead>News doesn&apos;t need more noise. It needs more clarity.</Lead>
        <P>
          The world moves quickly. Information comes from hundreds of sources, developments change by
          the hour, and not every headline tells the complete story.
        </P>
        <P>
          Our editorial team reviews important developments, examines available information, checks key
          details, and presents the essential facts in clear, accessible language.
        </P>
        <P>
          We focus on <Hl>what happened</Hl>, <Hl>why it matters</Hl>, and <Hl>what readers should know</Hl>.
        </P>
        <Callout>
          <B>Not more information for the sake of it.</B> More value from the information that matters.
        </Callout>
      </>
    ),
  },
  {
    nav: "How Our Newsroom Works",
    title: "How our newsroom works",
    body: (
      <>
        <Lead>From information to understanding.</Lead>
        <P>
          Every story follows an editorial process designed around accuracy, clarity, and context. Each
          step exists to make sure what reaches you is reliable and easy to follow.
        </P>
        <Steps
          items={[
            {
              title: "Track developments",
              body: "We follow important developments as they unfold and identify the stories readers need to know about.",
            },
            {
              title: "Research and verify",
              body: "We examine the available information, compare sources, and check the key details before a story moves forward.",
            },
            {
              title: "Write clearly",
              body: "We turn complex developments into concise summaries written in plain, accessible language.",
            },
            {
              title: "Add context",
              body: "We explain the background and why a development matters, so each story is easier to understand.",
            },
          ]}
        />
      </>
    ),
  },
  {
    nav: "Our Editorial Principles",
    title: "Our editorial principles",
    body: (
      <>
        <P first>The same principles guide every story we publish, whatever the topic or format.</P>
        <List>
          <Li>
            <B>Accuracy first</B> – we check key details before we publish and favour getting it right over
            getting it first.
          </Li>
          <Li>
            <B>Clarity over complexity</B> – we write in clear language so that important information is
            easy to understand.
          </Li>
          <Li>
            <B>Context matters</B> – we explain why a development matters, not only what happened.
          </Li>
          <Li>
            <B>Fairness</B> – we present developments in a balanced way and separate facts from opinion.
          </Li>
        </List>
      </>
    ),
  },
  {
    nav: "Corrections and Updates",
    title: "Corrections and updates",
    body: (
      <>
        <P first>
          News develops over time. When new information becomes available, we update our stories so they
          continue to reflect the most accurate picture of what&apos;s happening.
        </P>
        <P>
          If we get something wrong, we correct it. Readers who notice an error or have feedback about our
          coverage are encouraged to <Hl>get in touch with us</Hl>.
        </P>
      </>
    ),
  },
]
