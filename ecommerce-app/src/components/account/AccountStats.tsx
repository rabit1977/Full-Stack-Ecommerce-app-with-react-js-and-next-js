'use client';

import { formatPrice } from '@/lib/utils/formatters';
import { Heart, Package, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AccountStatsProps {
  totalOrders: number;
  totalSpent: number;
  cartItems: number;
  wishlistItems: number;
}

export function AccountStats({
  totalOrders,
  totalSpent,
  cartItems,
  wishlistItems,
}: AccountStatsProps) {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className='grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6'>
      <button
        onClick={() => handleNavigate('/orders')}
        className='glass-card p-6 border-blue-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-left group relative overflow-hidden'
      >
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1'>
              Total Orders
            </p>
            <p className='text-2xl sm:text-3xl font-black tracking-tight text-foreground'>
              {totalOrders}
            </p>
          </div>
          <div className='w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ring-1 ring-inset ring-white/10'>
            <Package className='h-6 w-6' />
          </div>
        </div>
        <div className='mt-4 flex items-center text-[10px] sm:text-xs font-bold text-blue-500 group-hover:underline'>
           VIEW ALL ORDERS
        </div>
      </button>

      <div className='glass-card p-6 border-violet-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1'>
              Total Spent
            </p>
            <p className='text-2xl sm:text-3xl font-black tracking-tight text-foreground'>
              {formatPrice(totalSpent)}
            </p>
          </div>
          <div className='w-12 h-12 bg-violet-500/10 text-violet-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ring-1 ring-inset ring-white/10'>
            <span className='text-2xl font-black'>$</span>
          </div>
        </div>
        <div className='mt-4 flex items-center text-[10px] sm:text-xs font-bold text-muted-foreground'>
           LIFETIME PURCHASES
        </div>
      </div>

      <button
        onClick={() => handleNavigate('/cart')}
        className='glass-card p-6 border-pink-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-left group relative overflow-hidden'
      >
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1'>
              Cart Items
            </p>
            <p className='text-2xl sm:text-3xl font-black tracking-tight text-foreground'>
              {cartItems}
            </p>
          </div>
          <div className='w-12 h-12 bg-pink-500/10 text-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ring-1 ring-inset ring-white/10'>
            <ShoppingCart className='h-6 w-6' />
          </div>
        </div>
        <div className='mt-4 flex items-center text-[10px] sm:text-xs font-bold text-pink-500 group-hover:underline'>
           CHECKOUT NOW
        </div>
      </button>

      <button
        onClick={() => handleNavigate('/wishlist')}
        className='glass-card p-6 border-orange-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-left group relative overflow-hidden'
      >
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1'>
              Wishlist
            </p>
            <p className='text-2xl sm:text-3xl font-black tracking-tight text-foreground'>
              {wishlistItems}
            </p>
          </div>
          <div className='w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ring-1 ring-inset ring-white/10'>
            <Heart className='h-6 w-6' />
          </div>
        </div>
        <div className='mt-4 flex items-center text-[10px] sm:text-xs font-bold text-orange-500 group-hover:underline'>
           VIEW SAVED ITEMS
        </div>
      </button>
    </div>
  );
}
