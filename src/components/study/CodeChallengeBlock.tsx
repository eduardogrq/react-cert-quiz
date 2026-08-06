'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, RotateCcw, Lightbulb, Play, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { springSnappy } from '@/lib/motion';
import type { CodeChallenge } from '@/content/types';

interface CodeChallengeBlockProps {
  challenge: CodeChallenge;
}

type BlankStatus = 'idle' | 'correct' | 'incorrect';

export function CodeChallengeBlock({ challenge }: CodeChallengeBlockProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    Object.fromEntries(challenge.blanks.map((b) => [b.id, '']))
  );
  const [statuses, setStatuses] = useState<Record<string, BlankStatus>>(() =>
    Object.fromEntries(challenge.blanks.map((b) => [b.id, 'idle']))
  );
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const allCorrect = useMemo(
    () => Object.values(statuses).every((s) => s === 'correct'),
    [statuses]
  );

  const correctCount = useMemo(
    () => Object.values(statuses).filter((s) => s === 'correct').length,
    [statuses]
  );

  const handleCheck = useCallback(() => {
    const newStatuses: Record<string, BlankStatus> = {};
    for (const blank of challenge.blanks) {
      const userAnswer = answers[blank.id].trim();
      const isCorrect = blank.answers.some(
        (a) => a.toLowerCase() === userAnswer.toLowerCase()
      );
      newStatuses[blank.id] = isCorrect ? 'correct' : 'incorrect';
    }
    setStatuses(newStatuses);
    setSubmitted(true);
  }, [answers, challenge.blanks]);

  const handleReset = useCallback(() => {
    setAnswers(Object.fromEntries(challenge.blanks.map((b) => [b.id, ''])));
    setStatuses(Object.fromEntries(challenge.blanks.map((b) => [b.id, 'idle'])));
    setSubmitted(false);
    setShowHint(false);
  }, [challenge.blanks]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !submitted) {
        e.preventDefault();
        handleCheck();
      }
    },
    [handleCheck, submitted]
  );

  // Parse template into segments (text and blanks)
  const segments = useMemo(() => {
    const parts: { type: 'text' | 'blank'; value: string }[] = [];
    const regex = /\{\{(\w+)\}\}/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(challenge.template)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', value: challenge.template.slice(lastIndex, match.index) });
      }
      parts.push({ type: 'blank', value: match[1] });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < challenge.template.length) {
      parts.push({ type: 'text', value: challenge.template.slice(lastIndex) });
    }
    return parts;
  }, [challenge.template]);

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/60 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Desafío de código</span>
        </div>
        <span className="text-xs text-muted-foreground ml-auto font-mono">
          {challenge.language}
        </span>
      </div>

      {/* Instruction */}
      <div className="px-4 py-3 bg-muted/30 border-b border-border/40">
        <p className="text-sm text-foreground/90 leading-relaxed">{challenge.instruction}</p>
      </div>

      {/* Code editor area */}
      <div
        className="p-4 overflow-x-auto font-mono text-[13px] leading-[1.8]"
        style={{ backgroundColor: '#282c34' }}
      >
        <pre className="m-0 whitespace-pre-wrap">
          {segments.map((seg, i) => {
            if (seg.type === 'text') {
              return (
                <span key={i} className="text-[#abb2bf]">
                  {seg.value}
                </span>
              );
            }

            const blank = challenge.blanks.find((b) => b.id === seg.value);
            if (!blank) return null;

            const status = statuses[seg.value];
            const inputWidth = Math.max(
              (blank.placeholder?.length ?? 8) * 9,
              (answers[seg.value]?.length || 1) * 9,
              72
            );

            return (
              <span key={i} className="inline-block align-middle mx-0.5">
                <span className="relative inline-flex items-center">
                  <input
                    type="text"
                    value={answers[seg.value]}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, [seg.value]: e.target.value }))
                    }
                    onKeyDown={handleKeyDown}
                    placeholder={blank.placeholder ?? '___'}
                    disabled={submitted && status === 'correct'}
                    style={{ width: `${inputWidth}px` }}
                    className={`
                      h-7 px-2 py-0.5 rounded font-mono text-[13px]
                      border transition-all duration-200 outline-none
                      placeholder:text-[#636d83] placeholder:italic
                      ${status === 'idle'
                        ? 'bg-[#1e222a] border-[#4b5263] text-[#e5c07b] focus:border-primary focus:ring-1 focus:ring-primary/30'
                        : status === 'correct'
                          ? 'bg-[#1a2e1a] border-green-500/60 text-green-400'
                          : 'bg-[#2e1a1a] border-red-500/60 text-red-400'
                      }
                    `}
                  />
                  <AnimatePresence>
                    {status === 'correct' && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={springSnappy}
                        className="absolute -right-6 text-green-400"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </motion.span>
                    )}
                    {status === 'incorrect' && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={springSnappy}
                        className="absolute -right-6 text-red-400"
                      >
                        <X className="h-3.5 w-3.5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </span>
            );
          })}
        </pre>
      </div>

      {/* Progress bar */}
      {submitted && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="h-1 origin-left"
          style={{
            background: allCorrect
              ? '#10b981'
              : `linear-gradient(to right, #10b981 ${(correctCount / challenge.blanks.length) * 100}%, #ef4444 ${(correctCount / challenge.blanks.length) * 100}%)`,
          }}
        />
      )}

      {/* Actions & Feedback */}
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border-t border-border/40">
        {!submitted ? (
          <>
            <Button
              onClick={handleCheck}
              size="sm"
              className="gap-1.5"
              disabled={Object.values(answers).some((a) => !a.trim())}
            >
              <Play className="h-3.5 w-3.5" />
              Verificar
            </Button>
            {challenge.hint && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(true)}
                className="gap-1.5 text-muted-foreground"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                Pista
              </Button>
            )}
          </>
        ) : (
          <>
            <AnimatePresence mode="wait">
              {allCorrect ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={springSnappy}
                    className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center"
                  >
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  </motion.div>
                  <span className="text-sm font-medium text-green-500">
                    ¡Correcto! Ejercicio completado
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="retry"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-sm text-muted-foreground">
                    {correctCount}/{challenge.blanks.length} correctos
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-1.5 text-muted-foreground ml-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reintentar
            </Button>
          </>
        )}
      </div>

      {/* Hint area */}
      <AnimatePresence>
        {showHint && challenge.hint && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-2.5 bg-primary/5 border-t border-primary/20 text-sm text-primary/80 flex items-start gap-2">
              <Lightbulb className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{challenge.hint}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
