import type { Answers, Lead, Result } from '../types'
import { QUESTIONS } from '../data/questions'

export interface Submission {
  submittedAt: string
  score: number
  level: string
  lead: Lead
  answers: {
    questionId: string
    question: string
    selected: { id: string; label: string }[]
    text: string
  }[]
}

const STORAGE_KEY = 'dhc:submissions'

/** Turns raw option ids into something a human (or a CRM) can read. */
export function buildSubmission(answers: Answers, lead: Lead, result: Result): Submission {
  return {
    submittedAt: new Date().toISOString(),
    score: result.score,
    level: result.level.label,
    lead,
    answers: QUESTIONS.map((question) => {
      const answer = answers[question.id] ?? { selected: [], text: '' }
      return {
        questionId: question.id,
        question: question.title,
        selected: answer.selected.map((id) => ({
          id,
          label: question.options.find((option) => option.id === id)?.label ?? id,
        })),
        text: answer.text,
      }
    }),
  }
}

/** Keeps a local copy so nothing is lost when no endpoint is configured (or it is down). */
function archiveLocally(submission: Submission): void {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    const history = Array.isArray(existing) ? existing : []
    history.push(submission)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-50)))
  } catch {
    // Private mode / storage disabled — the reveal screen still works, so don't block it.
  }
}

/**
 * Posts the submission when `VITE_LEAD_ENDPOINT` is set. A failed POST never blocks
 * the reveal: the lead is archived locally and the score is shown either way.
 */
export async function submitAssessment(submission: Submission): Promise<{ delivered: boolean }> {
  archiveLocally(submission)

  const endpoint = import.meta.env.VITE_LEAD_ENDPOINT
  if (!endpoint) {
    return { delivered: false }
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    })
    return { delivered: response.ok }
  } catch {
    return { delivered: false }
  }
}
