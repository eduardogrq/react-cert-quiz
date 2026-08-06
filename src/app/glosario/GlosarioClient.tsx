'use client';

import { useState, useMemo } from 'react';
import { Search, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { es } from '@/lib/i18n/es';
import type { KeyTerm } from '@/content/types';

interface GlossaryEntry extends KeyTerm {
  topicId: string;
  topicTitle: string;
}

interface GlosarioClientProps {
  entries: GlossaryEntry[];
}

export function GlosarioClient({ entries }: GlosarioClientProps) {
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    if (!filter.trim()) return entries;
    const q = filter.toLowerCase();
    return entries.filter(
      (e) =>
        e.term.toLowerCase().includes(q) ||
        e.definition.toLowerCase().includes(q) ||
        e.analogyHint.toLowerCase().includes(q)
    );
  }, [filter, entries]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <BookOpen className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">{es.nav.glossary}</h1>
        <Badge variant="secondary" className="ml-auto text-sm">
          {entries.length} términos
        </Badge>
      </div>

      {/* Filter */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar término, definición o analogía..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-center text-lg text-muted-foreground py-12">
            No se encontraron términos para &ldquo;{filter}&rdquo;
          </p>
        )}
        {filtered.map((entry) => (
          <Card key={`${entry.topicId}-${entry.term}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <code className="text-base font-semibold text-primary">
                    {entry.term}
                  </code>
                  <p className="text-base">{entry.definition}</p>
                  <p className="text-sm text-muted-foreground italic">
                    &ldquo;{entry.analogyHint}&rdquo;
                  </p>
                </div>
                <Link
                  href={`/temas/${entry.topicId}`}
                  className="text-sm text-muted-foreground hover:text-primary shrink-0"
                >
                  {entry.topicTitle.split(':')[0]}
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
