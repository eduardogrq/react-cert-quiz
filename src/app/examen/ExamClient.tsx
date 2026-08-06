'use client';

import { useState, useCallback, useMemo } from 'react';
import { Flag, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ExamTimer } from '@/components/quiz/ExamTimer';
import { QuizResults } from '@/components/quiz/QuizResults';
import { seededShuffle } from '@/lib/shuffle';
import { course } from '@/config/course';
import { es } from '@/lib/i18n/es';
import type { Topic, QuizQuestion } from '@/content/types';
import type { QuizResultData } from '@/components/quiz/QuizEngine';
interface ExamClientProps {
  topics: Topic[];
}

interface ExamQuestion extends QuizQuestion {
  _topicId: string;
  _topicTitle: string;
}

type ExamState = 'setup' | 'active' | 'results';


export function ExamClient({ topics }: ExamClientProps) {
  const [state, setState] = useState<ExamState>('setup');
  const [questionCount, setQuestionCount] = useState(course.exam.defaultQuestions);
  const [durationMinutes, setDurationMinutes] = useState(course.exam.defaultDurationMinutes);
  const [cutoff, setCutoff] = useState(course.exam.defaultCutoff);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<QuizResultData | null>(null);
  const [seed] = useState(() => Date.now());

  // Generate exam questions
  const examQuestions: ExamQuestion[] = useMemo(() => {
    const allQ: ExamQuestion[] = topics.flatMap((t) =>
      t.quiz.map((q) => ({ ...q, _topicId: t.id, _topicTitle: t.title }))
    );
    const shuffled = seededShuffle(allQ, seed);
    return shuffled.slice(0, Math.min(questionCount, shuffled.length));
  }, [topics, seed, questionCount]);

  const currentQuestion = examQuestions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / examQuestions.length) * 100);

  const handleStart = useCallback(() => {
    setState('active');
    setCurrentIndex(0);
    setAnswers({});
    setFlagged(new Set());
    setResults(null);
  }, []);

  const handleSelect = useCallback((optionId: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  }, [currentQuestion]);

  const handleToggleFlag = useCallback(() => {
    if (!currentQuestion) return;
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) {
        next.delete(currentQuestion.id);
      } else {
        next.add(currentQuestion.id);
      }
      return next;
    });
  }, [currentQuestion]);

  const handleFinish = useCallback(() => {
    const correctCount = examQuestions.filter(
      (q) => answers[q.id] === q.correctOptionId
    ).length;
    setResults({
      answers,
      correctCount,
      totalCount: examQuestions.length,
    });
    setState('results');
  }, [examQuestions, answers]);

  const handleTimeUp = useCallback(() => {
    handleFinish();
  }, [handleFinish]);

  const topicBreakdown = useMemo(() => {
    if (!results) return undefined;
    const byTopic: Record<string, { topicId: string; topicTitle: string; correct: number; total: number }> = {};
    for (const q of examQuestions) {
      if (!byTopic[q._topicId]) {
        byTopic[q._topicId] = { topicId: q._topicId, topicTitle: q._topicTitle, correct: 0, total: 0 };
      }
      byTopic[q._topicId].total++;
      if (results.answers[q.id] === q.correctOptionId) {
        byTopic[q._topicId].correct++;
      }
    }
    return Object.values(byTopic);
  }, [results, examQuestions]);

  // === RESULTS ===
  if (state === 'results' && results) {
    const score = Math.round((results.correctCount / results.totalCount) * 100);
    const passed = score >= cutoff;
    return (
      <div className="space-y-8">
        <div className="text-center">
          <Badge variant={passed ? 'default' : 'destructive'} className="text-lg px-5 py-1.5">
            {passed ? es.exam.passed : es.exam.failed}
          </Badge>
          <p className="text-base text-muted-foreground mt-3">
            {es.exam.cutoffScore}: {cutoff}% · {es.exam.yourScore}: {score}%
          </p>
        </div>
        <QuizResults
          results={results}
          topicBreakdown={topicBreakdown}
          onRestart={() => setState('setup')}
        />
      </div>
    );
  }

  // === ACTIVE ===
  if (state === 'active' && currentQuestion) {
    const isFlagged = flagged.has(currentQuestion.id);
    const selectedOption = answers[currentQuestion.id] ?? null;

    return (
      <div className="space-y-5 max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur py-3 border-b border-border -mx-4 px-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-medium">
              {currentIndex + 1} / {examQuestions.length}
            </span>
            <ExamTimer
              durationMinutes={durationMinutes}
              onTimeUp={handleTimeUp}
              running={true}
            />
          </div>
          <Progress value={progress} className="h-1" />
        </div>

        {/* Question */}
        <Card>
          <CardContent className="p-7">
            <p className="text-lg font-medium whitespace-pre-wrap leading-relaxed">
              {currentQuestion.question}
            </p>
          </CardContent>
        </Card>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`w-full text-left p-5 rounded-lg border-2 transition-all cursor-pointer ${
                  isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-sm font-mono text-muted-foreground mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-base">{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>

          <Button
            variant={isFlagged ? 'default' : 'ghost'}
            size="sm"
            onClick={handleToggleFlag}
            className="gap-1"
          >
            <Flag className="h-4 w-4" />
            {isFlagged ? 'Marcada' : es.exam.markForReview}
          </Button>

          {currentIndex + 1 < examQuestions.length ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentIndex((i) => Math.min(examQuestions.length - 1, i + 1))}
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleFinish}
            >
              {es.exam.finish}
            </Button>
          )}
        </div>

        {/* Question navigator */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-1.5">
              {examQuestions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isFlag = flagged.has(q.id);
                const isCurrent = idx === currentIndex;
                let cls = 'w-8 h-8 text-sm rounded border';
                if (isCurrent) cls += ' border-primary ring-2 ring-primary/30';
                else cls += ' border-border';
                if (isAnswered) cls += ' bg-primary/20';
                if (isFlag) cls += ' text-yellow-600 font-bold';
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={cls}
                    aria-label={`Pregunta ${idx + 1}${isFlag ? ' (marcada)' : ''}`}
                  >
                    {isFlag ? '⚑' : idx + 1}
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              {answeredCount} respondidas · {flagged.size} marcadas
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // === SETUP ===
  const maxQuestions = topics.reduce((s, t) => s + t.quiz.length, 0);

  return (
    <div className="space-y-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center">{es.nav.exam}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configuración del simulacro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-base font-medium" htmlFor="q-count">
              Preguntas ({maxQuestions} disponibles)
            </label>
            <input
              id="q-count"
              type="number"
              min={5}
              max={maxQuestions}
              value={questionCount}
              onChange={(e) => setQuestionCount(Math.min(maxQuestions, Math.max(5, parseInt(e.target.value) || 5)))}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-base"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-base font-medium" htmlFor="duration">
              Duración (minutos)
            </label>
            <input
              id="duration"
              type="number"
              min={5}
              max={180}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Math.min(180, Math.max(5, parseInt(e.target.value) || 5)))}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-base"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-base font-medium" htmlFor="cutoff">
              Nota de corte (%)
            </label>
            <input
              id="cutoff"
              type="number"
              min={1}
              max={100}
              value={cutoff}
              onChange={(e) => setCutoff(Math.min(100, Math.max(1, parseInt(e.target.value) || 70)))}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-base"
            />
          </div>

          <div className="p-4 rounded-md bg-muted text-base text-muted-foreground flex gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>No verás feedback hasta terminar. Puedes marcar preguntas para revisarlas antes de enviar.</span>
          </div>

          <Button onClick={handleStart} size="lg" className="w-full">
            {es.exam.start}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
