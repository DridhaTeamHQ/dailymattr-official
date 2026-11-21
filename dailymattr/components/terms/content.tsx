import Link from "next/link"

import { GrievanceCard } from "@/components/privacy/content"
import { B, Callout, H3, Hl, Li, List, P, Ref } from "@/components/privacy/prose"

// Copy for the Terms & Conditions page. Same layout as the Privacy Policy page (Figma 8697:507).

export const hero = {
  eyebrow: "Legal",
  title: ["The fine print.", "Made clear."],
  body: [
    "These Terms explain how you may use dailymattr: what the App provides, what we ask of you, and how accounts, content and the AI Assistant work.",
    "They form a binding agreement between you and Dridha Technologies Private Limited, and should be read together with our Privacy Policy.",
  ],
}

export const cta = {
  title: "See how we protect your data",
  button: { label: "Read the Privacy Policy", href: "/privacypolicy" },
}

export type TermsSection = {
  /** Contents label: a few headings are shortened there ("&" for "and"). */
  nav: string
  title: string
  body: React.ReactNode
}

/** Paragraph right under a numbered sub-heading (10px lead-in, as in the Privacy Policy). */
function Sub({ children }: { children: React.ReactNode }) {
  return (
    <p className="pt-2.5 text-[0.96875rem] leading-[1.6953rem] text-[#3a3a40] [.theme-nia_&]:text-white/65">
      {children}
    </p>
  )
}

/** Blue semibold link to the Privacy Policy page. */
function PolicyLink() {
  return (
    <Link href="/privacypolicy" className="font-semibold text-[#3979ff] underline-offset-2 hover:underline">
      Privacy Policy
    </Link>
  )
}

const contactEmail = "admin@dridhatechnologies.com"

