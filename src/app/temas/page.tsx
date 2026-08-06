import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { topics } from '@/content/index';
import { es } from '@/lib/i18n/es';

export default function TemasPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{es.nav.topics}</h1>
        <p className="text-muted-foreground text-base mt-2">
          {topics.length} temas ordenados por dificultad creciente
        </p>
      </div>
      <div className="grid gap-3">
        {topics.map((topic, idx) => (
          <Link key={topic.id} href={`/temas/${topic.id}`}>
            <Card className="group hover:border-primary/30 hover:glow-sm transition-all duration-300 cursor-pointer border-border/60">
              <CardContent className="p-6 flex items-center gap-5">
                {/* Index number */}
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                  <span className="text-base font-bold text-primary">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold truncate group-hover:text-primary transition-colors">
                      {topic.title}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {topic.realWorldAnalogy.title} — {topic.summary.slice(0, 80)}...
                  </p>
                  <div className="flex items-center gap-3 pt-0.5">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {topic.estimatedMinutes} min
                    </span>
                    <Badge variant="secondary" className="text-xs h-6">
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
                <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
