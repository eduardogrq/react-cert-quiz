'use client';

import { useState, useEffect, useRef } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { codeToHtml } from 'shiki';

interface CodeBlockProps {
  code: string;
  language?: 'tsx' | 'ts' | 'jsx' | 'js';
  title?: string;
  description?: string;
}

export function CodeBlock({ code, language = 'tsx', title, description }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    codeToHtml(code, {
      lang: language,
      theme: 'one-dark-pro',
    }).then((html) => {
      if (!cancelled) setHighlightedHtml(html);
    });
    return () => { cancelled = true; };
  }, [code, language]);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm group relative">
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
      <div
        ref={containerRef}
        className="overflow-x-auto text-[13px] leading-relaxed [&_pre]:p-4 [&_pre]:m-0 [&_pre]:bg-transparent [&_code]:font-mono"
        style={{ backgroundColor: '#282c34' }}
        dangerouslySetInnerHTML={
          highlightedHtml
            ? { __html: highlightedHtml }
            : { __html: `<pre class="p-4 m-0"><code class="font-mono text-foreground/85">${escapeHtml(code)}</code></pre>` }
        }
      />
      {description && (
        <div className="px-4 py-2.5 text-xs text-muted-foreground border-t border-border/50 bg-muted/30 italic">
          {description}
        </div>
      )}
    </div>
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
