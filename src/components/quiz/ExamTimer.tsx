'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface ExamTimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
  running: boolean;
}

export function ExamTimer({ durationMinutes, onTimeUp, running }: ExamTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(durationMinutes * 60);

  useEffect(() => {
    if (!running) return;
    if (remainingSeconds <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, remainingSeconds, onTimeUp]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const isLow = remainingSeconds < 300; // less than 5 min

  return (
    <div
      className={`flex items-center gap-1.5 font-mono text-sm ${
        isLow ? 'text-destructive font-semibold' : 'text-muted-foreground'
      }`}
      aria-live="polite"
      aria-atomic="true"
    >
      <Clock className="h-4 w-4" />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
