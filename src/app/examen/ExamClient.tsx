'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, ChevronLeft, ChevronRight, AlertTriangle, Clock, HelpCircle, Target, ListChecks } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { ExamTimer } from '@/components/quiz/ExamTimer';
import { QuizResults } from '@/components/quiz/QuizResults';
import { PageTransition } from '@/components/layout/PageTransition';
import { seededShuffle } from '@/lib/shuffle';
import { springSnappy } from '@/lib/motion';
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

const MIN_QUESTIONS = 5;
const MIN_DURATION = 5;
const MAX_DURATION = 180;
const MIN_CUTOFF = 1;
const MAX_CUTOFF = 100;

export function ExamClient({ topics }: ExamClientProps) {
  const [state, setState] = useState<ExamState>('setup');
  const [questionCount, setQuestionCount] = useState(String(course.exam.defaultQuestions));
  const [durationMinutes, setDurationMinutes] = useState(String(course.exam.defaultDurationMinutes));
  const [cutoff, setCutoff] = useState(String(course.exam.defaultCutoff));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<QuizResultData | null>(null);
  const [seed] = useState(() => Date.now());

  const maxQuestions = topics.reduce((s, t) => s + t.quiz.length, 0);

  // Parse and clamp values on submit, not on every keystroke
  const parsedQuestionCount = useMemo(() => {
    const n = parseInt(questionCount) || course.exam.defaultQuestions;
    return Math.min(maxQuestions, Math.max(MIN_QUESTIONS, n));
  }, [questionCount, maxQuestions]);

  const parsedDuration = useMemo(() => {
    const n = parseInt(durationMinutes) || course.exam.defaultDurationMinutes;
    return Math.min(MAX_DURATION, Math.max(MIN_DURATION, n));
  }, [durationMinutes]);

  const parsedCutoff = useMemo(() => {
    const n = parseInt(cutoff) || course.exam.defaultCutoff;
    return Math.min(MAX_CUTOFF, Math.max(MIN_CUTOFF, n));
  }, [cutoff]);

  // Generate exam questions
  const examQuestions: ExamQuestion[] = useMemo(() => {
    const allQ: ExamQuestion[] = topics.flatMap((t) =>
      t.quiz.map((q) => ({ ...q, _topicId: t.id, _topicTitle: t.title }))
    );
    const shuffled = seededShuffle(allQ, seed);
    return shuffled.slice(0, Math.min(parsedQuestionCount, shuffled.length));
  }, [topics, seed, parsedQuestionCount]);

  const currentQuestion = examQuestions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = examQuestions.length > 0 ? Math.round((answeredCount / examQuestions.length) * 100) : 0;

  const handleStart = useCallback(() => {
    if (parsedQuestionCount < MIN_QUESTIONS) {
      toast.error(`Mínimo ${MIN_QUESTIONS} preguntas`);
      return;
    }
    setState('active');
    setCurrentIndex(0);
    setAnswers({});
    setFlagged(new Set());
    setResults(null);
    toast(`Simulacro iniciado — ${parsedQuestionCount} preguntas, ${parsedDuration} min`);
  }, [parsedQuestionCount, parsedDuration]);

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
        toast('Marca removida');
      } else {
        next.add(currentQuestion.id);
        toast('Pregunta marcada para revisión');
      }
      return next;
    });
  }, [currentQuestion]);

  const handleFinish = useCallback(() => {
    const unanswered = examQuestions.length - Object.keys(answers).length;
    if (unanswered > 0) {
      toast.warning(`Tienes ${unanswered} pregunta${unanswered > 1 ? 's' : ''} sin responder`);
    }
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
    toast.error('¡Tiempo agotado!');
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
    const passed = score >= parsedCutoff;
    return (
      <PageTransition className="space-y-8">
        <div className="text-center">
          <Badge variant={passed ? 'default' : 'destructive'} className="text-lg px-5 py-1.5">
            {passed ? es.exam.passed : es.exam.failed}
          </Badge>
          <p className="text-base text-muted-foreground mt-3">
            {es.exam.cutoffScore}: {parsedCutoff}% · {es.exam.yourScore}: {score}%
          </p>
        </div>
        <QuizResults
          results={results}
          topicBreakdown={topicBreakdown}
          onRestart={() => setState('setup')}
        />
      </PageTransition>
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
              durationMinutes={parsedDuration}
              onTimeUp={handleTimeUp}
              running={true}
            />
          </div>
          <Progress value={progress} className="h-1" />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="p-7">
                <p className="text-lg font-medium whitespace-pre-wrap leading-relaxed">
                  {currentQuestion.question}
                </p>
              </CardContent>
            </Card>

            {/* Options */}
            <div className="space-y-2.5 mt-5">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === option.id;
                return (
                  <motion.button
                    key={option.id}
                    whileTap={{ scale: 0.98 }}
                    transition={springSnappy}
                    onClick={() => handleSelect(option.id)}
                    className={`w-full text-left p-5 rounded-lg border-2 transition-all cursor-pointer ${
                      isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`text-sm font-mono mt-0.5 w-5 h-5 flex items-center justify-center rounded-full ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-base">{option.text}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

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

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant={isFlagged ? 'default' : 'ghost'}
                  size="sm"
                  onClick={handleToggleFlag}
                  className="gap-1"
                >
                  <Flag className="h-4 w-4" />
                  <span className="hidden sm:inline">{isFlagged ? 'Marcada' : es.exam.markForReview}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Marca para revisarla antes de enviar
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
                let cls = 'w-8 h-8 text-sm rounded border transition-all cursor-pointer';
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
  return (
    <PageTransition className="space-y-8 max-w-md mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{es.nav.exam}</h1>
        <p className="text-muted-foreground text-base">
          Simula las condiciones reales del examen de certificación
        </p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-lg">Configuración del simulacro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question count */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-medium" htmlFor="q-count">
                Preguntas
              </label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Mínimo {MIN_QUESTIONS}, máximo {maxQuestions} disponibles
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="q-count"
              type="number"
              min={MIN_QUESTIONS}
              max={maxQuestions}
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              onBlur={() => setQuestionCount(String(parsedQuestionCount))}
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">
              {maxQuestions} preguntas disponibles en total
            </p>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-medium" htmlFor="duration">
                Duración (minutos)
              </label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Entre {MIN_DURATION} y {MAX_DURATION} minutos
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="duration"
              type="number"
              min={MIN_DURATION}
              max={MAX_DURATION}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              onBlur={() => setDurationMinutes(String(parsedDuration))}
              className="h-10"
            />
          </div>

          {/* Cutoff */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-medium" htmlFor="cutoff">
                Nota de corte (%)
              </label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Porcentaje mínimo para aprobar (examen real: 70%)
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="cutoff"
              type="number"
              min={MIN_CUTOFF}
              max={MAX_CUTOFF}
              value={cutoff}
              onChange={(e) => setCutoff(e.target.value)}
              onBlur={() => setCutoff(String(parsedCutoff))}
              className="h-10"
            />
          </div>

          {/* Info banner */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground flex gap-3">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-yellow-500" />
            <span>No verás feedback hasta terminar. Puedes marcar preguntas para revisarlas antes de enviar.</span>
          </div>

          <Button onClick={handleStart} size="lg" className="w-full">
            {es.exam.start}
          </Button>
        </CardContent>
      </Card>
    </PageTransition>
  );
}
