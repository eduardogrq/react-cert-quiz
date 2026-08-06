'use client';

import { useState, useMemo } from 'react';
import { Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlashcardDeck } from '@/components/flashcards/FlashcardDeck';
import { es } from '@/lib/i18n/es';
import type { Topic, Flashcard } from '@/content/types';

interface FlashcardsClientProps {
  topics: Topic[];
}

export function FlashcardsClient({ topics }: FlashcardsClientProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<string | 'all'>('all');

  const { cards, topicTitle } = useMemo(() => {
    if (selectedTopicId === 'all') {
      const allCards: Flashcard[] = topics.flatMap((t) => t.flashcards);
      return { cards: allCards, topicTitle: 'Todos los temas' };
    }
    const topic = topics.find((t) => t.id === selectedTopicId);
    return {
      cards: topic?.flashcards ?? [],
      topicTitle: topic?.title ?? '',
    };
  }, [selectedTopicId, topics]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Brain className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">{es.nav.flashcards}</h1>
      </div>

      {/* Topic selector */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedTopicId === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedTopicId('all')}
        >
          Todos ({topics.reduce((s, t) => s + t.flashcards.length, 0)})
        </Button>
        {topics.map((topic) => (
          <Button
            key={topic.id}
            variant={selectedTopicId === topic.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTopicId(topic.id)}
          >
            {topic.title.split(':')[0]} ({topic.flashcards.length})
          </Button>
        ))}
      </div>

      {/* Deck */}
      <FlashcardDeck key={selectedTopicId} cards={cards} topicTitle={topicTitle} />
    </div>
  );
}
