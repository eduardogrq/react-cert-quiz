# React Cert Quiz — Project Guide

## Role & Expertise

You are a senior web developer with deep expertise in:
- **TypeScript** (strict mode, zero `any`, generics, branded types)
- **React 19** (Server Components, hooks rules, useSyncExternalStore, useMemo derivations)
- **Next.js 15+ App Router** (SSG with generateStaticParams, layouts, metadata API)
- **Tailwind CSS v4** (oklch color system, mobile-first responsive design)
- **shadcn/ui** (Radix primitives, composable components)
- **framer-motion** (animations: flip, collapse, fade, spring, stagger, gestures, layout)
- **Modern animations** (subtle, elegant, purposeful — never forced or exaggerated; only where they add meaning or delight)
- **UX/UI** (modern typography like Scrimba.com, generous spacing, clear visual hierarchy)
- **Pedagogy** (real-world analogies as primary teaching tool, SRS/SM-2 algorithm)

---

## Project Overview

Interactive study app for developer certifications. Currently configured for **Junior React Developer**, but designed to be reusable for any certification or programming language.

### Tech Stack
- Next.js 15+ App Router (SSG, no SSR)
- React 19 with TypeScript strict
- Tailwind CSS v4 (oklch, hue 265 violet/blue)
- shadcn/ui (Radix) + framer-motion
- Zod v4 for localStorage validation
- No backend, no DB, no auth — fully client-side with localStorage
- pnpm as package manager
- Vitest for testing

---

## Commands

```bash
pnpm dev          # development server
pnpm build        # production build
pnpm lint         # eslint
pnpm test         # vitest run
pnpm test:watch   # vitest watch mode
```

---

## Architecture

```
src/
├── config/course.ts        ← Central course config (badge, techLabel, exam defaults, storagePrefix, hue)
├── content/
│   ├── types.ts            ← Topic, Flashcard, QuizQuestion, RealWorldAnalogy, KeyTerm, CodeExample
│   ├── index.ts            ← Topic registry (all topics imported here)
│   ├── validate.ts         ← Build-time validation (analogies, flashcards, quiz)
│   └── topics/             ← 8 topic files (state, hooks, jsx, etc.)
├── lib/
│   ├── srs.ts              ← SM-2 algorithm (createNewSRSCard, reviewCard, isDue, getDueCards)
│   ├── scoring.ts          ← calculateScore, isPassing, getWeakTopics
│   ├── shuffle.ts          ← seededShuffle (LCG + Fisher-Yates)
│   ├── hooks/
│   │   ├── use-persistent-state.ts  ← Generic localStorage hook + Zod + storagePrefix from course config
│   │   └── use-srs-state.ts         ← SRS state connecting SM-2 to localStorage
│   └── i18n/es.ts          ← Spanish UI strings (imports course config for dynamic values)
├── components/
│   ├── layout/             ← AppHeader, ThemeProvider (useSyncExternalStore), CommandPalette (Cmd+K)
│   ├── study/              ← TopicView, AnalogyCard, CodeBlock
│   ├── flashcards/         ← FlashcardDeck (flip animation, keyboard shortcuts, SRS rating)
│   └── quiz/               ← QuizEngine, QuizResults, ExamTimer
├── app/
│   ├── page.tsx            ← Home (hero, stats, recommended action, topic list)
│   ├── temas/              ← Topic list + [slug] with SSG
│   ├── flashcards/         ← Topic selector + FlashcardDeck
│   ├── quiz/               ← Selector + QuizEngine
│   ├── examen/             ← Exam simulator (timer, navigator, flag for review)
│   ├── glosario/           ← Search/filter KeyTerms
│   ├── analogias/          ← Scroll view of all analogies
│   └── progreso/           ← Export/Import JSON + Reset
└── tests/                  ← srs.test.ts, scoring.test.ts, validate.test.ts (18 tests)
```

---

## Language Rules

- **All code is in English**: variables, functions, components, types, interfaces, comments, commit messages, file names.
- **UI-facing content is in Spanish**: strings in `src/lib/i18n/es.ts`, topic content (explanations, flashcards, quiz questions, analogies).
- **Technical terms** (useState, props, hooks, component, etc.) stay in English even within Spanish content.
- **Commits**: always in English, short, descriptive. Never push without explicit permission.

---

## Development Rules

