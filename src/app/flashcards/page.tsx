import { FlashcardsClient } from './FlashcardsClient';
import { topics } from '@/content/index';

export default function FlashcardsPage() {
  return <FlashcardsClient topics={topics} />;
}
