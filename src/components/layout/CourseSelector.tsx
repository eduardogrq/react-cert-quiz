'use client';

import { motion } from 'framer-motion';
import { appConfig } from '@/config/course';
import { springSnappy } from '@/lib/motion';

interface CourseSelectorProps {
  selectedCourseId: string;
  onSelect: (courseId: string) => void;
}

export function CourseSelector({ selectedCourseId, onSelect }: CourseSelectorProps) {
  return (
    <div className="flex gap-2 p-1 rounded-lg bg-muted/50 border border-border/50 w-fit">
      {appConfig.courses.map((course) => (
        <button
          key={course.id}
          onClick={() => onSelect(course.id)}
          className="relative px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer"
        >
          {selectedCourseId === course.id && (
            <motion.div
              layoutId="course-selector-bg"
              className="absolute inset-0 bg-background border border-border shadow-sm rounded-md"
              transition={springSnappy}
            />
          )}
          <span className={`relative z-10 ${
            selectedCourseId === course.id ? 'text-foreground' : 'text-muted-foreground'
          }`}>
            {course.name}
          </span>
        </button>
      ))}
    </div>
  );
}
