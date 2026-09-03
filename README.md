# Digital Health Check

A tablet/mobile-first, swipeable quiz that scores a business's digital maturity in
under a minute, then hands the lead over with a personalized quick win and a
"book a session" CTA.

Built as a standalone **React + Vite + TypeScript + Tailwind** SPA.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173 (also served on the LAN for real-device testing)
npm run build    # type-check + production bundle into dist/
npm run preview  # serve the production build
```

`npm run dev` binds to `0.0.0.0`, so you can open the printed network URL on a
phone or tablet on the same Wi-Fi and test the real touch experience.

## Configuration

Copy `.env.example` to `.env` and fill in what you need — both values are optional.

| Variable | Effect |
| --- | --- |
| `VITE_LEAD_ENDPOINT` | Each completed assessment is `POST`ed here as JSON. Unset → submissions are archived in `localStorage` under `dhc:submissions` only. |
| `VITE_BOOKING_URL` | Destination of the "Book a Free 15-min Session with Holdco" button. Unset → falls back to a `mailto:` link. |

A failed or unconfigured POST never blocks the reveal — the score is always shown.

## The flow

| Step | Screen | Notes |
| --- | --- | --- |
| — | Intro | "How Digitally Ready Is Your Business?" → **Start Now** |
| 1 | Q1 — The Basics | Industry, multi-select, "Other" reveals a text input |
| 2 | Q2 — Size Check | Team size, single-select (auto-advances) |
| 3 | Q3 — The Reality Check | How the business runs today + a free-text box |
| 4 | Q4 — The Pain Point | Single-select (auto-advances) |
| 5 | Q5 — The Tech Pulse | Multi-select; "None of the above" is exclusive |
| 6 | Q6 — The Ambition Check | Single-select (auto-advances) |
| 7 | Q7 — Let's Talk | Name, Company, Phone, WhatsApp, Email → **Get My Score** |
| — | Reveal | Animated gauge, maturity level, #1 quick win, booking CTA |

Interaction details worth knowing:

- **Swipe** left/right anywhere on a question to move between steps; arrow keys do
  the same on a keyboard. Forward movement is blocked until the step is answered.
- Single-select questions **auto-advance** ~300 ms after a tap. Q3 doesn't, because
  it has a follow-up text box.
- The progress bar reports completed steps — `You're 57% done!`, `Almost there —
  you're 86% done!`.
- Q7 can be **skipped** ("just show my score"). The reveal then shows the one-tap
  fallback CTA: *"Want the full breakdown? Drop your email."*

## Scoring

The Digital Maturity Score is the sum of the weighted answers to **Q3, Q4 and Q5**,
clamped to 0–100. Q1, Q2 and Q6 are profiling only. Weights live next to each option
in `src/data/questions.ts`; the maths is in `src/lib/scoring.ts`.

| Question | Option | Points |
| --- | --- | --- |
| **Q3** (heaviest) | 📝 Mostly Excel, WhatsApp & paper | 10 |
| | 💻 A local/basic system, but disconnected tools | 15 |
| | ⚙️ An ERP, but it feels outdated or limited | 20 |
| | 🚀 A modern integrated system already | 60 |
| **Q4** | 🐢 Everything is slow / manual | 10 |
| | every other pain point | 15 |
| **Q5** (cumulative) | 🤖 AI / Automation tools | 5 |
| | ☁️ Cloud software | 3 |
| | 📱 Mobile apps for business | 5 |
| | 📊 Dashboards / analytics | 3 |
| | ❌ None of the above yet | 0 |

These weights top out at 91, so a perfect 100 isn't reachable by design — the ceiling
sits comfortably inside the top band. Change the numbers in `questions.ts` if you
want the scale to close.

| Score | Level | Vibe |
| --- | --- | --- |
| 0–25 | 🐣 Just Getting Started | Manual-heavy, huge opportunity |
| 26–50 | 🦸 Manual Hero | Working hard, not smart yet |
| 51–75 | ⚙️ Systemized, Not Synced | Has tools, but disconnected |
| 76–100 | 🚀 Digitally Fluent | Modern setup, optimization play |

The **#1 Quick Win** on the reveal is keyed off the Q4 pain point, so two people with
the same score can get different advice.

## Structure

```
src/
  App.tsx                    step machine, swipe/keyboard nav, submission
  data/questions.ts          all copy, options, emojis and scoring weights
  lib/scoring.ts             score, maturity levels, quick wins
  lib/submit.ts              payload shape, POST + localStorage archive
  components/
    IntroScreen.tsx
    ProgressBar.tsx
    QuestionScreen.tsx       renders any question from the data file
    OptionCard.tsx           tap target, single/multi, inline "Other" input
    LeadForm.tsx             Q7 + validation
    ResultScreen.tsx         reveal + CTAs
    ScoreGauge.tsx           animated SVG arc with count-up
```

Adding or reordering a question means editing `src/data/questions.ts` — nothing else.
