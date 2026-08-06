export type Difficulty = 'basico' | 'intermedio' | 'avanzado';

export interface RealWorldAnalogy {
  /** Título corto de la analogía, ej: "La pizarra mágica del restaurante" */
  title: string;
  /** Situación cotidiana en 2-4 líneas, sin jerga técnica */
  scenario: string;
  /** Puente explícito entre lo cotidiano y lo técnico (min 2, max 6) */
  mapping: {
    everyday: string;
    technical: string;
  }[];
  /** Hasta dónde la analogía es válida (prevenir misconceptions) */
  whereItBreaks?: string;
}

export interface KeyTerm {
  /** Término en inglés */
  term: string;
  /** Definición breve en español */
  definition: string;
  /** Frase ≤15 palabras que aterriza el concepto a algo cotidiano */
  analogyHint: string;
}

export interface CodeExample {
  title: string;
  code: string;
  language: 'tsx' | 'ts' | 'jsx' | 'js';
  /** Explicación breve de qué demuestra */
  description?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  /** Si usa la analogía del tema para reforzar */
  usesAnalogy?: boolean;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  /** Por qué la respuesta correcta es correcta */
  explanation: string;
  /** Por qué cada distractor es incorrecto */
  whyOthersAreWrong: Record<string, string>;
  /** Si la pregunta retoma la analogía del tema */
  usesAnalogy?: boolean;
}

export interface Topic {
  id: string;
  title: string;
  realWorldAnalogy: RealWorldAnalogy;
  keyTerms: KeyTerm[];
  /** Resumen ejecutivo (3-6 líneas) */
  summary: string;
  /** Desarrollo del tema, retomando la analogía */
  explanation: string;
  codeExamples?: CodeExample[];
  /** Errores comunes / "trampas del examen" */
  pitfalls: string[];
  mnemonics?: string[];
  /** Bullets ultra-condensados para repaso final */
  cheatSheet?: string[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  difficulty: Difficulty;
  /** Minutos estimados de estudio */
  estimatedMinutes: number;
  /** IDs de temas prerequisito */
  prerequisites?: string[];
  tags: string[];
}
