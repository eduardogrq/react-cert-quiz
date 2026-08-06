'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { es } from '@/lib/i18n/es';
import { staggerContainer, fadeUp, hoverLift } from '@/lib/motion';
import type { Topic } from '@/content/types';

interface TopicCardListProps {
  topics: Topic[];
}

export function TopicCardList({ topics }: TopicCardListProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid gap-3"
    >
      {topics.map((topic, idx) => (
        <motion.div key={topic.id} variants={fadeUp} {...hoverLift}>
          <Link href={`/temas/${topic.id}`}>
            <Card className="group hover:border-primary/30 hover:glow-sm transition-all duration-300 cursor-pointer border-border/60">
              <CardContent className="p-4 sm:p-6 flex items-center gap-3 sm:gap-5">
                {/* Index number */}
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                  <span className="text-sm sm:text-base font-bold text-primary">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h2 className="text-sm sm:text-base font-semibold truncate group-hover:text-primary transition-colors">
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

                {/* Arrow */}
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
