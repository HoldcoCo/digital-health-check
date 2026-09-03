import { useState } from 'react'
import type { Lead } from '../types'

interface LeadFormProps {
  lead: Lead
  onChange: (lead: Lead) => void
  onSubmit: () => void
  submitting: boolean
}

type FieldName = keyof Lead

interface FieldConfig {
  name: FieldName
  label: string
  placeholder: string
  type: string
  autoComplete: string
  inputMode?: 'text' | 'tel' | 'email'
  required?: boolean
}

const FIELDS: FieldConfig[] = [
  { name: 'name', label: 'Name', placeholder: 'Your full name', type: 'text', autoComplete: 'name', required: true },
  { name: 'company', label: 'Company', placeholder: 'Company name', type: 'text', autoComplete: 'organization' },
  { name: 'phone', label: 'Phone', placeholder: '+971 50 000 0000', type: 'tel', autoComplete: 'tel', inputMode: 'tel', required: true },
  { name: 'whatsapp', label: 'WhatsApp', placeholder: '+971 50 000 0000', type: 'tel', autoComplete: 'tel', inputMode: 'tel' },
  { name: 'email', label: 'Email', placeholder: 'you@company.com', type: 'email', autoComplete: 'email', inputMode: 'email', required: true },
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_PATTERN = /^[+]?[\d\s()-]{7,}$/

export function validateLead(lead: Lead): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {}

  if (!lead.name.trim()) errors.name = 'We need a name to address your results'
  if (!lead.email.trim()) errors.email = 'Your score report goes here'
  else if (!EMAIL_PATTERN.test(lead.email.trim())) errors.email = "That email doesn't look right"
  if (!lead.phone.trim()) errors.phone = 'So we can reach you for the free session'
  else if (!PHONE_PATTERN.test(lead.phone.trim())) errors.phone = "That number doesn't look right"
  if (lead.whatsapp.trim() && !PHONE_PATTERN.test(lead.whatsapp.trim())) {
    errors.whatsapp = "That number doesn't look right"
  }

  return errors
}

export default function LeadForm({ lead, onChange, onSubmit, submitting }: LeadFormProps) {
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [sameAsPhone, setSameAsPhone] = useState(false)

  function update(name: FieldName, value: string) {
    const next = { ...lead, [name]: value }
    if (name === 'phone' && sameAsPhone) next.whatsapp = value
    onChange(next)
    if (errors[name]) setErrors({ ...errors, [name]: undefined })
  }

  function toggleSameAsPhone(checked: boolean) {
    setSameAsPhone(checked)
    if (checked) {
      onChange({ ...lead, whatsapp: lead.phone })
      setErrors({ ...errors, whatsapp: undefined })
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const found = validateLead(lead)
    setErrors(found)
    if (Object.keys(found).length === 0) onSubmit()
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      <header className="animate-floatUp">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-300">
          Q7 — Let&apos;s Talk
        </p>
        <h2 className="mt-2 text-[26px] font-extrabold leading-[1.15] tracking-tight text-white sm:text-[32px]">
          Want your personalized results + a free 15-min consultation?
        </h2>
        <p className="mt-2 text-sm font-medium text-slate-400">
          Your score is ready — tell us where to send the full breakdown.
        </p>
      </header>

      <div className="flex flex-col gap-3.5">
        {FIELDS.map((field) => (
          <label key={field.name} className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-slate-300">
              {field.label}
              {field.required ? <span className="text-brand-300"> *</span> : null}
            </span>
            <input
              className={`field ${errors[field.name] ? 'border-rose-400/70 focus:ring-rose-500/20' : ''}`}
              type={field.type}
              inputMode={field.inputMode}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              value={lead[field.name]}
              disabled={field.name === 'whatsapp' && sameAsPhone}
              aria-invalid={Boolean(errors[field.name])}
              onChange={(event) => update(field.name, event.target.value)}
            />
            {errors[field.name] ? (
              <span className="text-xs font-medium text-rose-300">{errors[field.name]}</span>
            ) : null}

            {field.name === 'phone' ? (
              <button
                type="button"
                onClick={() => toggleSameAsPhone(!sameAsPhone)}
                className="mt-1 flex items-center gap-2 self-start text-xs font-semibold text-slate-400 transition hover:text-slate-200"
                aria-pressed={sameAsPhone}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-4 w-4 items-center justify-center rounded border-2 text-[10px] ${
                    sameAsPhone
                      ? 'border-brand-400 bg-brand-400 text-ink-950'
                      : 'border-white/25 text-transparent'
                  }`}
                >
                  ✓
                </span>
                WhatsApp is the same number
              </button>
            ) : null}
          </label>
        ))}
      </div>

      <button type="submit" className="primary-btn" disabled={submitting}>
        {submitting ? 'Crunching your answers…' : 'Get My Score →'}
      </button>
    </form>
  )
}
