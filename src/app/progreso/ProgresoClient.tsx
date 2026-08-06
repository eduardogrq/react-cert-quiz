'use client';

import { useState, useCallback } from 'react';
import { Download, Upload, Trash2, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { course } from '@/config/course';
import { es } from '@/lib/i18n/es';

const STORAGE_PREFIX = course.storagePrefix;

function getAllProgressData(): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      try {
        data[key] = JSON.parse(localStorage.getItem(key) ?? '');
      } catch {
        data[key] = localStorage.getItem(key);
      }
    }
  }
  return data;
}

export function ProgresoClient() {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = useCallback(() => {
    const data = getAllProgressData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `react-cert-quiz-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ type: 'success', text: es.progress.exported });
  }, []);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string);
          if (typeof data !== 'object' || data === null) throw new Error('Invalid');
          for (const [key, value] of Object.entries(data)) {
            if (key.startsWith(STORAGE_PREFIX)) {
              localStorage.setItem(key, JSON.stringify(value));
            }
          }
          setMessage({ type: 'success', text: es.progress.imported });
          setTimeout(() => window.location.reload(), 1000);
        } catch {
          setMessage({ type: 'error', text: es.progress.invalidFile });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const handleReset = useCallback(() => {
    if (!window.confirm(es.progress.confirmReset)) return;
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    setMessage({ type: 'success', text: 'Progreso reiniciado' });
    setTimeout(() => window.location.reload(), 1000);
  }, []);

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">{es.nav.progress}</h1>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-500/10 text-green-700 dark:text-green-400'
              : 'bg-destructive/10 text-destructive'
          }`}
        >
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gestión de datos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={handleExport} variant="outline" className="w-full gap-2">
            <Download className="h-4 w-4" />
            {es.progress.export}
          </Button>
          <Button onClick={handleImport} variant="outline" className="w-full gap-2">
            <Upload className="h-4 w-4" />
            {es.progress.import}
          </Button>
          <Button onClick={handleReset} variant="destructive" className="w-full gap-2">
            <Trash2 className="h-4 w-4" />
            {es.progress.reset}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
