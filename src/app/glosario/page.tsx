import { GlosarioClient } from './GlosarioClient';
import { topics } from '@/content/index';
import type { KeyTerm } from '@/content/types';

interface GlossaryEntry extends KeyTerm {
  topicId: string;
  topicTitle: string;
}

function buildGlossary(): GlossaryEntry[] {
  const entries: GlossaryEntry[] = [];
  for (const topic of topics) {
    for (const term of topic.keyTerms) {
      entries.push({ ...term, topicId: topic.id, topicTitle: topic.title });
    }
  }
  return entries.sort((a, b) => a.term.localeCompare(b.term));
}

export default function GlosarioPage() {
  const glossary = buildGlossary();
  return <GlosarioClient entries={glossary} />;
}
