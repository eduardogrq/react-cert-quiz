'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { es } from '@/lib/i18n/es';
import type { RealWorldAnalogy } from '@/content/types';

interface AnalogyCardProps {
  analogy: RealWorldAnalogy;
  topicTitle: string;
  defaultExpanded?: boolean;
}

export function AnalogyCard({
  analogy,
  topicTitle,
  defaultExpanded = true,
}: AnalogyCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Card className="relative overflow-hidden border-primary/25 bg-gradient-to-br from-primary/[0.06] via-primary/[0.03] to-transparent shadow-sm glow-sm">
      {/* Subtle decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none" />

      <CardHeader className="pb-3 relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="h-9 w-9 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-amber-500" aria-hidden="true" />
            </div>
            <span className="text-muted-foreground font-medium">{es.study.analogy}</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-controls="analogy-content"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xl font-semibold text-foreground mt-1.5">
          &ldquo;{analogy.title}&rdquo;
        </p>
      </CardHeader>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id="analogy-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <CardContent className="pt-0 space-y-5">
              {/* Scenario */}
              <p className="text-base text-muted-foreground leading-relaxed pl-3 border-l-2 border-primary/30 ml-1">
                {analogy.scenario}
              </p>

              {/* Mapping table */}
              <div className="rounded-lg overflow-hidden border border-border/60">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="w-1/2 text-sm uppercase tracking-wide font-semibold">
                        {es.analogy.inRealLife}
                      </TableHead>
                      <TableHead className="w-1/2 text-sm uppercase tracking-wide font-semibold">
                        {es.analogy.inTech.replace('React/JS', topicTitle)}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analogy.mapping.map((pair, idx) => (
                      <TableRow key={idx} className="hover:bg-primary/[0.03]">
                        <TableCell className="font-medium text-base py-3.5">
                          {pair.everyday}
                        </TableCell>
                        <TableCell className="py-3.5">
                          <code className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-md font-medium">
                            {pair.technical}
                          </code>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Where it breaks */}
              {analogy.whereItBreaks && (
                <div className="flex gap-3 p-4 rounded-lg bg-destructive/[0.06] border border-destructive/15">
                  <div className="h-7 w-7 rounded-md bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-destructive mb-1">
                      {es.analogy.whereItBreaks}
                    </p>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {analogy.whereItBreaks}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
