/**
 * Course Configuration
 *
 * This is the single source of truth for certification/course metadata.
 * To adapt the app for a different certification or language:
 *   1. Update this file with the new course info
 *   2. Replace/add topic files in src/content/topics/
 *   3. Update src/content/index.ts registry
 *
 * The rest of the UI automatically adapts.
 */

export interface CourseConfig {
  /** Internal course ID (used for localStorage namespacing) */
  id: string;
  /** Display name shown in the header and hero */
  name: string;
  /** Short badge label (e.g., "Junior React Developer") */
  badge: string;
  /** One-line description for meta/SEO */
  description: string;
  /** The technical domain label used in analogy mapping tables
   *  e.g., "En React/JS" or "En Python" or "En AWS" */
  techLabel: string;
  /** Default exam configuration */
  exam: {
    defaultQuestions: number;
    defaultDurationMinutes: number;
    defaultCutoff: number;
  };
  /** localStorage key prefix to avoid collisions between courses */
  storagePrefix: string;
  /** Primary color hue (oklch) — allows visual theming per course */
  hue?: number;
}

export const course: CourseConfig = {
  id: 'react-cert',
  name: 'React Cert Quiz',
  badge: 'React Developer (Level 1 & 2)',
  description: 'Repaso interactivo para las certificaciones React Developer Level 1 y 2 — flashcards con SRS, quizzes, simulacro de examen y analogías del mundo real.',
  techLabel: 'En React/JS',
  exam: {
    defaultQuestions: 50,
    defaultDurationMinutes: 90,
    defaultCutoff: 70,
  },
  storagePrefix: 'rcq_v1_',
  hue: 265,
};
