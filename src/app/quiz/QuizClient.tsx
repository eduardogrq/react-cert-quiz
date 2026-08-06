'use client';

import { useState, useMemo, useCallback } from 'react';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QuizEngine, type QuizResultData } from '@/components/quiz/QuizEngine';
import { QuizResults } from '@/components/quiz/QuizResults';
import { shuffle } from '@/lib/shuffle';
import { es } from '@/lib/i18n/es';
import type { Topic, QuizQuestion } from '@/content/types';

interface QuizClientProps {
  topics: Topic[];
}

type QuizState = 'setup' | 'active' | 'results';

interface TaggedQuestion extends QuizQuestion {
  _topicId: string;
  _topicTitle: string;
}

export function QuizClient({ topics }: QuizClientProps) {
  const [state, setState] = useState<QuizState>('setup');
  const [selectedTopicId, setSelectedTopicId] = useState<string | 'all'>('all');
  const [results, setResults] = useState<QuizResultData | null>(null);
  const [sessionKey, setSessionKey] = useState(0);

  const { questions, analogy, topicTitle } = useMemo(() => {
    if (selectedTopicId === 'all') {
      const allQ: TaggedQuestion[] = topics.flatMap((t) =>
        t.quiz.map((q) => ({ ...q, _topicId: t.id, _topicTitle: t.title }))
      );
      return { questions: shuffle(allQ), analogy: undefined, topicTitle: 'Mixto' };
    }
    const topic = topics.find((t) => t.id === selectedTopicId);
    if (!topic) return { questions: [], analogy: undefined, topicTitle: '' };
    const tagged: TaggedQuestion[] = topic.quiz.map((q) => ({
      ...q,
      _topicId: topic.id,
      _topicTitle: topic.title,
    }));
    return {
      questions: shuffle(tagged),
      analogy: topic.realWorldAnalogy,
      topicTitle: topic.title,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopicId, topics, sessionKey]);

  const topicBreakdown = useMemo(() => {
    if (!results) return undefined;
    const byTopic: Record<string, { topicId: string; topicTitle: string; correct: number; total: number }> = {};
    for (const q of questions as TaggedQuestion[]) {
      if (!byTopic[q._topicId]) {
        byTopic[q._topicId] = { topicId: q._topicId, topicTitle: q._topicTitle, correct: 0, total: 0 };
      }
      byTopic[q._topicId].total++;
      if (results.answers[q.id] === q.correctOptionId) {
        byTopic[q._topicId].correct++;
      }
    }
    return Object.values(byTopic);
  }, [results, questions]);

  const handleStart = useCallback(() => {
    setState('active');
  }, []);

  const handleComplete = useCallback((data: QuizResultData) => {
    setResults(data);
    setState('results');
  }, []);

  const handleRestart = useCallback(() => {
    setResults(null);
    setSessionKey((k) => k + 1);
    setState('setup');
  }, []);

  if (state === 'results' && results) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-center">{es.quiz.results}</h1>
        <QuizResults
          results={results}
          topicBreakdown={topicBreakdown}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  if (state === 'active') {
    return (
      <QuizEngine
        questions={questions}
        topicAnalogy={analogy}
        topicTitle={topicTitle}
        onComplete={handleComplete}
      />
    );
  }

  // Setup
  return (
    <div className="space-y-8 max-w-xl mx-auto">
      <div className="flex items-center gap-3">
        <Trophy className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">{es.nav.quiz}</h1>
      </div>

      {/* Topic selector */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <p className="text-base text-muted-foreground">Selecciona qué temas quieres practicar:</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTopicId === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTopicId('all')}
            >
              {es.quiz.mixed} ({topics.reduce((s, t) => s + t.quiz.length, 0)})
            </Button>
            {topics.map((topic) => (
              <Button
                key={topic.id}
                variant={selectedTopicId === topic.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTopicId(topic.id)}
              >
                {topic.title.split(':')[0]} ({topic.quiz.length})
              </Button>
            ))}
          </div>

          <div className="pt-2">
            <Button onClick={handleStart} disabled={questions.length === 0} className="w-full">
              {es.quiz.startQuiz} ({questions.length} preguntas)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
