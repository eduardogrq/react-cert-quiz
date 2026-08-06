import { describe, it, expect } from 'vitest';
import { validateTopics } from '@/content/validate';
import { topics } from '@/content/index';
import type { Topic } from '@/content/types';

describe('validateTopics', () => {
  it('todos los temas del registry pasan validación', () => {
    const errors = validateTopics(topics);
    if (errors.length > 0) {
      const messages = errors.map(
        (e) => `[${e.topicId}] ${e.field}: ${e.message}`
      );
      throw new Error(
        `Errores de validación:\n${messages.join('\n')}`
      );
    }
    expect(errors).toHaveLength(0);
  });

  it('falla si mapping tiene menos de 2 pares', () => {
    const badTopic: Topic = {
      id: 'bad',
      title: 'Bad Topic',
      realWorldAnalogy: {
        title: 'Test',
        scenario: 'Test scenario',
        mapping: [{ everyday: 'a', technical: 'b' }],
      },
      keyTerms: [],
      summary: 'Test',
      explanation: 'Test explanation',
      pitfalls: [],
      flashcards: [{ id: 'f1', front: 'q', back: 'a', usesAnalogy: true }],
      quiz: [
        {
          id: 'q1',
          question: 'q',
          options: [
            { id: 'a', text: 'a' },
            { id: 'b', text: 'b' },
          ],
          correctOptionId: 'a',
          explanation: 'because',
          whyOthersAreWrong: { b: 'nope' },
          usesAnalogy: true,
        },
      ],
      difficulty: 'basico',
      estimatedMinutes: 5,
      tags: [],
    };
    const errors = validateTopics([badTopic]);
    expect(errors.some((e) => e.field === 'realWorldAnalogy.mapping')).toBe(
      true
    );
  });

  it('falla si no hay flashcard con usesAnalogy', () => {
    const badTopic: Topic = {
      id: 'bad2',
      title: 'Bad Topic 2',
      realWorldAnalogy: {
        title: 'La prueba',
        scenario: 'Scenario prueba sin jerga',
        mapping: [
          { everyday: 'a', technical: 'b' },
          { everyday: 'c', technical: 'd' },
        ],
      },
      keyTerms: [],
      summary: 'Test',
      explanation: 'Retoma la prueba aquí',
      pitfalls: [],
      flashcards: [{ id: 'f1', front: 'q', back: 'a' }], // no usesAnalogy
      quiz: [
        {
          id: 'q1',
          question: 'q',
          options: [
            { id: 'a', text: 'a' },
            { id: 'b', text: 'b' },
          ],
          correctOptionId: 'a',
          explanation: 'because',
          whyOthersAreWrong: { b: 'nope' },
          usesAnalogy: true,
        },
      ],
      difficulty: 'basico',
      estimatedMinutes: 5,
      tags: [],
    };
    const errors = validateTopics([badTopic]);
    expect(errors.some((e) => e.field === 'flashcards')).toBe(true);
  });
});
