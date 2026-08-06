'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { z } from 'zod/v4';
import { course } from '@/config/course';

const STORAGE_PREFIX = course.storagePrefix;

/**
 * Hook para persistir estado en localStorage con validación Zod.
 * - Prefijo versionado para migraciones seguras
 * - No rompe si localStorage está vacío o corrupto
 * - Hidratación segura: siempre inicia con defaultValue, lee localStorage en useEffect
 */
export function usePersistentState<T>(
  key: string,
  defaultValue: T,
  schema: z.ZodType<T>
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const storageKey = `${STORAGE_PREFIX}${key}`;
  const [state, setState] = useState<T>(defaultValue);
  const hydrated = useRef(false);

  // Read from localStorage after hydration (client only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        const result = schema.safeParse(parsed);
        if (result.success) {
          setState(result.data);
        }
      }
    } catch {
      // localStorage unavailable or corrupt — keep default
    }
    hydrated.current = true;
  }, [storageKey, schema]);

  // Persist to localStorage on state changes (skip initial hydration read)
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // localStorage full or unavailable — silently fail
    }
  }, [state, storageKey]);

  const reset = useCallback(() => {
    setState(defaultValue);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // silently fail
    }
  }, [defaultValue, storageKey]);

  return [state, setState, reset];
}
