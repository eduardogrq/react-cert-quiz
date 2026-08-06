'use client';

import { useState, useMemo } from 'react';
import { Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlashcardDeck } from '@/components/flashcards/FlashcardDeck';
import { CourseSelector } from '@/components/layout/CourseSelector';
import { useSelectedCourse } from '@/lib/hooks/use-selected-course';
import { es } from '@/lib/i18n/es';
import type { Flashcard } from '@/content/types';

export function FlashcardsClient() {
  const { courseId, setCourseId, courseTopics } = useSelectedCourse();
  const [selectedTopicId, setSelectedTopicId] = useState<string | 'all'>('all');

  const { cards, topicTitle } = useMemo(() => {
    if (selectedTopicId === 'all') {
      const allCards: Flashcard[] = courseTopics.flatMap((t) => t.flashcards);
      return { cards: allCards, topicTitle: 'Todos los temas' };
    }
    const topic = courseTopics.find((t) => t.id === selectedTopicId);
    return {
      cards: topic?.flashcards ?? [],
      topicTitle: topic?.title ?? '',
    };
  }, [selectedTopicId, courseTopics]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Brain className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">{es.nav.flashcards}</h1>
      </div>

      <CourseSelector selectedCourseId={courseId} onSelect={setCourseId} />

      {/* Topic selector */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedTopicId === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedTopicId('all')}
        >
          Todos ({courseTopics.reduce((s, t) => s + t.flashcards.length, 0)})
        </Button>
        {courseTopics.map((topic) => (
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
      <FlashcardDeck key={`${courseId}-${selectedTopicId}`} cards={cards} topicTitle={topicTitle} />
    </div>
  );
}
