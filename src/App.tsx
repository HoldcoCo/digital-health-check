import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import IntroScreen from './components/IntroScreen'
import LeadForm from './components/LeadForm'
import ProgressBar from './components/ProgressBar'
import QuestionScreen from './components/QuestionScreen'
import ResultScreen from './components/ResultScreen'
import { QUESTIONS, TOTAL_STEPS } from './data/questions'
import { buildResult } from './lib/scoring'
import { buildSubmission, submitAssessment } from './lib/submit'
import type { Answer, Answers, Lead, Result } from './types'

type Stage = 'intro' | 'questions' | 'result'

const EMPTY_ANSWER: Answer = { selected: [], text: '' }
const EMPTY_LEAD: Lead = { name: '', company: '', phone: '', whatsapp: '', email: '' }

/** Index of the lead form within the step sequence (Q1–Q6, then Q7). */
const LEAD_STEP = QUESTIONS.length

const SWIPE_DISTANCE = 70
const SWIPE_VELOCITY = 380

const slide = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 48 : -48 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -48 : 48 }),
}

export default function App() {
  const [stage, setStage] = useState<Stage>('intro')
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [answers, setAnswers] = useState<Answers>({})
  const [lead, setLead] = useState<Lead>(EMPTY_LEAD)
  const [leadCaptured, setLeadCaptured] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const advanceTimer = useRef<ReturnType<typeof setTimeout>>()

  const question = step < LEAD_STEP ? QUESTIONS[step] : null
  const answer = question ? (answers[question.id] ?? EMPTY_ANSWER) : EMPTY_ANSWER
  const canAdvance = question ? answer.selected.length > 0 : false

  useEffect(() => () => clearTimeout(advanceTimer.current), [])

  // Every step starts at the top — otherwise a long question inherits the last scroll position.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [step, stage])

  const goTo = useCallback((nextStep: number, nextDirection: number) => {
    clearTimeout(advanceTimer.current)
    setDirection(nextDirection)
    setStep(nextStep)
  }, [])

  const goNext = useCallback(() => {
    if (step < LEAD_STEP && answers[QUESTIONS[step].id]?.selected.length) {
      goTo(step + 1, 1)
    }
  }, [answers, goTo, step])

  const goBack = useCallback(() => {
    if (step > 0) goTo(step - 1, -1)
  }, [goTo, step])

  function updateAnswer(questionId: string, next: Answer) {
    setAnswers((previous) => ({ ...previous, [questionId]: next }))

    // Single-select questions without a follow-up text box advance on their own —
    // that's what makes the quiz feel fast on a tablet.
    const current = QUESTIONS.find((item) => item.id === questionId)
    const index = QUESTIONS.findIndex((item) => item.id === questionId)
    if (current && current.kind === 'single' && !current.freeText && next.selected.length > 0) {
      clearTimeout(advanceTimer.current)
      advanceTimer.current = setTimeout(() => goTo(index + 1, 1), 300)
    }
  }

  async function finish(finalLead: Lead, captured: boolean) {
    setSubmitting(true)
    const computed = buildResult(answers)
    setResult(computed)
    setLeadCaptured(captured)

    await submitAssessment(buildSubmission(answers, finalLead, computed))

    setSubmitting(false)
    setStage('result')
  }

  /** Result screen fallback: they skipped the form but dropped an email for the breakdown. */
  async function captureEmail(email: string) {
    const nextLead = { ...lead, email }
    setLead(nextLead)
    if (!result) return
    await submitAssessment(buildSubmission(answers, nextLead, result))
  }

  function restart() {
    clearTimeout(advanceTimer.current)
    setAnswers({})
    setLead(EMPTY_LEAD)
    setResult(null)
    setLeadCaptured(false)
    setStep(0)
    setDirection(1)
    setStage('intro')
  }

  function handleDragEnd(_event: unknown, info: PanInfo) {
    const { offset, velocity } = info
    const swipedLeft = offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY
    const swipedRight = offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY

    if (swipedLeft) goNext()
    else if (swipedRight) goBack()
  }

  // Arrow keys for anyone running this on a laptop or kiosk with a keyboard.
  useEffect(() => {
    if (stage !== 'questions') return

    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return
      if (event.key === 'ArrowRight') goNext()
      if (event.key === 'ArrowLeft') goBack()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goBack, goNext, stage])

  const firstName = useMemo(() => lead.name.trim().split(/\s+/)[0] ?? '', [lead.name])

  return (
    <>
      <div className="aurora" aria-hidden="true" />

      <main className="app-shell">
        {stage === 'intro' ? (
          <IntroScreen
            onStart={() => {
              setStage('questions')
              setStep(0)
              setDirection(1)
            }}
          />
        ) : null}

        {stage === 'questions' ? (
          <>
            <ProgressBar
              current={step + 1}
              total={TOTAL_STEPS}
              onBack={goBack}
              canGoBack={step > 0}
            />

            <div ref={scrollRef} className="no-scrollbar flex-1 overflow-y-auto px-5 py-6 sm:px-8">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.24, ease: 'easeOut' }}
                  drag="x"
                  dragDirectionLock
                  dragElastic={0.16}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  className="touch-pan-y"
                >
                  {question ? (
                    <QuestionScreen
                      question={question}
                      answer={answer}
                      onChange={(next) => updateAnswer(question.id, next)}
                    />
                  ) : (
                    <LeadForm
                      lead={lead}
                      onChange={setLead}
                      submitting={submitting}
                      onSubmit={() => finish(lead, true)}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="px-5 pb-6 pt-2 sm:px-8">
              {question ? (
                <>
                  <button type="button" className="primary-btn" onClick={goNext} disabled={!canAdvance}>
                    Continue <span aria-hidden="true">→</span>
                  </button>
                  <p className="mt-3 text-center text-xs text-slate-500">
                    Swipe left or right to move between questions
                  </p>
                </>
              ) : (
                <button
                  type="button"
                  className="ghost-btn mx-auto"
                  onClick={() => finish(lead, false)}
                  disabled={submitting}
                >
                  Skip — just show my score
                </button>
              )}
            </div>
          </>
        ) : null}

        {stage === 'result' && result ? (
          <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-8 sm:px-8">
            <ResultScreen
              result={result}
              firstName={firstName}
              leadCaptured={leadCaptured}
              onCaptureEmail={captureEmail}
              onRestart={restart}
            />
          </div>
        ) : null}
      </main>
    </>
  )
}
