import { ExamClient } from './ExamClient';
import { topics } from '@/content/index';

export default function ExamenPage() {
  return <ExamClient topics={topics} />;
}
