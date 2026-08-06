import { describe, it, expect } from 'vitest';
import {
  createNewSRSCard,
  reviewCard,
  isDue,
  getDueCards,
  type SRSRating,
} from '@/lib/srs';

describe('SRS (SM-2 simplificado)', () => {
  it('crea una tarjeta nueva con valores iniciales correctos', () => {
    const card = createNewSRSCard('test-1');
    expect(card.easeFactor).toBe(2.5);
    expect(card.interval).toBe(0);
    expect(card.repetitions).toBe(0);
    expect(card.nextReview).toBeLessThanOrEqual(Date.now());
  });

  it('una tarjeta nueva está due inmediatamente', () => {
    const card = createNewSRSCard('test-1');
    expect(isDue(card)).toBe(true);
  });

  it('rating "Otra vez" (0) resetea repetitions e interval', () => {
    const card = createNewSRSCard('test-1');
    const reviewed = reviewCard(card, 0);
    expect(reviewed.repetitions).toBe(0);
    expect(reviewed.interval).toBe(0);
    expect(reviewed.lastRating).toBe(0);
  });

  it('rating "Bien" (2) en primera revisión da intervalo de 1 día', () => {
    const card = createNewSRSCard('test-1');
    const reviewed = reviewCard(card, 2);
    expect(reviewed.interval).toBe(1);
    expect(reviewed.repetitions).toBe(1);
  });

  it('rating "Bien" (2) en segunda revisión da intervalo de 3 días', () => {
    let card = createNewSRSCard('test-1');
    card = reviewCard(card, 2);
    card = reviewCard(card, 2);
    expect(card.interval).toBe(3);
    expect(card.repetitions).toBe(2);
  });

  it('rating "Fácil" (3) aumenta el ease factor', () => {
    const card = createNewSRSCard('test-1');
    const reviewed = reviewCard(card, 3);
    expect(reviewed.easeFactor).toBe(2.65);
  });

  it('rating "Difícil" (1) reduce el ease factor (mínimo 1.3)', () => {
    const card = createNewSRSCard('test-1');
    const reviewed = reviewCard(card, 1);
    expect(reviewed.easeFactor).toBe(2.35);
  });

  it('ease factor nunca baja de 1.3', () => {
    let card = createNewSRSCard('test-1');
    card = { ...card, easeFactor: 1.35 };
    const reviewed = reviewCard(card, 1);
    expect(reviewed.easeFactor).toBe(1.3);
  });

  it('getDueCards filtra correctamente', () => {
    const due = createNewSRSCard('due-1');
    const notDue = {
      ...createNewSRSCard('not-due-1'),
      nextReview: Date.now() + 86400000,
    };
    const result = getDueCards([due, notDue]);
    expect(result).toHaveLength(1);
    expect(result[0].cardId).toBe('due-1');
  });

  it('múltiples revisiones "Bien" incrementan el intervalo exponencialmente', () => {
    let card = createNewSRSCard('test-1');
    const ratings: SRSRating[] = [2, 2, 2, 2];
    const intervals: number[] = [];

    for (const rating of ratings) {
      card = reviewCard(card, rating);
      intervals.push(card.interval);
    }

    // 1, 3, 8 (3*2.5=7.5→8), 20 (8*2.5=20)
    expect(intervals[0]).toBe(1);
    expect(intervals[1]).toBe(3);
    expect(intervals[2]).toBeGreaterThan(intervals[1]);
    expect(intervals[3]).toBeGreaterThan(intervals[2]);
  });
});
