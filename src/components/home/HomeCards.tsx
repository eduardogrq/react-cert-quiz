'use client';

import { motion } from 'framer-motion';
import { BookOpen, Brain, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { staggerContainer, scaleIn, hoverLift } from '@/lib/motion';

interface HomeCardsProps {
  totalTopics: number;
  totalFlashcards: number;
  totalQuiz: number;
}

export function HomeCards({ totalTopics, totalFlashcards, totalQuiz }: HomeCardsProps) {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid grid-cols-3 gap-3 sm:gap-5"
    >
      {/* Topics */}
      <motion.div variants={scaleIn} {...hoverLift}>
        <Card className="group hover:glow-sm transition-shadow duration-300 border-border/60 h-full">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <span className="text-2xl sm:text-4xl font-bold">{totalTopics}</span>
            </div>
            <p className="text-xs sm:text-base text-muted-foreground mt-2 sm:mt-3 text-center sm:text-left">
              Temas con analogías
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Flashcards */}
      <motion.div variants={scaleIn} {...hoverLift}>
        <Card className="group hover:glow-sm transition-shadow duration-300 border-border/60 h-full">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-chart-2/10 flex items-center justify-center group-hover:bg-chart-2/15 transition-colors">
                <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-chart-2" />
              </div>
              <span className="text-2xl sm:text-4xl font-bold">{totalFlashcards}</span>
            </div>
            <p className="text-xs sm:text-base text-muted-foreground mt-2 sm:mt-3 text-center sm:text-left">
              Flashcards con SRS
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quiz */}
      <motion.div variants={scaleIn} {...hoverLift}>
        <Card className="group hover:glow-sm transition-shadow duration-300 border-border/60 h-full">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-chart-3/10 flex items-center justify-center group-hover:bg-chart-3/15 transition-colors">
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-chart-3" />
              </div>
              <span className="text-2xl sm:text-4xl font-bold">{totalQuiz}</span>
            </div>
            <p className="text-xs sm:text-base text-muted-foreground mt-2 sm:mt-3 text-center sm:text-left">
              Preguntas de quiz
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.section>
  );
}
