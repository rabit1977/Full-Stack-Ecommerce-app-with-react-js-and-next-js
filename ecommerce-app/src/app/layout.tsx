import { getCartAction } from '@/actions/cart-actions';
import { getWishlistAction } from '@/actions/wishlist-actions';
import { FooterWrapper } from '@/components/layout/footer-wrapper';
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
    (sum: number, item: { quantity: number }) => sum + item.quantity,
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
          <div className='min-h-screen bg-background text-foreground'>
            <MobileSidebarWrapper
              initialWishlistCount={initialWishlistCount}
              initialCartItemCount={initialCartItemCount}
            />
            <main className='min-h-auto pb-20 lg:pb-0'>{children}</main>
            <FooterWrapper />
            <QuickViewModal/>
            <Toast />
          </div>
        </Providers>
      </body>
    </html>
  );
}
