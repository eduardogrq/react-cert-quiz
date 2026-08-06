'use client';

import { es } from '@/lib/i18n/es';
import { PageTransition } from '@/components/layout/PageTransition';
import { TopicCardList } from '@/components/study/TopicCardList';
import { CourseSelector } from '@/components/layout/CourseSelector';
import { useSelectedCourse } from '@/lib/hooks/use-selected-course';

export function TemasClient() {
  const { courseId, setCourseId, course, courseTopics } = useSelectedCourse();

  return (
    <PageTransition className="space-y-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">{es.nav.topics}</h1>
          <p className="text-muted-foreground text-base mt-2">
            {course.name} — {courseTopics.length} temas ordenados por dificultad creciente
          </p>
        </div>
        <CourseSelector selectedCourseId={courseId} onSelect={setCourseId} />
      </div>
      <TopicCardList topics={courseTopics} />
    </PageTransition>
  );
}
