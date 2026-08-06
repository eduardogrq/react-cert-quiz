'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Clock, AlertTriangle, BookOpen, Zap, FileCode, Code2, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AnalogyCard } from './AnalogyCard';
import { CodeBlock } from './CodeBlock';
import { CodeChallengeBlock } from './CodeChallengeBlock';
import { springSnappy } from '@/lib/motion';
import { es } from '@/lib/i18n/es';
import type { Topic } from '@/content/types';

interface TopicViewProps {
  topic: Topic;
  nextTopic?: Topic;
  isReviewed?: boolean;
  onMarkReviewed?: () => void;
}

export function TopicView({ topic, nextTopic, isReviewed = false, onMarkReviewed }: TopicViewProps) {
  const [readProgress, setReadProgress] = useState(0);

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const scrolled = el.scrollTop / (el.scrollHeight - el.clientHeight);
    setReadProgress(Math.min(100, Math.round(scrolled * 100)));
  }

  return (
    <div className="space-y-2">
      {/* Header with progress bar */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 -mx-4 px-4 py-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/temas"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Temas</span>
            </Link>
            <span className="text-border hidden sm:inline">|</span>
            <Badge variant="secondary" className="font-medium text-xs sm:text-sm shrink-0">
              {es.difficulty[topic.difficulty]}
            </Badge>
            <span className="text-xs sm:text-sm text-muted-foreground items-center gap-1 hidden sm:flex">
              <Clock className="h-3.5 w-3.5" />
              {topic.estimatedMinutes} {es.study.estimatedTime}
            </span>
          </div>
          <Button
            variant={isReviewed ? 'default' : 'outline'}
            size="sm"
            onClick={onMarkReviewed}
            className={`gap-1.5 shrink-0 ${isReviewed ? 'shadow-sm' : ''}`}
          >
            {isReviewed ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <Circle className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">{isReviewed ? es.study.reviewed : es.study.markAsReviewed}</span>
            <span className="sm:hidden">{isReviewed ? '✓' : 'Repasar'}</span>
          </Button>
        </div>
        <Progress value={readProgress} className="h-1" />
      </div>

      {/* Scrollable content */}
      <div
        className="space-y-10 pt-6"
        onScroll={handleScroll}
      >
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {topic.title}
        </h1>

        {/* 1. Analogía — siempre primero */}
        <section aria-labelledby="analogy-heading">
          <h2 id="analogy-heading" className="sr-only">{es.study.analogy}</h2>
          <AnalogyCard
            analogy={topic.realWorldAnalogy}
            topicTitle={topic.title}
          />
        </section>

        {/* 2. Resumen */}
        <section aria-labelledby="summary-heading" className="space-y-3">
          <SectionHeading id="summary-heading" icon={BookOpen} title={es.study.summary} />
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-6">
              <p className="text-base text-muted-foreground leading-relaxed">{topic.summary}</p>
            </CardContent>
          </Card>
        </section>

        {/* 3. Explicación */}
        <section aria-labelledby="explanation-heading" className="space-y-3">
          <SectionHeading id="explanation-heading" icon={BookOpen} title={es.study.explanation} />
          <div className="space-y-3">
            <ExplanationContent content={topic.explanation} />
          </div>
        </section>

        {/* 4. Key Terms */}
        <section aria-labelledby="terms-heading" className="space-y-4">
          <SectionHeading id="terms-heading" icon={Zap} title={es.study.keyTerms} />
          <div className="grid gap-4 sm:grid-cols-2">
            {topic.keyTerms.map((term) => (
              <Card key={term.term} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-5 space-y-2">
                  <code className="text-base font-semibold text-primary">
                    {term.term}
                  </code>
                  <p className="text-base text-foreground/90">{term.definition}</p>
                  <p className="text-sm text-muted-foreground italic pt-0.5">
                    &ldquo;{term.analogyHint}&rdquo;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 5. Ejemplos de código */}
        {topic.codeExamples && topic.codeExamples.length > 0 && (
          <section aria-labelledby="code-heading" className="space-y-4">
            <SectionHeading id="code-heading" icon={FileCode} title={es.study.codeExamples} />
            <div className="space-y-4">
              {topic.codeExamples.map((example, idx) => (
                <CodeBlock
                  key={idx}
                  code={example.code}
                  language={example.language}
                  title={example.title}
                  description={example.description}
                />
              ))}
            </div>
          </section>
        )}

        {/* 6. Code Challenge */}
        {topic.codeChallenge && (
          <section aria-labelledby="challenge-heading" className="space-y-4">
            <SectionHeading id="challenge-heading" icon={Code2} title={es.study.codeChallenge} />
            <CodeChallengeBlock challenge={topic.codeChallenge} />
          </section>
        )}

        {/* 7. Pitfalls */}
        <section aria-labelledby="pitfalls-heading" className="space-y-4">
          <SectionHeading id="pitfalls-heading" icon={AlertTriangle} title={es.study.pitfalls} />
          <Card className="border-destructive/15 bg-destructive/[0.03]">
            <CardContent className="p-6">
              <ul className="space-y-4">
                {topic.pitfalls.map((pitfall, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 text-base text-muted-foreground leading-relaxed"
                  >
                    <div className="h-6 w-6 rounded bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                    </div>
                    {pitfall}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 7. Cheat Sheet */}
        {topic.cheatSheet && topic.cheatSheet.length > 0 && (
          <section aria-labelledby="cheatsheet-heading" className="space-y-4">
            <SectionHeading id="cheatsheet-heading" icon={Zap} title={es.study.cheatSheet} />
            <Card className="border-primary/15 bg-primary/[0.03]">
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {topic.cheatSheet.map((item, idx) => (
                    <li key={idx} className="text-base font-mono text-muted-foreground flex gap-2 leading-relaxed">
                      <span className="text-primary/60 shrink-0">{'>'}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Bottom CTA — Completar y siguiente */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={springSnappy}
          className="pt-4 pb-8"
        >
          <Card className={`border-2 transition-colors ${isReviewed ? 'border-green-500/40 bg-green-500/[0.03]' : 'border-primary/30 bg-primary/[0.03]'}`}>
            <CardContent className="p-6 sm:p-8 space-y-5">
              {/* Status message */}
              <div className="flex items-center gap-3">
                {isReviewed ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={springSnappy}
                    className="h-10 w-10 rounded-full bg-green-500/15 flex items-center justify-center"
                  >
                    <Trophy className="h-5 w-5 text-green-500" />
                  </motion.div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-base">
                    {isReviewed ? '¡Tema completado!' : '¿Terminaste de estudiar este tema?'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isReviewed ? 'Puedes continuar al siguiente tema o volver a la lista.' : 'Márcalo como repasado para registrar tu avance.'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {!isReviewed && (
                  <Button
                    onClick={onMarkReviewed}
                    size="lg"
                    className="gap-2 flex-1 sm:flex-none"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Marcar como completado
                  </Button>
                )}
                {nextTopic && (
                  <Link
                    href={`/temas/${nextTopic.id}`}
                    className={`inline-flex items-center justify-center gap-2 rounded-md px-6 h-11 text-sm font-medium transition-colors flex-1 sm:flex-none ${isReviewed ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'}`}
                  >
                    <span className="truncate">Siguiente: {nextTopic.title}</span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </Link>
                )}
                {!nextTopic && isReviewed && (
                  <Link
                    href="/temas"
                    className="inline-flex items-center justify-center gap-2 rounded-md px-6 h-11 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Volver a temas
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}

function SectionHeading({
  id,
  icon: Icon,
  title,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <h2 id={id} className="flex items-center gap-3 text-xl font-semibold">
      <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
        <Icon className="h-4.5 w-4.5 text-primary" />
      </div>
      {title}
    </h2>
  );
}

/** Renders explanation with basic markdown-like formatting */
function ExplanationContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentBlock: string[] = [];
  let inCodeBlock = false;

  function flushParagraph() {
    if (currentBlock.length > 0) {
      const text = currentBlock.join('\n');
      if (text.trim()) {
        elements.push(
          <p key={elements.length} className="text-base text-muted-foreground leading-[1.8]">
            {formatInlineCode(text)}
          </p>
        );
      }
      currentBlock = [];
    }
  }

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <CodeBlock key={elements.length} code={currentBlock.join('\n')} />
        );
        currentBlock = [];
        inCodeBlock = false;
      } else {
        flushParagraph();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      currentBlock.push(line);
      continue;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      elements.push(
        <h3 key={elements.length} className="text-lg font-semibold mt-8 mb-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary" />
          {line.slice(3)}
        </h3>
      );
    } else if (line.trim() === '') {
      flushParagraph();
    } else {
      currentBlock.push(line);
    }
  }
  flushParagraph();

  return <>{elements}</>;
}

function formatInlineCode(text: string): React.ReactNode[] {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="text-sm bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-mono font-medium">
          {part.slice(1, -1)}
        </code>
      );
    }
    // Handle bold
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    if (boldParts.length > 1) {
      return boldParts.map((bp, j) => {
        if (bp.startsWith('**') && bp.endsWith('**')) {
          return <strong key={`${i}-${j}`} className="text-foreground font-semibold">{bp.slice(2, -2)}</strong>;
        }
        return bp;
      });
    }
    return part;
  });
}
