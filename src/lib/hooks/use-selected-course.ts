'use client';

import { useMemo } from 'react';
import { z } from 'zod/v4';
import { usePersistentState } from './use-persistent-state';
import { appConfig, getCourseById, type CourseConfig } from '@/config/course';
import { getTopicsByCourse } from '@/content/index';
import type { Topic } from '@/content/types';

const courseIdSchema = z.string();

export function useSelectedCourse() {
  const defaultCourseId = appConfig.courses[0].id;

  const [courseId, setCourseId] = usePersistentState<string>(
    'selected_course',
    defaultCourseId,
    courseIdSchema
  );

  const validCourseId = getCourseById(courseId) ? courseId : defaultCourseId;

  const course: CourseConfig = useMemo(
    () => getCourseById(validCourseId) ?? appConfig.courses[0],
    [validCourseId]
  );

  const courseTopics: Topic[] = useMemo(
    () => getTopicsByCourse(validCourseId),
    [validCourseId]
  );

  return {
    courseId: validCourseId,
    setCourseId,
    course,
    courseTopics,
  };
}
