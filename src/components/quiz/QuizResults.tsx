'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, RotateCcw, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { es } from '@/lib/i18n/es';
import { springSnappy, springGentle, staggerContainer, fadeUp } from '@/lib/motion';
import type { QuizResultData } from './QuizEngine';

interface QuizResultsProps {
  results: QuizResultData;
  topicBreakdown?: { topicId: string; topicTitle: string; correct: number; total: number }[];
  onRestart: () => void;
}

export function QuizResults({ results, topicBreakdown, onRestart }: QuizResultsProps) {
  const score = Math.round((results.correctCount / results.totalCount) * 100);
  const passed = score >= 70;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-xl mx-auto"
    >
      {/* Score card */}
      <motion.div variants={fadeUp}>
        <Card className={passed ? 'border-green-500/50' : 'border-destructive/50'}>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">{es.quiz.results}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-5">
            <div className="flex items-center justify-center gap-3">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ ...springSnappy, delay: 0.2 }}
              >
                {passed ? (
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                ) : (
                  <XCircle className="h-10 w-10 text-destructive" />
                )}
              </motion.div>
              <motion.span
                className="text-5xl font-bold"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...springGentle, delay: 0.3 }}
              >
                {score}%
              </motion.span>
            </div>
            <p className="text-lg text-muted-foreground">
              {results.correctCount} de {results.totalCount} correctas
            </p>
            <Progress
              value={score}
              className="h-2.5"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Topic breakdown */}
      {topicBreakdown && topicBreakdown.length > 1 && (
        <motion.div variants={fadeUp}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{es.quiz.reviewWeakTopics}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topicBreakdown.map(({ topicId, topicTitle, correct, total }) => {
                const topicScore = total > 0 ? Math.round((correct / total) * 100) : 0;
                const isWeak = topicScore < 70;
                return (
                  <div key={topicId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-base">
                      <span className={isWeak ? 'text-destructive font-medium' : ''}>
                        {topicTitle}
                      </span>
                      <span className="text-muted-foreground">
                        {correct}/{total}
                      </span>
                    </div>
                    <Progress value={topicScore} className="h-1.5" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div variants={fadeUp} className="flex justify-center gap-3">
        <Button onClick={onRestart} variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Repetir
        </Button>
        <Link href="/temas">
          <Button className="gap-2">
            <BookOpen className="h-4 w-4" />
            Repasar temas
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
