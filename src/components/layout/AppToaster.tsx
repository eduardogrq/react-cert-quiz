'use client';

import { Toaster } from 'sonner';

export function AppToaster() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        className: 'border-border bg-card text-foreground shadow-lg',
        duration: 3000,
      }}
    />
  );
}
