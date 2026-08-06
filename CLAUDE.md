# React Cert Quiz — Guía del Proyecto

## Stack
- Next.js 15+ (App Router) + React 19 + TypeScript strict
- Tailwind CSS v4 + shadcn/ui (Radix UI) + lucide-react
- Animaciones: framer-motion (respetar prefers-reduced-motion)
- Syntax highlighting: shiki
- Tests: Vitest + Testing Library
- Package manager: pnpm

## Comandos
```bash
pnpm dev          # servidor de desarrollo
pnpm build        # build de producción
pnpm lint         # eslint
pnpm test         # vitest run
pnpm test:watch   # vitest watch mode
```

## Convenciones de Código
- Componentes: nombres en inglés, PascalCase
- Textos de UI: español, centralizados en `src/lib/i18n/es.ts`
- Server Components por defecto; `'use client'` solo donde hay interactividad
- Cero `any`, cero `@ts-ignore`, cero `console.log` en producción
- Lógica de dominio en funciones puras en `src/lib/`
- Tests mínimo para: SRS, scoring, utils de progreso, validateTopics()

## Estructura
```
src/
  app/              # /, /temas/[slug], /flashcards, /quiz, /examen, /glosario, /analogias, /progreso
  components/       # ui/ (shadcn), study/, quiz/, flashcards/, layout/
  content/          # types.ts, validate.ts, topics/*.ts, glossary.ts, index.ts (registry)
  lib/              # srs.ts, scoring.ts, shuffle.ts, storage.ts, hooks/, i18n/
  tests/
```

## Reglas para Ejemplos de la Vida Real (Analogías)
1. Uno por tema, obligatorio — el proyecto NO compila sin él
2. Usar objetos/lugares/situaciones universales (filas, restaurantes, llaves, etc.)
3. Cero jerga técnica en el `scenario`; la jerga vive solo en `mapping`
4. `mapping`: mínimo 2, máximo 6 pares
5. Incluir `whereItBreaks` cuando la analogía pueda generar misconceptions
6. Reutilizar el mismo mundo si temas se relacionan
7. La analogía debe reaparecer en: explanation + ≥1 flashcard + ≥1 quiz
8. Máximo 4 líneas el scenario. Si hay que explicar la analogía, es mala
9. Cero referencias culturales locales o marcas
10. Prohibido usar analogías de programación para explicar programación

## Modelo de Contenido
- `realWorldAnalogy` es OBLIGATORIO (no optional)
- Todo `QuizQuestion` tiene `explanation` + `whyOthersAreWrong` por distractor
- Cada `KeyTerm` tiene `analogyHint` (≤15 palabras, cotidiano)
- Test `validateTopics()` falla si falta analogía o mapping < 2

## Persistencia
- localStorage via hook `usePersistentState<T>()`
- Validación con Zod, versionado de schema (v1)
- No rompe con storage vacío o corrupto

## Definition of Done
- pnpm dev/build/lint/test sin errores ni warnings
- Cero `any`, cero errores TS
- Todos los temas con realWorldAnalogy válida
- Cada tema retoma analogía en explanation, ≥1 flashcard, ≥1 quiz
- Funciona con localStorage vacío y datos corruptos
- Navegable 100% con teclado
- Responsive (mobile first)
- Dark mode por defecto + light mode
