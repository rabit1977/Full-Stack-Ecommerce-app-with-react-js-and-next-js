// app/providers.tsx
'use client';

import { QuickViewProvider } from '@/lib/context/quick-view-context';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QuickViewProvider>
          {children}
          <Toaster position="bottom-center" richColors />
        </QuickViewProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}