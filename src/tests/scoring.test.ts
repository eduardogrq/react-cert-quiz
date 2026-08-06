import { describe, it, expect } from 'vitest';
import { calculateScore, isPassing, getWeakTopics } from '@/lib/scoring';
import type { QuizResult } from '@/lib/scoring';

describe('Scoring', () => {
  it('calcula score correctamente', () => {
    const result: QuizResult = {
      totalQuestions: 10,
      correctAnswers: 7,
      byTopic: {},
    };
    expect(calculateScore(result)).toBe(70);
  });

  it('devuelve 0 si no hay preguntas', () => {
    const result: QuizResult = {
      totalQuestions: 0,
      correctAnswers: 0,
      byTopic: {},
    };
    expect(calculateScore(result)).toBe(0);
  });

  it('isPassing con nota de corte default (70)', () => {
    expect(isPassing(70)).toBe(true);
    expect(isPassing(69)).toBe(false);
    expect(isPassing(100)).toBe(true);
  });

  it('isPassing con nota de corte custom', () => {
    expect(isPassing(80, 80)).toBe(true);
    expect(isPassing(79, 80)).toBe(false);
  });

  it('identifica temas débiles', () => {
    const result: QuizResult = {
      totalQuestions: 10,
      correctAnswers: 5,
      byTopic: {
        state: { total: 5, correct: 4 }, // 80% — ok
        hooks: { total: 3, correct: 1 }, // 33% — débil
        jsx: { total: 2, correct: 0 }, // 0% — débil
      },
    };
    const weak = getWeakTopics(result);
    expect(weak).toContain('hooks');
    expect(weak).toContain('jsx');
    expect(weak).not.toContain('state');
  });
});
