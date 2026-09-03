export type QuestionKind = 'single' | 'multi'

export interface Option {
  /** Stable id — used for answers, scoring and anything we send to the CRM. */
  id: string
  emoji: string
  label: string
  /** Points contributed to the Digital Maturity Score. Absent = unscored question. */
  score?: number
  /** Reveals a free-text box when the option is picked (e.g. "Other"). */
  withInput?: boolean
  inputPlaceholder?: string
  /** Multi-select only: picking this clears every other option (e.g. "None of the above"). */
  exclusive?: boolean
}

export interface FreeTextField {
  label: string
  placeholder: string
}

export interface Question {
  id: string
  kicker: string
  title: string
  hint?: string
  kind: QuestionKind
  options: Option[]
  /** Optional always-visible text box shown under the options. */
  freeText?: FreeTextField
}

export interface Answer {
  /** Option ids the user picked. Single-select questions hold at most one. */
  selected: string[]
  /** Free text from `freeText` or from a `withInput` option. */
  text: string
}

export type Answers = Record<string, Answer>

export interface Lead {
  name: string
  company: string
  phone: string
  whatsapp: string
  email: string
}

export interface MaturityLevel {
  min: number
  max: number
  emoji: string
  label: string
  vibe: string
  headline: string
  body: string
  accent: string
  gaugeFrom: string
  gaugeTo: string
}

export interface Result {
  score: number
  level: MaturityLevel
  quickWin: {
    title: string
    detail: string
  }
}
