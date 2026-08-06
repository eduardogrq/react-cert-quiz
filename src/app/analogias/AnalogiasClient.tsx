'use client';

import { Lightbulb } from 'lucide-react';
import { AnalogyCard } from '@/components/study/AnalogyCard';
import { CourseSelector } from '@/components/layout/CourseSelector';
import { useSelectedCourse } from '@/lib/hooks/use-selected-course';
import { es } from '@/lib/i18n/es';

export function AnalogiasClient() {
  const { courseId, setCourseId, courseTopics } = useSelectedCourse();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-6 w-6 text-yellow-500" />
        <h1 className="text-2xl font-bold">{es.nav.analogies}</h1>
      </div>
      <p className="text-muted-foreground">
        Repaso express de todos los conceptos a través de sus analogías.
      </p>

      <CourseSelector selectedCourseId={courseId} onSelect={setCourseId} />

      <div className="space-y-4">
        {courseTopics.map((topic) => (
          <div key={topic.id} className="space-y-1">
            <h2 className="text-sm font-medium text-muted-foreground">
              {topic.title}
            </h2>
            <AnalogyCard
              analogy={topic.realWorldAnalogy}
              topicTitle={topic.title}
              defaultExpanded={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
