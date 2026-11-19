import { seoMetadata } from "@/lib/seo"

import { QuizMain, QuizPicker } from "@/components/quizz"

export const generateMetadata = () => seoMetadata("/quizz")

export default function QuizzPage() {
  return (
    <QuizMain>
      <QuizPicker />
    </QuizMain>
  )
}
