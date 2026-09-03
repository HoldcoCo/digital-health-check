import { motion } from 'framer-motion'

interface IntroScreenProps {
  onStart: () => void
}

const HIGHLIGHTS = [
  { emoji: '⚡', label: 'Under a minute' },
  { emoji: '🎯', label: 'Instant score' },
  { emoji: '💡', label: 'A tip you can use today' },
]

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="flex h-full flex-col justify-between px-5 pb-6 pt-10 sm:px-8 sm:pb-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-1 flex-col justify-center"
      >
        <div className="relative mb-7 flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 rounded-3xl bg-brand-500/30 animate-pulseRing" />
          <span className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.06] text-4xl">
            📊
          </span>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-300">
          Digital Health Check
        </p>

        <h1 className="mt-3 text-[34px] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl">
          How Digitally Ready
          <br />
          Is Your Business?
        </h1>

        <p className="mt-4 max-w-md text-base leading-relaxed text-slate-300 sm:text-lg">
          Answer 7 quick questions. Get your instant{' '}
          <span className="font-semibold text-white">Digital Maturity Score</span> plus a
          personalized tip. Takes less than a minute.
        </p>

        <ul className="mt-7 flex flex-wrap gap-2">
          {HIGHLIGHTS.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-2 text-[13px] font-semibold text-slate-300"
            >
              <span aria-hidden="true">{item.emoji}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15, ease: 'easeOut' }}
      >
        <button type="button" className="primary-btn" onClick={onStart}>
          Start Now <span aria-hidden="true">→</span>
        </button>
        <p className="mt-3 text-center text-xs text-slate-500">
          No spam. Your answers stay between us and your results.
        </p>
      </motion.div>
    </div>
  )
}
