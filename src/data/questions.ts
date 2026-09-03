import type { Question } from '../types'

/**
 * The 7-step Digital Health Check. Q1–Q6 live here; Q7 is the lead form,
 * which is rendered by its own component but counted as step 7 in the progress bar.
 */
export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    kicker: 'Q1 — The Basics',
    title: "What's your business playing field?",
    hint: 'Tap all that apply',
    kind: 'multi',
    options: [
      { id: 'manufacturing', emoji: '🏭', label: 'Manufacturing' },
      { id: 'retail', emoji: '🛒', label: 'Retail / Trading' },
      { id: 'construction', emoji: '🏗️', label: 'Construction / Real Estate' },
      { id: 'services', emoji: '💼', label: 'Services' },
      { id: 'healthcare', emoji: '🏥', label: 'Healthcare' },
      { id: 'finance', emoji: '🏦', label: 'Finance' },
      { id: 'education', emoji: '🎓', label: 'Education' },
      {
        id: 'other',
        emoji: '✨',
        label: 'Other',
        withInput: true,
        inputPlaceholder: 'Tell us your industry…',
      },
    ],
  },
  {
    id: 'q2',
    kicker: 'Q2 — Size Check',
    title: 'How big is your team?',
    kind: 'single',
    options: [
      { id: 'solo', emoji: '🧍', label: 'Just me / under 5' },
      { id: '5-20', emoji: '👥', label: '5–20' },
      { id: '21-50', emoji: '👥', label: '21–50' },
      { id: '51-100', emoji: '🏢', label: '51–100' },
      { id: '100plus', emoji: '🏙️', label: '100+' },
    ],
  },
  {
    id: 'q3',
    kicker: 'Q3 — The Reality Check',
    title: 'How does your business run today?',
    kind: 'single',
    options: [
      { id: 'manual', emoji: '📝', label: 'Mostly Excel, WhatsApp & paper', score: 10 },
      { id: 'basic', emoji: '💻', label: 'A local/basic system, but disconnected tools', score: 15 },
      { id: 'legacy-erp', emoji: '⚙️', label: 'An ERP, but it feels outdated or limited', score: 20 },
      { id: 'modern', emoji: '🚀', label: 'A modern integrated system already', score: 60 },
    ],
    freeText: {
      label: 'Anything else about your setup?',
      placeholder: 'e.g. we run Odoo for finance, everything else is manual…',
    },
  },
  {
    id: 'q4',
    kicker: 'Q4 — The Pain Point',
    title: 'If you could wave a magic wand and fix ONE thing tomorrow, what would it be?',
    kind: 'single',
    options: [
      { id: 'slow', emoji: '🐢', label: 'Everything is slow / manual', score: 10 },
      { id: 'no-visibility', emoji: '🙈', label: "I can't see real-time numbers or reports", score: 15 },
      { id: 'silos', emoji: '🧩', label: "My departments don't talk to each other", score: 15 },
      { id: 'inventory', emoji: '📦', label: 'Inventory / stock is a mess', score: 15 },
      { id: 'finance', emoji: '💸', label: 'Financial tracking is a nightmare', score: 15 },
      { id: 'scale', emoji: '📈', label: "I want to grow but my systems can't scale", score: 15 },
    ],
  },
  {
    id: 'q5',
    kicker: 'Q5 — The Tech Pulse',
    title: 'Do you currently use any of these?',
    hint: 'Tap all that apply',
    kind: 'multi',
    options: [
      { id: 'ai', emoji: '🤖', label: 'AI / Automation tools', score: 5 },
      { id: 'cloud', emoji: '☁️', label: 'Cloud software', score: 3 },
      { id: 'mobile', emoji: '📱', label: 'Mobile apps for business', score: 5 },
      { id: 'dashboards', emoji: '📊', label: 'Dashboards / analytics', score: 3 },
      { id: 'none', emoji: '❌', label: 'None of the above yet', score: 0, exclusive: true },
    ],
  },
  {
    id: 'q6',
    kicker: 'Q6 — The Ambition Check',
    title: 'Where do you see your business in 12 months?',
    kind: 'single',
    options: [
      { id: 'smoother', emoji: '🌱', label: 'Same size, just running smoother' },
      { id: 'growing', emoji: '📈', label: 'Growing / expanding' },
      { id: 'regional', emoji: '🌍', label: 'Scaling regionally' },
      { id: 'overhaul', emoji: '🔄', label: 'Considering a full digital overhaul' },
    ],
  },
]

/** Q1–Q6 plus the lead form. Drives the progress bar. */
export const TOTAL_STEPS = QUESTIONS.length + 1
