import ErrorBoundary from '@/components/error-boundary';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { ThemeManager } from '@/components/layout/theme-manager';
import { QuickViewModal } from '@/components/product/quick-view-modal';
import { Toast } from '@/components/toast';
import { CommandPalette } from '@/components/ui/command-palette';
import { AuthSessionProvider, AuthSync } from '@/lib/providers/AuthSessionProvider';
import { ReduxProvider } from '@/lib/providers/ReduxProvider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Electro Store',
    default: 'Electro Store',
  },
  description: 'The best place to buy awesome things!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* Inline script to prevent theme flash (FOUC) */}
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light' || theme === 'dark') {
                    document.documentElement.classList.add(theme);
                  } else {
                    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    document.documentElement.classList.add(systemTheme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        /> */}
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthSessionProvider>
            <ReduxProvider>
              <AuthSync />
              <ThemeManager />
              <CommandPalette />
              <div className='min-h-screen bg-white font-sans text-slate-800 dark:bg-slate-900 dark:text-slate-200'>
                <Header />
                {/* <MobileSidebar /> */}
                <main className='min-h-auto'>{children}</main>
                <Footer />
                <QuickViewModal />
                <Toast />
              </div>
            </ReduxProvider>
          </AuthSessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
