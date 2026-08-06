import { topics } from '@/content/index';
import { es } from '@/lib/i18n/es';
import { PageTransition } from '@/components/layout/PageTransition';
import { TopicCardList } from '@/components/study/TopicCardList';

export default function TemasPage() {
  return (
    <PageTransition className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{es.nav.topics}</h1>
        <p className="text-muted-foreground text-base mt-2">
          {topics.length} temas ordenados por dificultad creciente
        </p>
      </div>
      <TopicCardList topics={topics} />
    </PageTransition>
  );
}
