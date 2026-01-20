import { getCartAction } from '@/actions/cart-actions';
import { getWishlistAction } from '@/actions/wishlist-actions';
import { Footer } from '@/components/layout/footer';
import { MobileSidebarWrapper } from '@/components/layout/mobile-sidebar-wrapper';
import { QuickViewModal } from '@/components/product/quick-view-modal';
import { Toast } from '@/components/toast';
import { CommandPalette } from '@/components/ui/command-palette';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Electro Store',
    default: 'Electro Store',
  },
  description: 'The best place to buy awesome things!',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { wishlist } = await getWishlistAction();
  const cart = await getCartAction();

  const initialWishlistCount = wishlist.length;
  const initialCartItemCount = cart.items.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0,
  );

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </head>
      <body className={inter.className}>
        <Providers>
          <CommandPalette />
          <div className='min-h-screen bg-white font-sans text-slate-800 dark:bg-slate-900 dark:text-slate-200'>
            <MobileSidebarWrapper
              initialWishlistCount={initialWishlistCount}
              initialCartItemCount={initialCartItemCount}
            />
            <main className='min-h-auto'>{children}</main>
            <Footer />
            <QuickViewModal/>
            <Toast />
          </div>
        </Providers>
      </body>
    </html>
  );
}
