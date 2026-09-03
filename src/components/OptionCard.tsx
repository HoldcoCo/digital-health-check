import type { Option } from '../types'

interface OptionCardProps {
  option: Option
  selected: boolean
  multi: boolean
  onSelect: () => void
  /** Rendered inside the card when a `withInput` option is selected. */
  inputSlot?: React.ReactNode
}

export default function OptionCard({
  option,
  selected,
  multi,
  onSelect,
  inputSlot,
}: OptionCardProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-colors duration-200 ${
        selected
          ? 'border-brand-400/70 bg-brand-500/[0.14] shadow-glow'
          : 'border-white/10 bg-white/[0.035] hover:border-white/20'
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition active:scale-[0.985] sm:px-5 sm:py-4"
      >
        <span className="text-2xl leading-none sm:text-[28px]" aria-hidden="true">
          {option.emoji}
        </span>

        <span
          className={`flex-1 text-[15px] font-semibold leading-snug sm:text-base ${
            selected ? 'text-white' : 'text-slate-200'
          }`}
        >
          {option.label}
        </span>

        <span
          aria-hidden="true"
          className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 transition ${
            multi ? 'rounded-md' : 'rounded-full'
          } ${
            selected
              ? 'border-brand-400 bg-brand-400 text-ink-950'
              : 'border-white/20 bg-transparent text-transparent'
          }`}
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 8.5 6.5 12 13 4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {selected && inputSlot ? <div className="px-4 pb-4 sm:px-5">{inputSlot}</div> : null}
    </div>
  )
}
