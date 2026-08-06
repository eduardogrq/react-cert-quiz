'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Trophy, Clock, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { es } from '@/lib/i18n/es';
import { PageTransition } from '@/components/layout/PageTransition';
import { AnimatedList, AnimatedItem } from '@/components/layout/AnimatedList';
import { HomeCards } from '@/components/home/HomeCards';
import { CourseSelector } from '@/components/layout/CourseSelector';
import { useSelectedCourse } from '@/lib/hooks/use-selected-course';

export function HomeClient() {
  const { courseId, setCourseId, course, courseTopics } = useSelectedCourse();

  const totalTopics = courseTopics.length;
  const totalFlashcards = courseTopics.reduce((sum, t) => sum + t.flashcards.length, 0);
  const totalQuiz = courseTopics.reduce((sum, t) => sum + t.quiz.length, 0);
  const totalMinutes = courseTopics.reduce((sum, t) => sum + t.estimatedMinutes, 0);

  return (
    <PageTransition className="space-y-8 sm:space-y-12">
      {/* Hero */}
      <section className="text-center space-y-4 sm:space-y-5 pt-6 sm:pt-10 pb-4 sm:pb-6">
        <Badge variant="secondary" className="text-sm font-medium px-4 py-1.5">
          {course.badge}
        </Badge>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gradient">
          {es.dashboard.welcome}
        </h1>
        <p className="text-muted-foreground text-base sm:text-xl max-w-xl mx-auto leading-relaxed">
          {totalTopics} temas · {totalFlashcards} flashcards · {totalQuiz} preguntas con explicaciones detalladas
        </p>
        <div className="flex items-center justify-center gap-2 text-base text-muted-foreground">
          <Clock className="h-5 w-5" />
          <span>{totalMinutes} minutos de contenido estimado</span>
        </div>
      </section>

      {/* Course selector */}
      <section className="flex justify-center">
        <CourseSelector selectedCourseId={courseId} onSelect={setCourseId} />
      </section>

      {/* Stats grid */}
      <HomeCards
        totalTopics={totalTopics}
        totalFlashcards={totalFlashcards}
        totalQuiz={totalQuiz}
      />

      {/* Recommended action */}
      {courseTopics.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {es.dashboard.nextAction}
            </h2>
          </div>
          <Link href={`/temas/${courseTopics[0].id}`}>
            <Card className="group hover:border-primary/40 hover:glow-sm transition-all duration-300 cursor-pointer border-border/60">
              <CardContent className="flex items-center justify-between gap-3 p-4 sm:p-6">
                <div className="space-y-1 min-w-0">
                  <p className="text-base sm:text-lg font-semibold group-hover:text-primary transition-colors truncate">
                    {courseTopics[0].title}
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground truncate">
                    {courseTopics[0].estimatedMinutes} min · {courseTopics[0].flashcards.length} flashcards · {courseTopics[0].quiz.length} preguntas
                  </p>
                </div>
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>
      )}

      {/* Topic list preview */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Temas del curso
        </h2>
        <AnimatedList className="grid gap-2">
          {courseTopics.map((topic, idx) => (
            <AnimatedItem key={topic.id}>
              <Link href={`/temas/${topic.id}`}>
                <div className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-accent/50 transition-colors">
                  <span className="text-xs sm:text-sm font-mono text-muted-foreground w-5 sm:w-6 text-right shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium truncate group-hover:text-primary transition-colors">
                      {topic.title}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {topic.realWorldAnalogy.title}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] sm:text-xs shrink-0">
                    {es.difficulty[topic.difficulty]}
                  </Badge>
                </div>
              </Link>
            </AnimatedItem>
          ))}
        </AnimatedList>
      </section>

      {/* CTA */}
      <section className="flex flex-col sm:flex-row justify-center gap-3 pb-8">
        <Link href="/temas">
          <Button size="lg" className="w-full sm:w-auto gap-2 shadow-md">
            <BookOpen className="h-4 w-4" />
            Estudiar temas
          </Button>
        </Link>
        <Link href="/quiz">
          <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
            <Trophy className="h-4 w-4" />
            Practicar quiz
          </Button>
        </Link>
      </section>
    </PageTransition>
  );
}
