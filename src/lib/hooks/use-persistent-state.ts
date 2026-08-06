'use client';

import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod/v4';
import { course } from '@/config/course';

const STORAGE_PREFIX = course.storagePrefix;

/**
 * Hook para persistir estado en localStorage con validación Zod.
 * - Prefijo versionado para migraciones seguras
 * - No rompe si localStorage está vacío o corrupto
 * - Solo ejecuta en cliente
 */
export function usePersistentState<T>(
  key: string,
  defaultValue: T,
  schema: z.ZodType<T>
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const storageKey = `${STORAGE_PREFIX}${key}`;

  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === null) return defaultValue;
      const parsed = JSON.parse(stored);
      const result = schema.safeParse(parsed);
      if (result.success) return result.data;
      return defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
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
