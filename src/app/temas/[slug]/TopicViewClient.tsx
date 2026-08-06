'use client';

import { useCallback } from 'react';
import { z } from 'zod/v4';
import { TopicView } from '@/components/study/TopicView';
import { usePersistentState } from '@/lib/hooks/use-persistent-state';
import type { Topic } from '@/content/types';

const reviewedSchema = z.record(z.string(), z.boolean());

interface TopicViewClientProps {
  topic: Topic;
  nextTopic?: Topic;
}

export function TopicViewClient({ topic, nextTopic }: TopicViewClientProps) {
  const [reviewed, setReviewed] = usePersistentState(
    'reviewed_topics',
    {} as Record<string, boolean>,
    reviewedSchema
  );

  const handleMarkReviewed = useCallback(() => {
    setReviewed((prev) => ({
      ...prev,
      [topic.id]: !prev[topic.id],
    }));
  }, [topic.id, setReviewed]);

  return (
    <TopicView
      topic={topic}
      nextTopic={nextTopic}
      isReviewed={reviewed[topic.id] ?? false}
      onMarkReviewed={handleMarkReviewed}
    />
  );
}
