import type { Topic } from './types';

export interface ValidationError {
  topicId: string;
  field: string;
  message: string;
}

export function validateTopics(topics: Topic[]): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const topic of topics) {
    // realWorldAnalogy es obligatoria (TypeScript lo garantiza) pero validamos contenido
    if (!topic.realWorldAnalogy.title.trim()) {
      errors.push({
        topicId: topic.id,
        field: 'realWorldAnalogy.title',
        message: 'La analogía debe tener un título',
      });
    }

    if (!topic.realWorldAnalogy.scenario.trim()) {
      errors.push({
        topicId: topic.id,
        field: 'realWorldAnalogy.scenario',
        message: 'La analogía debe tener un scenario',
      });
    }

    if (topic.realWorldAnalogy.mapping.length < 2) {
      errors.push({
        topicId: topic.id,
        field: 'realWorldAnalogy.mapping',
        message: `El mapping debe tener mínimo 2 pares, tiene ${topic.realWorldAnalogy.mapping.length}`,
      });
    }

    if (topic.realWorldAnalogy.mapping.length > 6) {
      errors.push({
        topicId: topic.id,
        field: 'realWorldAnalogy.mapping',
        message: `El mapping debe tener máximo 6 pares, tiene ${topic.realWorldAnalogy.mapping.length}`,
      });
    }

    // Validate that the analogy is referenced in the explanation
    const analogyTitle = topic.realWorldAnalogy.title.toLowerCase();
    const explanationLower = topic.explanation.toLowerCase();
    // Look for at least one reference to the analogy in the explanation
    const analogyWords = analogyTitle.split(' ').filter((w) => w.length > 3);
    const hasAnalogyInExplanation = analogyWords.some((word) =>
      explanationLower.includes(word.toLowerCase())
    );
    if (!hasAnalogyInExplanation) {
      errors.push({
        topicId: topic.id,
        field: 'explanation',
        message: 'La explicación debe retomar la analogía del tema',
      });
    }

    // At least 1 flashcard uses the analogy
    const hasAnalogyFlashcard = topic.flashcards.some((f) => f.usesAnalogy);
    if (!hasAnalogyFlashcard) {
      errors.push({
        topicId: topic.id,
        field: 'flashcards',
        message: 'Al menos 1 flashcard debe usar la analogía (usesAnalogy: true)',
      });
    }

    // At least 1 quiz question uses the analogy
    const hasAnalogyQuiz = topic.quiz.some((q) => q.usesAnalogy);
    if (!hasAnalogyQuiz) {
      errors.push({
        topicId: topic.id,
        field: 'quiz',
        message: 'Al menos 1 pregunta de quiz debe usar la analogía (usesAnalogy: true)',
      });
    }

    // Cada KeyTerm tiene analogyHint
    for (const term of topic.keyTerms) {
      if (!term.analogyHint.trim()) {
        errors.push({
          topicId: topic.id,
          field: `keyTerms.${term.term}.analogyHint`,
          message: `El término "${term.term}" necesita un analogyHint`,
        });
      }
      if (term.analogyHint.split(' ').length > 15) {
        errors.push({
          topicId: topic.id,
          field: `keyTerms.${term.term}.analogyHint`,
          message: `El analogyHint de "${term.term}" excede 15 palabras`,
        });
      }
    }

    // Cada QuizQuestion tiene explanation y whyOthersAreWrong para cada distractor
    for (const q of topic.quiz) {
      if (!q.explanation.trim()) {
        errors.push({
          topicId: topic.id,
          field: `quiz.${q.id}.explanation`,
          message: 'La pregunta necesita una explicación',
        });
      }
      const distractorIds = q.options
        .filter((o) => o.id !== q.correctOptionId)
        .map((o) => o.id);
      for (const dId of distractorIds) {
        if (!q.whyOthersAreWrong[dId]) {
          errors.push({
            topicId: topic.id,
            field: `quiz.${q.id}.whyOthersAreWrong.${dId}`,
            message: `Falta explicación de por qué "${dId}" es incorrecta`,
          });
        }
      }
    }
  }

  return errors;
}
