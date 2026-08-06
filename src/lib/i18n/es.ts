import { course } from '@/config/course';

export const es = {
  // General
  appName: course.name,
  appDescription: course.description,

  // Navigation
  nav: {
    home: 'Inicio',
    topics: 'Temas',
    flashcards: 'Flashcards',
    quiz: 'Quiz',
    exam: 'Simulacro',
    glossary: 'Glosario',
    analogies: 'Analogías',
    progress: 'Progreso',
  },

  // Study Mode
  study: {
    analogy: 'Analogía de la vida real',
    summary: 'Resumen',
    explanation: 'Explicación',
    keyTerms: 'Términos clave',
    codeExamples: 'Ejemplos de código',
    pitfalls: 'Trampas del examen',
    cheatSheet: 'Cheat Sheet',
    markAsReviewed: 'Marcar como repasado',
    reviewed: 'Repasado',
    estimatedTime: 'min estimados',
    prerequisites: 'Prerequisitos',
  },

  // Analogy Card
  analogy: {
    inRealLife: 'En la vida real',
    inTech: course.techLabel,
    whereItBreaks: 'Ojo: donde la analogía no aplica',
    remindMe: 'Recordarme la analogía',
  },

  // Flashcards
  flashcards: {
    again: 'Otra vez',
    hard: 'Difícil',
    good: 'Bien',
    easy: 'Fácil',
    flip: 'Voltear',
    remaining: 'restantes',
    completed: 'Sesión completada',
    noCards: 'No hay tarjetas pendientes para hoy',
  },

  // Quiz
  quiz: {
    checkAnswer: 'Verificar',
    nextQuestion: 'Siguiente',
    results: 'Resultados',
    correct: 'Correcta',
    incorrect: 'Incorrecta',
    explanation: 'Explicación',
    whyWrong: 'Por qué no',
    score: 'Puntaje',
    reviewWeakTopics: 'Temas para repasar',
    byTopic: 'Por tema',
    mixed: 'Mixto',
    startQuiz: 'Iniciar quiz',
  },

  // Exam
  exam: {
    start: 'Iniciar simulacro',
    timeRemaining: 'Tiempo restante',
    markForReview: 'Marcar para revisar',
    finish: 'Terminar examen',
    confirmFinish: '¿Seguro que quieres terminar? No podrás volver.',
    passed: 'Aprobado',
    failed: 'No aprobado',
    cutoffScore: 'Nota de corte',
    yourScore: 'Tu puntaje',
    weaknesses: 'Áreas débiles',
  },

  // Dashboard
  dashboard: {
    welcome: 'Preparación para el examen',
    globalProgress: 'Progreso global',
    streak: 'Racha',
    days: 'días',
    nextAction: 'Siguiente acción recomendada',
    estimatedRemaining: 'Tiempo estimado restante',
    notStarted: 'No iniciado',
    inProgress: 'En progreso',
    mastered: 'Dominado',
  },

  // Progress
  progress: {
    export: 'Exportar progreso',
    import: 'Importar progreso',
    reset: 'Reiniciar todo',
    confirmReset: '¿Seguro? Esto borra todo tu progreso.',
    exported: 'Progreso exportado',
    imported: 'Progreso importado correctamente',
    invalidFile: 'Archivo inválido',
  },

  // Difficulty
  difficulty: {
    basico: 'Básico',
    intermedio: 'Intermedio',
    avanzado: 'Avanzado',
  },
} as const;

export type I18nKey = typeof es;
