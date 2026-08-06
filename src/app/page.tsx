import Link from 'next/link';
import { ArrowRight, BookOpen, Brain, Trophy, Clock, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { topics } from '@/content/index';
import { course } from '@/config/course';
import { es } from '@/lib/i18n/es';

export default function HomePage() {
  const totalTopics = topics.length;
  const totalFlashcards = topics.reduce((sum, t) => sum + t.flashcards.length, 0);
  const totalQuiz = topics.reduce((sum, t) => sum + t.quiz.length, 0);
  const totalMinutes = topics.reduce((sum, t) => sum + t.estimatedMinutes, 0);

  return (
    <div className="space-y-8 sm:space-y-12">
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

      {/* Stats grid */}
      <section className="grid grid-cols-3 gap-3 sm:gap-5">
        <Card className="group hover:glow-sm transition-shadow duration-300 border-border/60">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <span className="text-2xl sm:text-4xl font-bold">{totalTopics}</span>
            </div>
            <p className="text-xs sm:text-base text-muted-foreground mt-2 sm:mt-3 text-center sm:text-left">Temas con analogías</p>
          </CardContent>
        </Card>

        <Card className="group hover:glow-sm transition-shadow duration-300 border-border/60">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-chart-2/10 flex items-center justify-center group-hover:bg-chart-2/15 transition-colors">
                <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-chart-2" />
              </div>
              <span className="text-2xl sm:text-4xl font-bold">{totalFlashcards}</span>
            </div>
            <p className="text-xs sm:text-base text-muted-foreground mt-2 sm:mt-3 text-center sm:text-left">Flashcards con SRS</p>
          </CardContent>
        </Card>

        <Card className="group hover:glow-sm transition-shadow duration-300 border-border/60">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-chart-3/10 flex items-center justify-center group-hover:bg-chart-3/15 transition-colors">
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-chart-3" />
              </div>
              <span className="text-2xl sm:text-4xl font-bold">{totalQuiz}</span>
            </div>
            <p className="text-xs sm:text-base text-muted-foreground mt-2 sm:mt-3 text-center sm:text-left">Preguntas de quiz</p>
          </CardContent>
        </Card>
      </section>

      {/* Recommended action */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {es.dashboard.nextAction}
          </h2>
        </div>
        <Link href={`/temas/${topics[0].id}`}>
          <Card className="group hover:border-primary/40 hover:glow-sm transition-all duration-300 cursor-pointer border-border/60">
            <CardContent className="flex items-center justify-between gap-3 p-4 sm:p-6">
              <div className="space-y-1 min-w-0">
                <p className="text-base sm:text-lg font-semibold group-hover:text-primary transition-colors truncate">
                  {topics[0].title}
                </p>
                <p className="text-sm sm:text-base text-muted-foreground truncate">
                  {topics[0].estimatedMinutes} min · {topics[0].flashcards.length} flashcards · {topics[0].quiz.length} preguntas
                </p>
              </div>
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:translate-x-0.5 transition-all">
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* Topic list preview */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Todos los temas
        </h2>
        <div className="grid gap-2">
          {topics.map((topic, idx) => (
            <Link key={topic.id} href={`/temas/${topic.id}`}>
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
          ))}
        </div>
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
    </div>
  );
}
