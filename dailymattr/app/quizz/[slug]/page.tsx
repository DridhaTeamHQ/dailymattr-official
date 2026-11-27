import { Suspense } from "react"
import { notFound } from "next/navigation"

import { seoMetadata } from "@/lib/seo"
import { SeoJsonLd } from "@/components/shared/seo-json-ld"

import { Quiz, QuizMain, QuizSkeleton } from "@/components/quizz"
import { editions, getEdition, quizPath } from "@/components/quizz/content"

type Params = PageProps<"/quizz/[slug]">["params"]

/** Prerender one quiz page per News IQ story. */
export function generateStaticParams() {
  return editions.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: PageProps<"/quizz/[slug]">) {
  const { slug } = await params
  return seoMetadata(quizPath(slug))
}

/**
 * /quizz/<slug>: the story's start screen (photo, headline, how it works), then its questions
 * and report. The frame renders at once and
 * the quiz streams in below it, so a click from /quizz navigates instantly (params are read
 * inside the Suspense boundary, not at the top of the page).
 */
export default function QuizStoryPage({ params }: PageProps<"/quizz/[slug]">) {
  return (
    <QuizMain>
      <Suspense fallback={<QuizSkeleton />}>
        <StoryQuiz params={params} />
      </Suspense>
    </QuizMain>
  )
}

async function StoryQuiz({ params }: { params: Params }) {
  const { slug } = await params
  // Unknown slugs are a 404.
  if (!getEdition(slug)) notFound()
  // Keyed by story so moving between stories always starts fresh at question 1.
  return (
    <>
      <SeoJsonLd path={quizPath(slug)} />
      <Quiz key={slug} slug={slug} />
    </>
  )
}
