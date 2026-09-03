import { useState } from 'react'
import { motion } from 'framer-motion'
import ScoreGauge from './ScoreGauge'
import type { Result } from '../types'

interface ResultScreenProps {
  result: Result
  firstName: string
  /** True once the full Q7 form has been submitted. */
  leadCaptured: boolean
  onCaptureEmail: (email: string) => void
  onRestart: () => void
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export default function ResultScreen({
  result,
  firstName,
  leadCaptured,
  onCaptureEmail,
  onRestart,
}: ResultScreenProps) {
  const { score, level, quickWin } = result
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const bookingUrl = import.meta.env.VITE_BOOKING_URL

  function handleEmailSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!EMAIL_PATTERN.test(email.trim())) {
      setEmailError("That email doesn't look right")
      return
    }
    setEmailError('')
    setEmailSent(true)
    onCaptureEmail(email.trim())
  }

  return (
    <div className="flex flex-col gap-6 pb-2">
      <motion.header {...fadeUp(0)} className="text-center">
        <p className="text-2xl" aria-hidden="true">
          🎉
        </p>
        <h2 className="mt-1 text-[22px] font-extrabold tracking-tight text-white sm:text-2xl">
          {firstName ? `${firstName}, your` : 'Your'} Digital Maturity Score
        </h2>
      </motion.header>

      <motion.div {...fadeUp(0.1)}>
        <ScoreGauge
          score={score}
          from={level.gaugeFrom}
          to={level.gaugeTo}
          label={level.label}
          emoji={level.emoji}
        />
      </motion.div>

      <motion.div {...fadeUp(0.25)} className="glass-card px-5 py-5 sm:px-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Level — {level.vibe}
        </p>
        <p className="mt-2 text-lg font-bold leading-snug text-white">{level.headline}</p>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-300">{level.body}</p>
      </motion.div>

      <motion.div
        {...fadeUp(0.35)}
        className="rounded-3xl border border-spark-400/25 bg-spark-500/[0.08] px-5 py-5 sm:px-6"
      >
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-spark-300">
          <span aria-hidden="true">💡</span> Your #1 Quick Win
        </p>
        <p className="mt-2 text-lg font-bold leading-snug text-white">{quickWin.title}</p>
        <p className="mt-1.5 text-[15px] leading-relaxed text-slate-300">{quickWin.detail}</p>
      </motion.div>

      {leadCaptured ? (
        <motion.p {...fadeUp(0.45)} className="text-center text-[15px] leading-relaxed text-slate-300">
          Ready to see exactly how? Our team will reach out{' '}
          <span className="font-semibold text-white">within 24 hours</span> with a tailored
          breakdown.
        </motion.p>
      ) : (
        <motion.form
          {...fadeUp(0.45)}
          onSubmit={handleEmailSubmit}
          className="glass-card px-5 py-5 sm:px-6"
        >
          {emailSent ? (
            <p className="text-center text-[15px] font-semibold text-spark-300">
              ✅ On its way — check your inbox shortly.
            </p>
          ) : (
            <>
              <p className="text-base font-bold text-white">Want the full breakdown?</p>
              <p className="mt-1 text-sm text-slate-400">
                Drop your email and we&apos;ll send the detailed report.
              </p>
              <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
                <input
                  className={`field flex-1 ${emailError ? 'border-rose-400/70' : ''}`}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  aria-label="Email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <button
                  type="submit"
                  className="flex items-center justify-center rounded-2xl border border-spark-400/40
                    bg-spark-500/15 px-6 py-3.5 text-base font-bold text-spark-300 transition
                    active:scale-[0.98] hover:bg-spark-500/25 sm:whitespace-nowrap"
                >
                  Send it
                </button>
              </div>
              {emailError ? (
                <p className="mt-2 text-xs font-medium text-rose-300">{emailError}</p>
              ) : null}
            </>
          )}
        </motion.form>
      )}

      <motion.div {...fadeUp(0.55)} className="flex flex-col gap-3">
        <a
          className="primary-btn"
          href={bookingUrl || 'mailto:hello@holdco.com?subject=Free%2015-min%20digital%20session'}
          target={bookingUrl ? '_blank' : undefined}
          rel="noreferrer"
        >
          <span>
            Book a Free 15-min Session with Holdco <span aria-hidden="true">→</span>
          </span>
        </a>
        <button type="button" onClick={onRestart} className="ghost-btn self-center">
          Retake the check
        </button>
      </motion.div>
    </div>
  )
}
