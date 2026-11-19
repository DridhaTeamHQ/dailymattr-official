import { bands, lensOrder, type Edition, type LensKey } from "./content"

/**
 * Awareness = total closeness ÷ (3 × questions), as a rounded percentage.
 * Thinking style = the lens picked most often; on a tie, the lens of the tied pick that was
 * closest to the facts, and if that ties too, the earlier question's.
 */
export function scoreQuiz(edition: Edition, answers: number[]) {
  const picks = edition.questions.map((q, i) => q.options[answers[i]])
  const total = picks.reduce((sum, o) => sum + o.aw, 0)
  const pct = Math.round((total / (edition.questions.length * 3)) * 100)
  const band = bands.find((b) => pct >= b.min) ?? bands[bands.length - 1]

  const tally = { data: 0, systems: 0, skeptic: 0, optimist: 0 } satisfies Record<LensKey, number>
  for (const o of picks) tally[o.lens]++
  const top = Math.max(...lensOrder.map((k) => tally[k]))
  const tied = lensOrder.filter((k) => tally[k] === top)
  const lens =
    tied.length === 1
      ? tied[0]
      : // Array.prototype.sort is stable, so equal closeness keeps question order.
        [...picks].filter((o) => tied.includes(o.lens)).sort((a, b) => b.aw - a.aw)[0].lens

  return { picks, pct, band, lens, tally }
}

export type QuizResult = ReturnType<typeof scoreQuiz>