export const sections: TermsSection[] = [
  {
    nav: "Introduction and Acceptance",
    title: "Introduction and Acceptance",
    body: (
      <>
        <P first>
          These Terms and Conditions of Use (“Terms”), together with our <PolicyLink />, form a legally
          binding agreement (the “Agreement”) between you and <B>Dridha Technologies Private Limited</B>,
          a company incorporated under the Companies Act, 2013, having its office at Madhapur, Hyderabad,
          Telangana, India – 500081 (“Company”, “we”, “us” or “our”), governing your access to and use of
          the dailymattr mobile application and any related services (together, the “App”).
        </P>
        <P>
          By downloading, installing, accessing or using the App, you confirm that you have read,
          understood and agree to be bound by this Agreement. If you do not agree, please do not access or
          use the App.
        </P>
        <P>
          Our Privacy Policy is incorporated into these Terms by reference and explains how we handle your
          personal data. In the event of a conflict between these Terms and the Privacy Policy on a
          data-protection matter, the Privacy Policy prevails.
        </P>
      </>
    ),
  },
  {
    nav: "Definitions",
    title: "Definitions",
    body: (
      <List>
        <Li>
          <B>“App”</B> means the dailymattr application, including all content, features, updates and
          related services made available by us.
        </Li>
        <Li>
          <B>“AI Assistant”</B> means the artificial-intelligence assistant feature made available within
          the App, as described in <Ref to={9}>Section 9</Ref>.
        </Li>
        <Li>
          <B>“Content”</B> means all news summaries, text, graphics, images, audio, video, data,
          compilations and other material made available through the App.
        </Li>
        <Li>
          <B>“User Content”</B> means any content you submit, post or transmit through the App, including
          comments and inputs to the AI Assistant.
        </Li>
        <Li>
          <B>“User”, “you” or “your”</B> means any person who accesses or uses the App.
        </Li>
      </List>
    ),
  },
  {
    nav: "Eligibility",
    title: "Eligibility",
    body: (
      <P first>
        The App is intended for users who are <Hl>18 years of age or older</Hl>. By accessing or using the
        App, you represent and warrant that you are at least 18 years old, of sound mind, and competent to
        enter into a binding contract under applicable law, and that you are not barred from using the App
        under any applicable law.
      </P>
    ),
  },
  {
    nav: "The Service",
    title: "The Service",
    body: (
      <>
        <P first>
          dailymattr is a <Hl>news and infotainment platform</Hl> that curates, edits and presents
          summaries of news and information drawn from published news sources. Where appropriate,
          summaries may link to the corresponding source. When you follow such a link, you leave the App,
          and we are not responsible for the content, accuracy, availability or practices of those
          external sources.
        </P>
        <P>
          The summaries and curation presented within the App are our editorial product. While we take
          reasonable care in preparing them, they are provided for general information only, may be
          condensed, and may not capture the full context of the original source. You should refer to the
          original source and verify information before relying on it.
        </P>
        <P>
          The App may also contain or link to third-party websites, applications or materials, and may
          host content submitted by other users. We do not endorse, and are not responsible for, such
          third-party or user-submitted content, and you access it at your own risk.
        </P>
        <P>
          We may modify, suspend, add to or discontinue any part of the App at any time, with or without
          notice. We will not be liable to you or any third party for any such modification, suspension or
          discontinuance.
        </P>
      </>
    ),
  },
  {
    nav: "Licence to Use the App",
    title: "Licence to Use the App",
    body: (
      <>
        <P first>
          Subject to your compliance with this Agreement, we grant you a limited, personal, non-exclusive,
          non-transferable, non-sub-licensable and revocable licence to install and use the App on a device
          that you own or control, solely for your <Hl>personal, non-commercial use</Hl>.
        </P>
        <P>
          Except as expressly permitted, you may not copy, reproduce, modify, adapt, translate, create
          derivative works from, distribute, publicly display, sell, license, frame, scrape, data-mine or
          otherwise commercially exploit the App or any Content, in whole or in part, without our prior
          written consent.
        </P>
      </>
    ),
  },
  {
    nav: "Intellectual Property",
    title: "Intellectual Property",
    body: (
      <>
        <P first>
          The App, the dailymattr name and logo, and all Content, software, design, layout, selection,
          arrangement and compilation made available by us are owned by or licensed to the Company and are
          protected by intellectual-property and database rights and other laws. The curation and
          arrangement of Content reflects our editorial effort and is our proprietary compilation.
        </P>
        <P>
          Nothing in this Agreement transfers any intellectual-property rights to you. Source material
          referenced in summaries remains the property of the respective rights holders, and any use of
          such material beyond the App is governed by the terms of those rights holders. All rights not
          expressly granted to you are reserved.
        </P>
      </>
    ),
  },
  {
    nav: "Accounts and Security",
    title: "Accounts and Security",
    body: (
      <P first>
        Some features, such as posting comments and using the AI Assistant, require you to register and
        log in using your <B>phone number</B>. You are responsible for maintaining the confidentiality of
        your account credentials and for all activity that occurs under your account. You agree to provide
        accurate information, to keep it updated, and to notify us promptly of any unauthorised use of your
        account. We may suspend or terminate accounts that we reasonably believe are being misused or that
        breach this Agreement.
      </P>
    ),
  },
  {
    nav: "User Content and Conduct",
    title: "User Content and Conduct",
    body: (
      <>
        <P first>
          You are solely responsible for your User Content and for the consequences of posting or
          transmitting it. You represent that you own or have the necessary rights to your User Content and
          that it does not infringe any third-party rights or violate any law.
        </P>
        <P>
          By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free, transferable
          and sub-licensable licence to host, store, reproduce, display, adapt and distribute that User
          Content for the purpose of operating, promoting and improving the App, for as long as is
          necessary for those purposes and as permitted by law.
        </P>
        <P>
          You agree that you will not host, upload, post, transmit, share or otherwise make available any
          User Content, or use the App in any manner, that:
        </P>
        <List>
          <Li>
            is unlawful, harmful, defamatory, obscene, pornographic, paedophilic, invasive of another’s
            privacy, harassing, hateful, or that is racially or ethnically objectionable, or otherwise
            objectionable;
          </Li>
          <Li>is harmful to a child, or sexualises or endangers a minor in any way;</Li>
          <Li>
            infringes any patent, trademark, copyright, database right or other proprietary right of any
            person;
          </Li>
          <Li>
            is false, misleading or deceptive, or impersonates any person or entity, or misrepresents your
            affiliation with any person or entity;
          </Li>
          <Li>
            threatens the unity, integrity, defence, security or sovereignty of India, friendly relations
            with foreign States, or public order, or incites the commission of any cognisable offence;
          </Li>
          <Li>
            contains any virus, malware or code designed to interrupt, damage or limit the functioning of
            any software, hardware or system;
          </Li>
          <Li>violates any applicable law, regulation or third-party agreement; or</Li>
          <Li>
            attempts to gain unauthorised access to, interfere with, or disrupt the App, its servers or
            networks, or circumvent any security or access-control measure.
          </Li>
        </List>
        <P first>
          We are not obliged to monitor User Content, but we may review, moderate, refuse, edit or remove
          any User Content, and suspend or terminate accounts, at our discretion and in accordance with
          applicable law, where we reasonably believe this Agreement has been breached or removal is
          required by law.
        </P>
      </>
    ),
  },
  {
    nav: "AI Assistant",
    title: "AI Assistant",
    body: (
      <>
        <P first>
          The App may make available the AI Assistant, which you may use to explore, summarise or ask
          questions about news and infotainment content. Your use of the AI Assistant is subject to this
          Section and the rest of this Agreement.
        </P>
        <H3>9.1 Acceptable use</H3>
        <Sub>
          The AI Assistant is provided for lawful, personal and reasonable use in connection with the App.
          You agree that you will not:
        </Sub>
        <List>
          <Li>
            use the AI Assistant for any unlawful, fraudulent, harmful, harassing, abusive, defamatory or
            infringing purpose;
          </Li>
          <Li>use it to generate or spread misinformation, or content that impersonates any person or entity;</Li>
          <Li>use it to generate content that is obscene, hateful, sexually explicit, or harmful to minors;</Li>
          <Li>
            attempt to reverse-engineer, extract or copy the underlying models, prompts or training data, or
            to circumvent any usage limits, content filters or safety measures;
          </Li>
          <Li>
            access the AI Assistant through bots, scrapers or other automated means, or use it to send spam
            or bulk or automated requests;
          </Li>
          <Li>overload, disrupt, degrade or impair the AI Assistant or its supporting infrastructure; or</Li>
          <Li>
            use the AI Assistant for any purpose other than its intended use, or in a manner that is
            unnecessary, excessive, abusive of the feature, or that places an unreasonable burden on our
            systems.
          </Li>
        </List>
        <P first>
          We may monitor use of the AI Assistant for security, abuse-prevention and compliance purposes, and
          we may set usage limits and may restrict, suspend or withdraw access to the AI Assistant (in whole
          or in part) where we reasonably believe it is being misused or used in breach of this Agreement.
        </P>
        <H3>9.2 No reliance on AI outputs</H3>
        <Sub>
          The AI Assistant generates responses automatically, and its outputs may be inaccurate, incomplete
          or out of date. Its outputs do not constitute professional, legal, financial, medical or other
          advice. You are responsible for independently verifying any information before relying on or
          acting on it, and you use the AI Assistant at your own risk. You should not submit passwords,
          financial account details, sensitive information, or other people’s personal data to the AI
          Assistant. Our <PolicyLink /> explains how AI Assistant inputs are processed.
        </Sub>
      </>
    ),
  },
  {
    nav: "Advertising & Sponsored Content",
    title: "Advertising and Sponsored Content",
    body: (
      <>
        <P first>
          The App may display advertising or sponsored content. Where content is sponsored, we will identify
          it as such (for example, by labelling it “Ad”, “Sponsored” or similar), in line with our editorial
          independence standards. We do not control, endorse or accept responsibility for the products,
          services or statements of advertisers or sponsors, and any dealings you have with them are solely
          between you and them.
        </P>
        <Callout>
          We do <B>not</B> build advertising profiles of you or serve you targeted advertising based on
          profiling.
        </Callout>
      </>
    ),
  },
  {
    nav: "Fees",
    title: "Fees",
    body: (
      <P first>
        The App is currently provided <Hl>free of charge</Hl>. We reserve the right to introduce paid
        features, subscriptions or other charges in the future. Where we do, we will clearly describe the
        applicable fees and terms before you incur any charge, and your use of those paid features will be
        subject to the terms presented at that time.
      </P>
    ),
  },
  {
    nav: "Third-Party Services & App Stores",
    title: "Third-Party Services and App Stores",
    body: (
      <P first>
        You may download the App through third-party platforms such as the Google Play Store or the Apple
        App Store, and your download and use are also subject to those platforms’ terms. The App may rely on
        third-party services, including providers that power the AI Assistant. We are not responsible for
        third-party services, and your use of them may be subject to separate terms.
      </P>
    ),
  },
  {
    nav: "Privacy",
    title: "Privacy",
    body: (
      <P first>
        Your use of the App is also governed by our <PolicyLink />, which describes the personal data we
        collect and how we process it. By using the App, you acknowledge that you have read the Privacy
        Policy.
      </P>
    ),
  },
  {
    nav: "Disclaimers",
    title: "Disclaimers",
    body: (
      <>
        <P first>
          To the maximum extent permitted by law, the App and all Content, including news summaries and AI
          Assistant outputs, are provided on an <Hl>“as is” and “as available”</Hl> basis, without
          warranties of any kind, whether express, implied or statutory, including any implied warranties of
          merchantability, fitness for a particular purpose, accuracy, non-infringement or uninterrupted
          availability.
        </P>
        <P>
          We do not warrant that the App will be error-free, secure or available at all times, that defects
          will be corrected, or that the Content is accurate, complete or current. You use the App and rely
          on its Content at your own risk.
        </P>
      </>
    ),
  },
  {
    nav: "Limitation of Liability",
    title: "Limitation of Liability",
    body: (
      <>
        <P first>
          To the maximum extent permitted by law, the Company and its directors, officers, employees and
          agents will not be liable for any indirect, incidental, special, consequential, punitive or
          exemplary damages, or for any loss of profits, revenue, data, goodwill or business opportunity,
          arising out of or in connection with your use of, or inability to use, the App, even if advised of
          the possibility of such damages.
        </P>
        <P>
          To the maximum extent permitted by law, our total aggregate liability arising out of or in
          connection with the App or this Agreement will not exceed the greater of (a) the total amount you
          paid to us, if any, for the App in the twelve (12) months preceding the event giving rise to the
          claim, or (b) <B>INR 1,000</B>. Nothing in this Agreement excludes or limits liability that cannot
          be excluded or limited under applicable law.
        </P>
      </>
    ),
  },
  {
    nav: "Indemnity",
    title: "Indemnity",
    body: (
      <P first>
        You agree to indemnify, defend and hold harmless the Company and its directors, officers, employees
        and agents from and against any claims, demands, losses, liabilities, damages, costs and expenses
        (including reasonable legal fees) arising out of or in connection with your User Content, your use
        or misuse of the App, your breach of this Agreement, or your violation of any law or the rights of
        any third party.
      </P>
    ),
  },
  {
    nav: "Suspension and Termination",
    title: "Suspension and Termination",
    body: (
      <P first>
        We may suspend, restrict or terminate your access to the App or any feature, with or without notice,
        where we reasonably believe you have breached this Agreement, where required by law, or to protect
        the App, other users or third parties. You may stop using the App at any time and may request
        closure of your account. Provisions that by their nature should survive termination – including
        those on intellectual property, disclaimers, limitation of liability, indemnity and governing law –
        will survive.
      </P>
    ),
  },
  {
    nav: "Changes to the App and these Terms",
    title: "Changes to the App and these Terms",
    body: (
      <P first>
        We may update these Terms from time to time. When we make material changes, we will post the revised
        Terms within the App and update the “Last updated” date. Your continued use of the App after the
        changes take effect constitutes your acceptance of the revised Terms. If you do not agree to the
        changes, you should stop using the App.
      </P>
    ),
  },
  {
    nav: "Grievance Redressal",
    title: "Grievance Redressal",
    body: (
      <>
        <P first>
          In accordance with applicable law, the contact details of our Grievance Officer are set out below.
          The Grievance Officer can be contacted for any complaints regarding the App, Content or User
          Content, including requests to remove unlawful content.
        </P>
        <GrievanceCard />
        <P>
          We will acknowledge complaints and seek to resolve them within the timelines prescribed under
          applicable law.
        </P>
      </>
    ),
  },
  {
    nav: "Governing Law & Dispute Resolution",
    title: "Governing Law and Dispute Resolution",
    body: (
      <P first>
        This Agreement is governed by and construed in accordance with the laws of India. Any dispute arising
        out of or in connection with this Agreement will be referred to and finally resolved by arbitration
        by a sole arbitrator under the Arbitration and Conciliation Act, 1996. The seat and venue of
        arbitration will be Hyderabad, Telangana, and the proceedings will be conducted in English. Subject
        to the foregoing, the courts at Hyderabad, Telangana will have exclusive jurisdiction, and nothing in
        this Section limits any non-waivable rights you may have under applicable consumer-protection law.
      </P>
    ),
  },
  {
    nav: "General",
    title: "General",
    body: (
      <P first>
        If any provision of this Agreement is held to be invalid or unenforceable, that provision will be
        limited or removed to the minimum extent necessary, and the remaining provisions will remain in full
        force and effect. Our failure to enforce any provision is not a waiver of our right to do so later.
        You may not assign or transfer your rights under this Agreement without our prior written consent;
        we may assign our rights and obligations, including in connection with a merger, acquisition or sale
        of business. Neither party is liable for any failure or delay caused by events beyond its reasonable
        control. This Agreement, together with the Privacy Policy, constitutes the entire agreement between
        you and us regarding the App and supersedes any prior agreements on its subject matter.
      </P>
    ),
  },
  {
    nav: "Contact",
    title: "Contact",
    body: (
      <P first>
        For any questions about these Terms, please contact us at{" "}
        <a
          href={`mailto:${contactEmail}`}
          className="font-semibold break-words text-[#3979ff] underline-offset-2 hover:underline"
        >
          {contactEmail}
        </a>
        .
      </P>
    ),
  },
]
