'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { z } from 'zod/v4';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { es } from '@/lib/i18n/es';
import { staggerContainer, fadeUp, hoverLift } from '@/lib/motion';
import { usePersistentState } from '@/lib/hooks/use-persistent-state';
import type { Topic } from '@/content/types';

const reviewedSchema = z.record(z.string(), z.boolean());

interface TopicCardListProps {
  topics: Topic[];
}

export function TopicCardList({ topics }: TopicCardListProps) {
  const [reviewed] = usePersistentState(
    'reviewed_topics',
    {} as Record<string, boolean>,
    reviewedSchema
  );

  const completedCount = topics.filter((t) => reviewed[t.id]).length;

  return (
    <div className="space-y-4">
      {/* Progress summary */}
      {completedCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span>{completedCount}/{topics.length} temas completados</span>
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden ml-2">
            <motion.div
              className="h-full bg-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / topics.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid gap-3"
      >
        {topics.map((topic, idx) => {
          const isCompleted = reviewed[topic.id] ?? false;

          return (
            <motion.div key={topic.id} variants={fadeUp} {...hoverLift}>
              <Link href={`/temas/${topic.id}`}>
                <Card className={`group hover:border-primary/30 hover:glow-sm transition-all duration-300 cursor-pointer ${isCompleted ? 'border-green-500/30 bg-green-500/[0.02]' : 'border-border/60'}`}>
                  <CardContent className="p-4 sm:p-6 flex items-center gap-3 sm:gap-5">
                    {/* Index number / check */}
                    <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isCompleted ? 'bg-green-500/15' : 'bg-primary/10 group-hover:bg-primary/15'}`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <span className="text-sm sm:text-base font-bold text-primary">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h2 className={`text-sm sm:text-base font-semibold truncate transition-colors ${isCompleted ? 'text-foreground/80' : 'group-hover:text-primary'}`}>
                        {topic.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {topic.realWorldAnalogy.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          {topic.estimatedMinutes} min
                        </span>
                        <Badge variant="secondary" className="text-[10px] sm:text-xs h-5 sm:h-6">
                          {es.difficulty[topic.difficulty]}
                        </Badge>
                        {topic.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs h-6 hidden sm:inline-flex">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Arrow / completed badge */}
                    <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center shrink-0 transition-all ${isCompleted ? 'bg-green-500/10' : 'bg-muted/50 group-hover:bg-primary/10 group-hover:translate-x-0.5'}`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
