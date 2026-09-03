import { motion } from 'framer-motion'

interface ProgressBarProps {
  /** 1-based index of the step currently on screen. */
  current: number
  total: number
  onBack?: () => void
  canGoBack: boolean
}

export default function ProgressBar({ current, total, onBack, canGoBack }: ProgressBarProps) {
  const percent = Math.round(((current - 1) / total) * 100)
  const message =
    percent === 0
      ? "Let's go — 7 quick questions"
      : percent >= 85
        ? `Almost there — you're ${percent}% done!`
        : `You're ${percent}% done!`

  return (
    <div className="px-5 pt-4 sm:px-8">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          className="ghost-btn -ml-3"
          aria-label="Previous question"
        >
          <span aria-hidden="true">←</span> Back
        </button>
        <p className="text-sm font-semibold text-slate-400">
          <span className="text-slate-200">{current}</span> / {total}
        </p>
      </div>

      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.07]"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Assessment progress"
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 via-brand-400 to-spark-400"
          initial={false}
          animate={{ width: `${Math.max(percent, 4)}%` }}
          transition={{ type: 'spring', stiffness: 140, damping: 22 }}
        />
      </div>

      <p className="mt-2 text-[13px] font-semibold text-spark-300">{message}</p>
    </div>
  )
}
