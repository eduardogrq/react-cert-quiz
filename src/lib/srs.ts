/**
 * SM-2 simplificado (tipo Anki)
 *
 * Cada tarjeta tiene: easeFactor, interval (días), repetitions, nextReview (timestamp).
 * Rating: 0 = Otra vez, 1 = Difícil, 2 = Bien, 3 = Fácil
 */

export interface SRSCard {
  cardId: string;
  easeFactor: number; // minimum 1.3
  interval: number; // days
  repetitions: number;
  nextReview: number; // timestamp ms
  lastRating?: number;
}

export type SRSRating = 0 | 1 | 2 | 3;

const MIN_EASE_FACTOR = 1.3;

export function createNewSRSCard(cardId: string): SRSCard {
  return {
    cardId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: Date.now(),
  };
}

export function reviewCard(card: SRSCard, rating: SRSRating): SRSCard {
  const now = Date.now();

  // "Again" — reset
  if (rating === 0) {
    return {
      ...card,
      repetitions: 0,
      interval: 0,
      nextReview: now, // show again immediately
      lastRating: rating,
    };
  }

  let newInterval: number;
  const newRepetitions = card.repetitions + 1;

  if (card.repetitions === 0) {
    // First correct review
    newInterval = 1;
  } else if (card.repetitions === 1) {
    newInterval = 3;
  } else {
    // Multiply by ease factor
    newInterval = Math.round(card.interval * card.easeFactor);
  }

  // Adjust ease factor based on rating
  let newEaseFactor = card.easeFactor;
  if (rating === 1) {
    // Hard: reduce ease, shorter interval
    newEaseFactor = Math.max(MIN_EASE_FACTOR, card.easeFactor - 0.15);
    newInterval = Math.max(1, Math.round(newInterval * 0.7));
  } else if (rating === 3) {
    // Easy: increase ease, longer interval
    newEaseFactor = card.easeFactor + 0.15;
    newInterval = Math.round(newInterval * 1.3);
  }

  const nextReview = now + newInterval * 24 * 60 * 60 * 1000;

  return {
    ...card,
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReview,
    lastRating: rating,
  };
}

export function isDue(card: SRSCard): boolean {
  return Date.now() >= card.nextReview;
}

export function getDueCards(cards: SRSCard[]): SRSCard[] {
  return cards.filter(isDue);
}
