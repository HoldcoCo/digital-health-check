import type { Answers, MaturityLevel, Result } from '../types'
import { QUESTIONS } from '../data/questions'

/**
 * Scoring is weighted on Q3, Q4 and Q5 only — heaviest on Q3 (how the business
 * actually runs today). Q1/Q2/Q6 are profiling, not scoring.
 */
const SCORED_QUESTIONS = ['q3', 'q4', 'q5'] as const

export const MAX_SCORE = 100

export const LEVELS: MaturityLevel[] = [
  {
    min: 0,
    max: 25,
    emoji: '🐣',
    label: 'Just Getting Started',
    vibe: 'Manual-heavy, huge opportunity',
    headline: "You're building on gut feel and grit — and it's working.",
    body: "But almost everything runs on manual effort right now, which means the biggest upside is also the fastest to unlock. Businesses at this stage typically reclaim 30–40% of admin time in the first 90 days simply by putting sales, finance and inventory on one system.",
    accent: '#ffc861',
    gaugeFrom: '#ff9d5c',
    gaugeTo: '#ffc861',
  },
  {
    min: 26,
    max: 50,
    emoji: '🦸',
    label: 'Manual Hero',
    vibe: 'Working hard, not smart yet',
    headline: "You're running a solid operation — but you're doing it the hard way.",
    body: 'Businesses like yours typically save 20–30% in operational time by connecting finance, sales & inventory into one system — same team, far less firefighting.',
    accent: '#8fb4ff',
    gaugeFrom: '#5d8dff',
    gaugeTo: '#8fb4ff',
  },
  {
    min: 51,
    max: 75,
    emoji: '⚙️',
    label: 'Systemized, Not Synced',
    vibe: 'Has tools, but disconnected',
    headline: 'You have the tools. They just refuse to talk to each other.',
    body: 'The gap now is integration, not software. Once your systems share one source of truth, reporting stops being a monthly scramble and starts being a live decision engine.',
    accent: '#7ff0d0',
    gaugeFrom: '#34e2ab',
    gaugeTo: '#7ff0d0',
  },
  {
    min: 76,
    max: 100,
    emoji: '🚀',
    label: 'Digitally Fluent',
    vibe: 'Modern setup, optimization play',
    headline: "You're ahead of most of your market — now it's an optimization game.",
    body: 'The wins from here are sharper: automation on the edges, AI-assisted forecasting, and squeezing real margin out of processes you already run well.',
    accent: '#7ff0d0',
    gaugeFrom: '#12c98d',
    gaugeTo: '#8fb4ff',
  },
]

/** The #1 quick win, keyed off the Q4 pain point they picked. */
const QUICK_WINS: Record<string, { title: string; detail: string }> = {
  slow: {
    title: 'Automate your three most repetitive workflows',
    detail: 'Pick the tasks your team retypes every week — quotes, invoices, stock updates — and let the system do them once.',
  },
  'no-visibility': {
    title: 'Centralize your reporting',
    detail: 'Stop chasing numbers across Excel sheets. One live dashboard beats five versions of the truth.',
  },
  silos: {
    title: 'Connect sales, finance and operations to one data layer',
    detail: 'When a sale updates stock and books revenue in the same moment, the hand-offs — and the arguments — disappear.',
  },
  inventory: {
    title: 'Put stock on a single live source of truth',
    detail: 'Real-time inventory kills the two most expensive surprises: dead stock and stockouts.',
  },
  finance: {
    title: 'Move financial tracking onto one automated ledger',
    detail: 'Close the month in days, not weeks — and stop reconciling numbers by hand.',
  },
  scale: {
    title: 'Fix the system backbone before you add headcount',
    detail: 'Scaling on manual processes multiplies the cost of every gap. Build the spine first, then grow into it.',
  },
}

const DEFAULT_QUICK_WIN = QUICK_WINS['no-visibility']

/** All option scores, flattened to `optionId -> points`, per question. */
const SCORE_MAP: Record<string, Record<string, number>> = Object.fromEntries(
  QUESTIONS.map((question) => [
    question.id,
    Object.fromEntries(
      question.options
        .filter((option) => typeof option.score === 'number')
        .map((option) => [option.id, option.score as number]),
    ),
  ]),
)

export function clamp(value: number, min = 0, max = MAX_SCORE): number {
  return Math.min(max, Math.max(min, value))
}

export function calculateScore(answers: Answers): number {
  const raw = SCORED_QUESTIONS.reduce((total, questionId) => {
    const selected = answers[questionId]?.selected ?? []
    const scores = SCORE_MAP[questionId] ?? {}
    return total + selected.reduce((sum, optionId) => sum + (scores[optionId] ?? 0), 0)
  }, 0)

  return clamp(raw)
}

export function levelForScore(score: number): MaturityLevel {
  const bounded = clamp(score)
  return LEVELS.find((level) => bounded >= level.min && bounded <= level.max) ?? LEVELS[0]
}

export function buildResult(answers: Answers): Result {
  const score = calculateScore(answers)
  const painPoint = answers.q4?.selected[0]

  return {
    score,
    level: levelForScore(score),
    quickWin: (painPoint && QUICK_WINS[painPoint]) || DEFAULT_QUICK_WIN,
  }
}
