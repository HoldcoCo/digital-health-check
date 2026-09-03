import OptionCard from './OptionCard'
import type { Answer, Question } from '../types'

interface QuestionScreenProps {
  question: Question
  answer: Answer
  onChange: (answer: Answer) => void
}

export default function QuestionScreen({ question, answer, onChange }: QuestionScreenProps) {
  const multi = question.kind === 'multi'

  function toggle(optionId: string) {
    const option = question.options.find((candidate) => candidate.id === optionId)
    if (!option) return

    if (!multi) {
      onChange({ ...answer, selected: [optionId] })
      return
    }

    const alreadySelected = answer.selected.includes(optionId)

    // "None of the above" clears everything else — and any other pick clears it.
    if (option.exclusive) {
      onChange({ ...answer, selected: alreadySelected ? [] : [optionId] })
      return
    }

    const exclusiveIds = question.options.filter((o) => o.exclusive).map((o) => o.id)
    const next = alreadySelected
      ? answer.selected.filter((id) => id !== optionId)
      : [...answer.selected.filter((id) => !exclusiveIds.includes(id)), optionId]

    onChange({ ...answer, selected: next })
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="animate-floatUp">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-300">
          {question.kicker}
        </p>
        <h2 className="mt-2 text-[26px] font-extrabold leading-[1.15] tracking-tight text-white sm:text-[32px]">
          {question.title}
        </h2>
        {question.hint ? (
          <p className="mt-2 text-sm font-medium text-slate-400">{question.hint}</p>
        ) : null}
      </header>

      <div className="flex flex-col gap-2.5" role={multi ? 'group' : 'radiogroup'}>
        {question.options.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            multi={multi}
            selected={answer.selected.includes(option.id)}
            onSelect={() => toggle(option.id)}
            inputSlot={
              option.withInput ? (
                <input
                  className="field"
                  type="text"
                  autoComplete="off"
                  value={answer.text}
                  placeholder={option.inputPlaceholder ?? 'Type here…'}
                  aria-label={option.label}
                  onChange={(event) => onChange({ ...answer, text: event.target.value })}
                />
              ) : undefined
            }
          />
        ))}
      </div>

      {question.freeText ? (
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-400">{question.freeText.label}</span>
          <textarea
            className="field min-h-[84px] resize-none"
            rows={2}
            value={answer.text}
            placeholder={question.freeText.placeholder}
            onChange={(event) => onChange({ ...answer, text: event.target.value })}
          />
        </label>
      ) : null}
    </div>
  )
}
