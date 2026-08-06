'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { es } from '@/lib/i18n/es';
import { useSRSState } from '@/lib/hooks/use-srs-state';
import type { Flashcard } from '@/content/types';
import type { SRSRating } from '@/lib/srs';

interface FlashcardDeckProps {
  cards: Flashcard[];
  topicTitle?: string;
}

const ratingButtons: { rating: SRSRating; label: string; variant: 'destructive' | 'secondary' | 'default' | 'outline'; key: string }[] = [
  { rating: 0, label: es.flashcards.again, variant: 'destructive', key: '1' },
  { rating: 1, label: es.flashcards.hard, variant: 'secondary', key: '2' },
  { rating: 2, label: es.flashcards.good, variant: 'default', key: '3' },
  { rating: 3, label: es.flashcards.easy, variant: 'outline', key: '4' },
];

export function FlashcardDeck({ cards, topicTitle }: FlashcardDeckProps) {
  const { review, dueCardIds } = useSRSState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  // Derive session cards from props + SRS state (no effect needed)
  const sessionCards = useMemo(() => {
    if (dueCardIds.length === 0) return cards;
    const due = cards.filter((c) => dueCardIds.includes(c.id));
    return due.length > 0 ? due : cards;
  }, [cards, dueCardIds]);


  const currentCard = sessionCards[currentIndex];
  const progress = sessionCards.length > 0
    ? Math.round((currentIndex / sessionCards.length) * 100)
    : 0;

  const handleFlip = useCallback(() => {
    setFlipped((prev) => !prev);
  }, []);

  const handleRate = useCallback(
    (rating: SRSRating) => {
      if (!currentCard) return;
      review(currentCard.id, rating);

      if (currentIndex + 1 >= sessionCards.length) {
        setSessionComplete(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
        setFlipped(false);
      }
    },
    [currentCard, currentIndex, sessionCards.length, review]
  );

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setFlipped(false);
    setSessionComplete(false);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (flipped) {
        const rating = { '1': 0, '2': 1, '3': 2, '4': 3 }[e.key] as SRSRating | undefined;
        if (rating !== undefined) {
          e.preventDefault();
          handleRate(rating);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flipped, handleFlip, handleRate]);

  if (sessionComplete) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-16">
        <p className="text-2xl font-semibold">{es.flashcards.completed}</p>
        <p className="text-lg text-muted-foreground">
          {sessionCards.length} tarjetas revisadas
        </p>
        <Button onClick={handleRestart} size="lg" className="gap-2">
          <RotateCcw className="h-5 w-5" />
          Repetir sesión
        </Button>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{es.flashcards.noCards}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        {topicTitle && (
          <Badge variant="outline" className="text-sm">{topicTitle}</Badge>
        )}
        <span className="text-base text-muted-foreground">
          {currentIndex + 1} / {sessionCards.length}
        </span>
      </div>

      <Progress value={progress} className="h-1.5" />

      {/* Card */}
      <div
        className="perspective-1000 cursor-pointer"
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        aria-label={flipped ? 'Respuesta mostrada. Presiona Space para voltear.' : 'Presiona Space para ver la respuesta.'}
        onKeyDown={(e) => {
          if (e.code === 'Enter') handleFlip();
        }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative h-64 sm:h-72"
        >
          {/* Front */}
          <Card className="absolute inset-0 backface-hidden flex items-center justify-center border-border/60 shadow-lg bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-10 text-center space-y-4">
              <p className="text-xl font-semibold leading-relaxed">{currentCard.front}</p>
              <p className="text-sm text-muted-foreground/70">
                Space para voltear
              </p>
            </CardContent>
          </Card>

          {/* Back */}
          <Card className="absolute inset-0 backface-hidden flex items-center justify-center [transform:rotateY(180deg)] border-primary/20 shadow-lg bg-gradient-to-br from-card to-primary/[0.04]">
            <CardContent className="p-10 text-center">
              <p className="text-base text-muted-foreground leading-[1.8]">
                {currentCard.back}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Rating buttons - only visible when flipped */}
      {flipped && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-2"
          aria-live="polite"
        >
          {ratingButtons.map(({ rating, label, variant, key }) => (
            <Button
              key={rating}
              variant={variant}
              size="sm"
              onClick={() => handleRate(rating)}
              className="min-w-[80px]"
            >
              <span className="text-xs opacity-60 mr-1">{key}</span>
              {label}
            </Button>
          ))}
        </motion.div>
      )}

      {/* Help text */}
      <p className="text-center text-sm text-muted-foreground">
        Space = voltear · 1-4 = calificar
      </p>
    </div>
  );
}