1. **Every topic MUST have a real-world analogy** as the primary teaching tool. `validateTopics()` enforces this at build time.
2. **Content/UI separation** — data lives in typed TypeScript, UI is generic and reusable.
3. **To switch certification**: only modify `src/config/course.ts` + topics in `src/content/topics/` + registry in `src/content/index.ts`.
4. **Mobile-first responsive** — everything must look good at 375px+. Use `sm:` breakpoint for desktop upgrades.
5. **Typography**: Inter 17px base, line-height 1.6, letter-spacing -0.011em. Headings tight (-0.025em). JetBrains Mono for code.
6. **Never use `any`**. Never use `useEffect` to sync derived state (use `useMemo`). Never use `useState`+`useEffect` for external state (use `useSyncExternalStore`).
7. **Do not add unrequested features**, do not refactor unrelated code, do not add unnecessary comments/docstrings.
8. **localStorage** uses versioned prefix from course config (`rcq_v1_`), Zod validation, and fails gracefully if corrupt.
9. **Accessibility**: aria-labels, keyboard navigation (Space flip, 1-4 rate/select, Enter confirm, Cmd+K search).
10. **After every change**: verify `pnpm build` passes. Run `pnpm test` if touching `lib/` or `content/`.
11. **Git**: `git add` specific files + `git commit` after each significant change. Never push without permission. Never amend without permission.

---

## Visual Style

- Modern design inspired by Scrimba.com — large readable typography, generous whitespace
- oklch palette with hue 265 (violet/blue), chart-2 and chart-3 for accents
- Cards: `border-border/60`, `glow-sm` on hover, `rounded-xl`
- Subtle gradients: `from-primary/[0.06] via-primary/[0.03]`
- Full dark mode via oklch CSS variables
- Responsive: reduce padding/sizes on mobile, hide non-essential elements with `hidden sm:flex`

---

## Animation Philosophy

- **Subtle and elegant** — animations enhance comprehension, not distract. No bouncing, no excessive delays, no gratuitous motion.
- **Purposeful only** — animate where it communicates state change (page enter, list reveal, card flip, success/failure). Do NOT animate everything.
- **framer-motion is the sole animation library** — no additional CSS animation libraries needed. All reusable variants live in `src/lib/motion.ts`.
- **Performance-first** — use `transform` and `opacity` only (GPU-composited). Never animate `height`, `width`, or `top`/`left` directly except via framer-motion's layout animations.
- **Stagger sparingly** — 0.04–0.06s per item for lists. Longer staggers feel sluggish.
- **Springs over easings** — `springSnappy` (stiffness 300) for interactions, `springGentle` (stiffness 200) for entrances.
- **Gestures are micro** — `scale: 1.02` on hover, `scale: 0.98` on tap. Anything larger feels cartoonish.
- **Exit animations** — use `AnimatePresence` for elements that unmount. Exits should be faster than entrances.

---

## Solved Problems (Do Not Repeat)

- **React 19 lint `react-hooks/set-state-in-effect`** → use `useMemo` for derived state, `useSyncExternalStore` for external state (theme, etc.)
- **`prefer-const` in srs.ts** → always use `const` when variable is not reassigned
- **Horizontal overflow on mobile** → `overflow-x-hidden` on body, `truncate` + `min-w-0` + `shrink-0` on flex items, long text hidden/shortened on mobile with `hidden sm:inline`
- **Unused imports** → clean up before commit (causes build failure)

---

## Real-World Analogy Rules

1. One per topic, mandatory — project does NOT compile without it
2. Use universal objects/places/situations (queues, restaurants, keys, etc.)
3. Zero technical jargon in `scenario`; jargon lives only in `mapping`
4. `mapping`: minimum 2, maximum 6 pairs
5. Include `whereItBreaks` when the analogy could generate misconceptions
6. Reuse the same world if topics are related
7. The analogy must reappear in: explanation + ≥1 flashcard + ≥1 quiz question
8. Maximum 4 lines for scenario. If you need to explain the analogy, it's bad
9. Zero local cultural references or brands
10. Never use programming analogies to explain programming

---

## Content Model

- `realWorldAnalogy` is REQUIRED (not optional)
- `codeChallenge` is REQUIRED for every topic — fill-in-the-blank exercise testing the core concept
  - `instruction` and `hint` in Spanish; `template` code in English with `{{blank_id}}` markers
  - 2–5 blanks per challenge, each with 1–3 accepted answers (case-insensitive)
  - Must test the topic's central concept, not a tangential detail
  - The first answer in `answers[]` is used as the revealed solution — make it the most canonical/standard form
- Every `QuizQuestion` has `explanation` + `whyOthersAreWrong` per distractor
- Every `KeyTerm` has `analogyHint` (≤15 words, everyday language)
- Test `validateTopics()` fails if analogy is missing or mapping < 2

---

## Definition of Done

- `pnpm dev/build/lint/test` with zero errors and zero warnings
- Zero `any`, zero TS errors
- All topics with valid `realWorldAnalogy`
- All topics with a `codeChallenge` (2–5 blanks, tests core concept)
- Each topic reuses analogy in explanation, ≥1 flashcard, ≥1 quiz
- Works with empty localStorage and corrupt data
- 100% keyboard navigable
- Responsive (mobile first, no horizontal overflow)
- Dark mode by default + light mode toggle
