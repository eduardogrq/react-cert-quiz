'use client';

import { useCallback, useMemo } from 'react';
import { z } from 'zod/v4';
import { usePersistentState } from './use-persistent-state';
import {
  createNewSRSCard,
  reviewCard,
  getDueCards,
  type SRSCard,
  type SRSRating,
} from '@/lib/srs';

const srsCardSchema = z.object({
  cardId: z.string(),
  easeFactor: z.number(),
  interval: z.number(),
  repetitions: z.number(),
  nextReview: z.number(),
  lastRating: z.number().optional(),
});

const srsStateSchema = z.record(z.string(), srsCardSchema);

type SRSState = Record<string, SRSCard>;

export function useSRSState() {
  const [cards, setCards] = usePersistentState<SRSState>(
    'srs_cards',
    {},
    srsStateSchema
  );

  const getOrCreateCard = useCallback(
    (cardId: string): SRSCard => {
      return cards[cardId] ?? createNewSRSCard(cardId);
    },
    [cards]
  );

  const review = useCallback(
    (cardId: string, rating: SRSRating) => {
      setCards((prev) => {
        const card = prev[cardId] ?? createNewSRSCard(cardId);
        const updated = reviewCard(card, rating);
        return { ...prev, [cardId]: updated };
      });
    },
    [setCards]
  );

  const dueCardIds = useMemo(() => {
    const allCards = Object.values(cards);
    return getDueCards(allCards).map((c) => c.cardId);
  }, [cards]);

  const getCardState = useCallback(
    (cardId: string): SRSCard | undefined => cards[cardId],
    [cards]
  );

  return { review, dueCardIds, getOrCreateCard, getCardState };
}
