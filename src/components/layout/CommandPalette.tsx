'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, BookOpen, HelpCircle, Zap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { topics } from '@/content/index';

interface SearchItem {
  id: string;
  type: 'topic' | 'term' | 'question';
  title: string;
  subtitle: string;
  href: string;
}

function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const topic of topics) {
    items.push({
      id: `topic-${topic.id}`,
      type: 'topic',
      title: topic.title,
      subtitle: topic.realWorldAnalogy.title,
      href: `/temas/${topic.id}`,
    });

    for (const term of topic.keyTerms) {
      items.push({
        id: `term-${topic.id}-${term.term}`,
        type: 'term',
        title: term.term,
        subtitle: term.definition.slice(0, 80),
        href: `/temas/${topic.id}`,
      });
    }

    for (const q of topic.quiz) {
      items.push({
        id: `q-${q.id}`,
        type: 'question',
        title: q.question.slice(0, 80),
        subtitle: topic.title,
        href: `/quiz`,
      });
    }
  }

  return items;
}

function fuzzyMatch(text: string, query: string): boolean {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  let qi = 0;
  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const searchIndex = useMemo(() => buildSearchIndex(), []);

  const results = useMemo(() => {
    if (!query.trim()) return searchIndex.slice(0, 10);
    return searchIndex
      .filter((item) => fuzzyMatch(`${item.title} ${item.subtitle}`, query))
      .slice(0, 10);
  }, [query, searchIndex]);

  // Cmd+K to open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      setOpen(false);
      setQuery('');
      router.push(item.href);
    },
    [router]
  );

  // Keyboard navigation inside dialog
  function handleDialogKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  }

  const typeIcon = {
    topic: BookOpen,
    term: Zap,
    question: HelpCircle,
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-lg p-0 gap-0"
        onKeyDown={handleDialogKeyDown}
      >
        <DialogTitle className="sr-only">Búsqueda global</DialogTitle>
        <div className="flex items-center border-b border-border px-3">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            placeholder="Buscar temas, términos, preguntas..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="border-0 focus-visible:ring-0 shadow-none"
            autoFocus
          />
          <kbd className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
            Esc
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-1.5">
          {results.length === 0 && (
            <p className="text-center text-base text-muted-foreground py-8">
              Sin resultados
            </p>
          )}
          {results.map((item, idx) => {
            const Icon = typeIcon[item.type];
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left text-base transition-colors ${
                  idx === selectedIndex ? 'bg-accent' : 'hover:bg-accent/50'
                }`}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.title}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="border-t border-border px-4 py-2.5 text-sm text-muted-foreground flex gap-4">
          <span>↑↓ navegar</span>
          <span>↵ seleccionar</span>
          <span>esc cerrar</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
