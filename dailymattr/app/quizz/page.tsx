import { seoMetadata } from "@/lib/seo"
import { SeoJsonLd } from "@/components/shared/seo-json-ld"

import { QuizMain, QuizPicker } from "@/components/quizz"

export const generateMetadata = () => seoMetadata("/quizz")

export default function QuizzPage() {
  return (
    <QuizMain>
      <SeoJsonLd path="/quizz" />
      <QuizPicker />
    </QuizMain>
  )
}
