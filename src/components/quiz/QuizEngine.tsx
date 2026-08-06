'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { es } from '@/lib/i18n/es';
import type { QuizQuestion, RealWorldAnalogy } from '@/content/types';

interface QuizEngineProps {
  questions: QuizQuestion[];
  topicAnalogy?: RealWorldAnalogy;
  topicTitle?: string;
  onComplete: (results: QuizResultData) => void;
}

export interface QuizResultData {
  answers: Record<string, string>; // questionId -> selectedOptionId
  correctCount: number;
  totalCount: number;
}

export function QuizEngine({ questions, topicAnalogy, topicTitle, onComplete }: QuizEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedOption === currentQuestion?.correctOptionId;
  const progress = Math.round(((currentIndex) / questions.length) * 100);

  const handleSelect = useCallback((optionId: string) => {
    if (answered) return;
    setSelectedOption(optionId);
  }, [answered]);

  const handleCheck = useCallback(() => {
    if (!selectedOption || !currentQuestion) return;
    setAnswered(true);
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedOption }));
  }, [selectedOption, currentQuestion]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      // Complete
      const finalAnswers = { ...answers, [currentQuestion.id]: selectedOption! };
      const correctCount = questions.filter(
        (q) => finalAnswers[q.id] === q.correctOptionId
      ).length;
      onComplete({
        answers: finalAnswers,
        correctCount,
        totalCount: questions.length,
      });
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
    }
  }, [currentIndex, questions, answers, currentQuestion, selectedOption, onComplete]);

  // Keyboard: Enter to check/next
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!answered && selectedOption) {
          handleCheck();
        } else if (answered) {
          handleNext();
        }
      }
      // Number keys to select option
      const num = parseInt(e.key);
      if (!answered && num >= 1 && num <= currentQuestion?.options.length) {
        handleSelect(currentQuestion.options[num - 1].id);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [answered, selectedOption, handleCheck, handleNext, handleSelect, currentQuestion]);

  if (!currentQuestion) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between text-base text-muted-foreground">
        <span>
          Pregunta {currentIndex + 1} de {questions.length}
        </span>
        {topicTitle && <Badge variant="outline" className="text-sm">{topicTitle}</Badge>}
      </div>
      <Progress value={progress} className="h-2" />

      {/* Question */}
      <Card>
        <CardContent className="p-7">
          <p className="text-lg font-medium whitespace-pre-wrap leading-relaxed">
            {currentQuestion.question}
          </p>
        </CardContent>
      </Card>

      {/* Options */}
      <div className="space-y-2">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOption === option.id;
          const isThisCorrect = option.id === currentQuestion.correctOptionId;
          let borderClass = 'border-border hover:border-primary/50';
          if (answered) {
            if (isThisCorrect) borderClass = 'border-green-500 bg-green-500/5';
            else if (isSelected && !isThisCorrect) borderClass = 'border-destructive bg-destructive/5';
            else borderClass = 'border-border opacity-60';
          } else if (isSelected) {
            borderClass = 'border-primary bg-primary/5';
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={answered}
              className={`w-full text-left p-5 rounded-lg border-2 transition-all ${borderClass} ${!answered ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-sm font-mono text-muted-foreground mt-0.5 shrink-0">
                  {idx + 1}
                </span>
                <span className="text-base">{option.text}</span>
                {answered && isThisCorrect && (
                  <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto shrink-0 mt-0.5" />
                )}
                {answered && isSelected && !isThisCorrect && (
                  <XCircle className="h-4 w-4 text-destructive ml-auto shrink-0 mt-0.5" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
            aria-live="polite"
          >
            {/* Correct/Incorrect banner */}
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${
                isCorrect
                  ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span className="font-medium">
                {isCorrect ? es.quiz.correct : es.quiz.incorrect}
              </span>
            </div>

            {/* Analogy reminder on incorrect */}
            {!isCorrect && topicAnalogy && (
              <div className="flex gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
                <p className="text-base text-muted-foreground">
                  <span className="font-medium">Recuerda &ldquo;{topicAnalogy.title}&rdquo;:</span>{' '}
                  {topicAnalogy.scenario.slice(0, 120)}...
                </p>
              </div>
            )}

            {/* Explanation */}
            <Card className="bg-muted/50">
              <CardContent className="p-5 space-y-3">
                <p className="text-base">
                  <span className="font-medium">{es.quiz.explanation}:</span>{' '}
                  {currentQuestion.explanation}
                </p>

                {/* Why selected is wrong */}
                {!isCorrect && selectedOption && currentQuestion.whyOthersAreWrong[selectedOption] && (
                  <p className="text-base text-muted-foreground">
                    <span className="font-medium">{es.quiz.whyWrong}:</span>{' '}
                    {currentQuestion.whyOthersAreWrong[selectedOption]}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action button */}
      <div className="flex justify-end">
        {!answered ? (
          <Button onClick={handleCheck} disabled={!selectedOption}>
            {es.quiz.checkAnswer}
          </Button>
        ) : (
          <Button onClick={handleNext} className="gap-1">
            {currentIndex + 1 >= questions.length ? es.quiz.results : es.quiz.nextQuestion}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-sm text-muted-foreground">
        1-{currentQuestion.options.length} = seleccionar · Enter = verificar/siguiente
      </p>
    </div>
  );
}
