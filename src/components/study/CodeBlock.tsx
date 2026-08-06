'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
  code: string;
  title?: string;
  description?: string;
}

export function CodeBlock({ code, title, description }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm">
      {title && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-muted/60 border-b border-border/50">
          <span className="text-xs font-medium text-muted-foreground">{title}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            aria-label="Copiar código"
            className="h-7 px-2 text-muted-foreground hover:text-foreground"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      )}
      {!title && (
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            aria-label="Copiar código"
            className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed bg-muted/30 font-mono">
        <code className="text-foreground/85">{code}</code>
      </pre>
      {description && (
        <div className="px-4 py-2.5 text-xs text-muted-foreground border-t border-border/50 bg-muted/30 italic">
          {description}
        </div>
      )}
    </div>
  );
}
