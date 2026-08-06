import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { AppHeader } from '@/components/layout/AppHeader';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { course } from '@/config/course';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${course.name} — Repaso para certificación`,
  description: course.description,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground text-base">
        <ThemeProvider>
          <AppHeader />
          <CommandPalette />
          <main className="flex-1 w-full max-w-6xl mx-auto px-5 sm:px-8 py-8">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
