import { getProductsByIdsAction } from '@/actions/product-actions';
import { getWishlistAction } from '@/actions/wishlist-actions';
import AuthGuard from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { ProductWithRelations } from '@/lib/types';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { WishlistClient } from './WishlistClient';

const WishlistPage = async () => {
  const { wishlist: wishlistItems } = await getWishlistAction();
  let products: ProductWithRelations[] = [];

  if (wishlistItems.length > 0) {
    const fetchedProducts = await getProductsByIdsAction(wishlistItems);
    products = fetchedProducts.filter((p) => p !== null);
  }

  return (
    <AuthGuard>
      {products.length === 0 ? (
        <div className='container mx-auto px-4 py-16 text-center'>
          <Heart className='mx-auto h-24 w-24 text-slate-300 dark:text-slate-700' />
          <h2 className='mt-6 text-2xl font-bold dark:text-white'>
            Your Wishlist is empty
          </h2>
          <p className='mt-2 text-slate-500 dark:text-slate-400'>
            Browse products and save your favorites for later.
          </p>
          <Button
            size='lg'
            //onClick={() => router.push('/products')} // This needs to be a Link in server component
            className='mt-8'
            asChild
          >
            <Link href='/products'>Find Products</Link>
          </Button>
        </div>
      ) : (
        <WishlistClient products={products} />
      )}
    </AuthGuard>
  );
};

export default WishlistPage;
