/**
 * Multi-Course Configuration
 *
 * Each course represents a certification/language track.
 * To add a new course (e.g., Python):
 *   1. Add a new entry to the `courses` array below
 *   2. Create topic files in src/content/topics/
 *   3. Register them in src/content/index.ts with the courseId
 *
 * The UI automatically adapts to show course selection.
 */

export interface CourseConfig {
  /** Internal course ID */
  id: string;
  /** Display name */
  name: string;
  /** Short badge label */
  badge: string;
  /** One-line description */
  description: string;
  /** Technical domain label for analogy mapping tables */
  techLabel: string;
  /** Default exam configuration */
  exam: {
    defaultQuestions: number;
    defaultDurationMinutes: number;
    defaultCutoff: number;
  };
  /** Primary color hue (oklch) — visual theming per course */
  hue: number;
}

export interface AppConfig {
  /** App-wide name */
  name: string;
  /** localStorage key prefix */
  storagePrefix: string;
  /** All available courses */
  courses: CourseConfig[];
}

export const appConfig: AppConfig = {
  name: 'React Cert Quiz',
  storagePrefix: 'rcq_v1_',
  courses: [
    {
      id: 'react-level-1',
      name: 'React Level 1',
      badge: 'Junior React Developer',
      description: 'Fundamentos de React: JSX, componentes, props, estado, hooks y routing.',
      techLabel: 'En React/JS',
      exam: {
        defaultQuestions: 30,
        defaultDurationMinutes: 60,
        defaultCutoff: 70,
      },
      hue: 265,
    },
    {
      id: 'react-level-2',
      name: 'React Level 2',
      badge: 'Intermediate React Developer',
      description: 'React intermedio: componentes puros, Context, hooks avanzados, TypeScript y tooling.',
      techLabel: 'En React/JS',
      exam: {
        defaultQuestions: 40,
        defaultDurationMinutes: 90,
        defaultCutoff: 70,
      },
      hue: 220,
    },
  ],
};

/** Helper to get a course by ID */
export function getCourseById(id: string): CourseConfig | undefined {
  return appConfig.courses.find((c) => c.id === id);
}

/** Legacy single-course export for backward compatibility in i18n and components */
export const course = {
  id: appConfig.courses[0].id,
  name: appConfig.name,
  badge: appConfig.courses[0].badge,
  description: appConfig.courses[0].description,
  techLabel: appConfig.courses[0].techLabel,
  exam: appConfig.courses[0].exam,
  storagePrefix: appConfig.storagePrefix,
  hue: appConfig.courses[0].hue,
};
