import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { MAX_SCORE } from '../lib/scoring'

interface ScoreGaugeProps {
  score: number
  from: string
  to: string
  label: string
  emoji: string
}

const SIZE = 260
const CENTER = SIZE / 2
/** The arc opens at the bottom, so we crop the unused sliver below it. */
const VIEW_HEIGHT = 214
const RADIUS = 104
const SWEEP = 260 // degrees of arc the gauge covers
const START_ANGLE = 90 + (360 - SWEEP) / 2 // bottom-centred opening
const DURATION = 1400

function polar(angleInDegrees: number) {
  const radians = (angleInDegrees * Math.PI) / 180
  return {
    x: CENTER + RADIUS * Math.cos(radians),
    y: CENTER + RADIUS * Math.sin(radians),
  }
}

/** The gauge track: one arc from START_ANGLE sweeping SWEEP degrees clockwise. */
const ARC_PATH = (() => {
  const start = polar(START_ANGLE)
  const end = polar(START_ANGLE + SWEEP)
  const largeArc = SWEEP > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`
})()

/** Counts from 0 to `target` on the same curve as the arc animation. */
function useCountUp(target: number, duration = DURATION) {
  const [value, setValue] = useState(0)
  const frame = useRef<number>()

  useEffect(() => {
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      // easeOutCubic — fast then settling, matching the arc's spring feel.
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) frame.current = requestAnimationFrame(tick)
    }

    frame.current = requestAnimationFrame(tick)
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [target, duration])

  return value
}

export default function ScoreGauge({ score, from, to, label, emoji }: ScoreGaugeProps) {
  const displayed = useCountUp(score)
  const fraction = Math.min(1, Math.max(0, score / MAX_SCORE))
  const gradientId = 'gauge-gradient'

  return (
    <div className="relative mx-auto w-full max-w-[260px]">
      <svg
        viewBox={`0 0 ${SIZE} ${VIEW_HEIGHT}`}
        className="w-full"
        role="img"
        aria-label={`Digital Maturity Score: ${score} out of ${MAX_SCORE}. Level: ${label}.`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>

        <path
          d={ARC_PATH}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="16"
          strokeLinecap="round"
        />

        <motion.path
          d={ARC_PATH}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="16"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          initial={{ strokeDashoffset: 1 }}
          animate={{ strokeDashoffset: 1 - fraction }}
          transition={{ duration: DURATION / 1000, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 12px ${to}55)` }}
        />
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-1">
        <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Your score
        </span>
        <div className="flex items-baseline">
          <span
            className="text-[64px] font-extrabold leading-none tracking-tight text-white tabular-nums"
            aria-hidden="true"
          >
            {displayed}
          </span>
          <span className="ml-1 text-xl font-bold text-slate-500">/{MAX_SCORE}</span>
        </div>
        <span className="mt-2 flex items-center gap-1.5 text-sm font-bold" style={{ color: to }}>
          <span aria-hidden="true">{emoji}</span> {label}
        </span>
      </div>
    </div>
  )
}
