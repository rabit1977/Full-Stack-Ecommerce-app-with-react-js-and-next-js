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
    <div className='grid sm:grid-cols-2 gap-4'>
      <button
        onClick={() => handleNavigate('/orders')}
        className='bg-white rounded-lg p-6 shadow-sm dark:bg-slate-800 border dark:border-slate-700 hover:shadow-md transition-shadow text-left group'
      >
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
              Total Orders
            </p>
            <p className='text-3xl font-bold mt-2 dark:text-white'>
              {totalOrders}
            </p>
          </div>
          <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform'>
            <Package className='h-6 w-6 text-orange-600 dark:text-orange-400' />
          </div>
        </div>
        <p className='text-xs text-slate-500 dark:text-slate-400 mt-3 hover:underline hover:cursor-pointer hover:text-blue-600 transition-colors'>
          Click to view orders
        </p>
      </button>

      <div className='bg-white rounded-lg p-6 shadow-sm dark:bg-slate-800 border dark:border-slate-700'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
              Total Spent
            </p>
            <p className='text-3xl font-bold mt-2 dark:text-white'>
              {formatPrice(totalSpent)}
            </p>
          </div>
          <div className='w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center'>
            <span className='text-2xl'>💰</span>
          </div>
        </div>
        <p className='text-xs text-slate-500 dark:text-slate-400 mt-3'>
          Lifetime purchases
        </p>
      </div>

      <button
        onClick={() => handleNavigate('/cart')}
        className='bg-white rounded-lg p-6 shadow-sm dark:bg-slate-800 border dark:border-slate-700 hover:shadow-md transition-shadow text-left group'
      >
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
              Cart Items
            </p>
            <p className='text-3xl font-bold mt-2 dark:text-white'>
              {cartItems}
            </p>
          </div>
          <div className='w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform'>
            <ShoppingCart className='h-6 w-6 text-orange-600 dark:text-orange-400' />
          </div>
        </div>
        <p className='text-xs text-slate-500 dark:text-slate-400 mt-3 hover:underline hover:cursor-pointer hover:text-orange-600 transition-colors'>
          Click to view cart
        </p>
      </button>

      <button
        onClick={() => handleNavigate('/wishlist')}
        className='bg-white rounded-lg p-6 shadow-sm dark:bg-slate-800 border dark:border-slate-700 hover:shadow-md transition-shadow text-left group'
      >
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
              Wishlist
            </p>
            <p className='text-3xl font-bold mt-2 dark:text-white'>
              {wishlistItems}
            </p>
          </div>
          <div className='w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform'>
            <Heart className='h-6 w-6 text-pink-600 dark:text-pink-400' />
          </div>
        </div>
        <p className='text-xs text-slate-500 dark:text-slate-400 mt-3 hover:underline hover:cursor-pointer hover:text-pink-600 transition-colors'>
          Click to view wishlist
        </p>
      </button>
    </div>
  );
}
