import { QuizClient } from './QuizClient';
import { topics } from '@/content/index';

export default function QuizPage() {
  return <QuizClient topics={topics} />;
}
