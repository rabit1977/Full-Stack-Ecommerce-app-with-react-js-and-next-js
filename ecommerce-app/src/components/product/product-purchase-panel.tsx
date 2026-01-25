// =======================
// ✅ ENHANCED PRODUCT PURCHASE PANEL
// =======================
'use client';

import { addItemToCartAction } from '@/actions/cart-actions';
import { toggleWishlistAction } from '@/actions/wishlist-actions';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ProductWithImages } from '@/lib/types/product';
import { cn } from '@/lib/utils';
import {
    AlertTriangle,
    CheckCircle,
    Heart,
    Minus,
    Plus,
    RefreshCw,
    Shield,
    ShoppingCart,
    Tag,
    Truck,
    XCircle,
    Zap
} from 'lucide-react';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Label } from '../ui/label';

interface ProductPurchasePanelProps {
  product: ProductWithImages;
  selectedOptions: Record<string, string>;
  onOptionChange: (name: string, value: string) => void;
  initialIsWished: boolean;
  initialQuantityInCart: number;
}

export function ProductPurchasePanel({
  product,
  selectedOptions,
  onOptionChange,
  initialIsWished,
  initialQuantityInCart,
}: ProductPurchasePanelProps) {
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(
    initialQuantityInCart > 0 ? initialQuantityInCart : 1,
  );
  const [isWished, setIsWished] = useState(initialIsWished);

  // Stock status config
  const stock = product.stock;
  const isOutOfStock = stock === 0;
  const isVeryLowStock = !isOutOfStock && stock <= 3;
  const isLowStock = !isOutOfStock && stock < 10;

  const stockStatus = useMemo(() => {
    if (isOutOfStock) {
      return {
        label: 'Out of Stock',
        sublabel: 'Currently unavailable',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
        dotColor: 'bg-red-500',
        icon: XCircle,
      };
    }
    if (isVeryLowStock) {
      return {
        label: `Only ${stock} left!`,
        sublabel: 'Order soon',
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/20',
        dotColor: 'bg-orange-500',
        icon: AlertTriangle,
      };
    }
    if (isLowStock) {
      return {
        label: `${stock} in stock`,
        sublabel: 'Low stock - order soon',
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/20',
        dotColor: 'bg-amber-500',
        icon: Zap,
      };
    }
    return {
      label: `${stock} in stock`,
      sublabel: 'In Stock & Ready to Ship',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      dotColor: 'bg-emerald-500',
      icon: CheckCircle,
    };
  }, [stock, isOutOfStock, isLowStock, isVeryLowStock]);

  const handleAddToCart = () => {
    startTransition(async () => {
      const result = await addItemToCartAction(
        product.id,
        quantity,
        selectedOptions,
      );

      if (result.success) {
        toast.success(result.message ?? 'Added to cart');
      } else {
        toast.error(result.message ?? 'Failed to add to cart');
      }
    });
  };

  const handleToggleWishlist = () => {
    startTransition(async () => {
      const result = await toggleWishlistAction(product.id);

      if (!result.success) {
        toast.error(result.error ?? 'Wishlist update failed');
        return;
      }

      // ✅ derive wished state from server response
      const wished = result.wishlist.includes(product.id);
      setIsWished(wished);

      toast.success(wished ? 'Added to wishlist' : 'Removed from wishlist');
    });
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  const totalPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price * quantity);

  const StockIcon = stockStatus.icon;

  return (
    <div className='glass-card p-6 sm:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700'>
      {/* Header - Brand & SKU */}
      <div className='flex items-center justify-between gap-4 flex-wrap'>
        <span className='text-sm font-semibold uppercase tracking-wider text-primary'>
          {product.brand}
        </span>
        {product.sku && (
          <span className='text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded'>
            SKU: {product.sku}
          </span>
        )}
      </div>

      {/* Title */}
      <div className='space-y-3'>
        <h1 className='text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight'>
          {product.title}
        </h1>

        {/* Price Section */}
        <div className='flex items-baseline gap-4 flex-wrap'>
          <p className='text-3xl sm:text-4xl lg:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-violet-500 to-primary'>
            {formattedPrice}
          </p>
          {product.discount && product.discount > 0 && (
            <div className='flex items-center gap-2'>
              <span className='text-lg sm:text-xl text-muted-foreground line-through font-medium'>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price / (1 - product.discount/100))}
              </span>
              <span className='px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400 text-sm font-bold border border-rose-500/20 shadow-sm flex items-center gap-1'>
                <Tag className='h-3.5 w-3.5' />
                {product.discount}% OFF
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stock Status Badge */}
      <div className={cn(
        'flex items-center gap-3 p-3 rounded-xl border transition-all',
        stockStatus.bgColor,
        stockStatus.borderColor
      )}>
        <div className={cn(
          'h-10 w-10 rounded-full flex items-center justify-center',
          stockStatus.bgColor
        )}>
          <StockIcon className={cn('h-5 w-5', stockStatus.color)} />
        </div>
        <div className='flex-1'>
          <p className={cn('font-bold', stockStatus.color)}>
            {stockStatus.label}
          </p>
          <p className='text-xs text-muted-foreground'>
            {stockStatus.sublabel}
          </p>
        </div>
        {!isOutOfStock && (
          <div className={cn(
            'h-3 w-3 rounded-full animate-pulse',
            stockStatus.dotColor
          )}
          style={{ boxShadow: `0 0 10px currentColor` }}
          />
        )}
      </div>

      {/* Description */}
      <p className='text-base text-muted-foreground leading-relaxed'>
        {product.description}
      </p>

      <Separator className='bg-border/60' />

      {/* Options */}
      {Array.isArray(product.options) && product.options.length > 0 && (
        <div className='space-y-5'>
          {product.options.map((option) => (
            <div key={option.name} className='space-y-3'>
              <div className='flex justify-between items-center'>
                <Label className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
                  {option.name}
                </Label>
                <span className='text-sm font-medium text-foreground px-2 py-0.5 bg-muted rounded'>
                  {selectedOptions[option.name]}
                </span>
              </div>
              <Select
                value={selectedOptions[option.name]}
                onValueChange={(value) => onOptionChange(option.name, value)}
              >
                <SelectTrigger className='h-12 w-full rounded-xl border-border/60 bg-secondary/30 hover:bg-secondary/50 transition-colors focus:ring-2 focus:ring-primary/20 font-medium'>
                  <SelectValue placeholder={`Select ${option.name}`} />
                </SelectTrigger>
                <SelectContent className='rounded-xl border-border/60 backdrop-blur-xl'>
                  {option.variants.map((variant) => (
                    <SelectItem 
                      key={variant.value} 
                      value={variant.value}
                      className='focus:bg-primary/10 py-3 cursor-pointer'
                    >
                      {variant.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          <Separator className='bg-border/60' />
        </div>
      )}

      {/* Quantity & Actions */}
      <div className='space-y-4'>
        <div className='flex flex-col sm:flex-row gap-4'>
          {/* Quantity Stepper */}
          <div className='flex items-center justify-between border border-border/60 bg-secondary/30 rounded-full h-14 px-1 shrink-0 min-w-[160px]'>
            <Button
              variant='ghost'
              size='icon'
              className='h-11 w-11 rounded-full hover:bg-background shadow-sm transition-all'
              disabled={quantity <= 1 || isPending || isOutOfStock}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Minus className='h-4 w-4' />
            </Button>
            <div className='text-center'>
              <span className='text-xl font-bold tabular-nums block'>{quantity}</span>
              <span className='text-[10px] text-muted-foreground'>QTY</span>
            </div>
            <Button
              variant='ghost'
              size='icon'
              className='h-11 w-11 rounded-full hover:bg-background shadow-sm transition-all'
              disabled={quantity >= stock || isPending || isOutOfStock}
              onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            >
              <Plus className='h-4 w-4' />
            </Button>
          </div>
           
          <Button
            size='icon'
            variant='outline'
            onClick={handleToggleWishlist}
            disabled={isPending}
            className={cn(
              'h-14 w-14 rounded-full border transition-all shrink-0',
              isWished 
                ? 'bg-red-50 border-red-200 hover:bg-red-100 dark:bg-red-950/50 dark:border-red-800 dark:hover:bg-red-900/50' 
                : 'border-border/60 hover:bg-secondary/50 hover:border-primary/30'
            )}
            title={isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart
              className={cn('h-6 w-6 transition-all duration-300', {
                'fill-red-500 text-red-500 scale-110': isWished,
                'text-muted-foreground': !isWished
              })}
            />
          </Button>
        </div>

        {/* Add to Cart Button */}
        <Button
          size='lg'
          onClick={handleAddToCart}
          disabled={isPending || isOutOfStock}
          className={cn(
            'w-full h-16 text-lg font-bold rounded-2xl shadow-xl transition-all',
            isOutOfStock 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : 'btn-premium btn-glow shadow-primary/25 hover:shadow-primary/40'
          )}
        >
          {isPending ? (
            <>
              <div className='h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white mr-3' />
              Adding to Cart...
            </>
          ) : isOutOfStock ? (
            <>
              <XCircle className='mr-3 h-5 w-5' />
              Out of Stock
            </>
          ) : (
            <>
              <ShoppingCart className='mr-3 h-5 w-5' />
              Add to Cart — {totalPrice}
            </>
          )}
        </Button>
      </div>

      {/* Trust Badges */}
      {!isOutOfStock && (
        <div className='grid grid-cols-3 gap-3 pt-2'>
          <div className='flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 text-center'>
            <Truck className='h-5 w-5 text-primary' />
            <span className='text-[10px] font-medium text-muted-foreground leading-tight'>Free Shipping</span>
          </div>
          <div className='flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 text-center'>
            <RefreshCw className='h-5 w-5 text-primary' />
            <span className='text-[10px] font-medium text-muted-foreground leading-tight'>30-Day Returns</span>
          </div>
          <div className='flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 text-center'>
            <Shield className='h-5 w-5 text-primary' />
            <span className='text-[10px] font-medium text-muted-foreground leading-tight'>Secure Checkout</span>
          </div>
        </div>
      )}

      {/* Additional Product Info */}
      {(product.category || product.barcode || product.weight) && (
        <>
          <Separator className='bg-border/60' />
          <div className='space-y-2 text-sm'>
            {product.category && (
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Category</span>
                <span className='font-medium'>{product.category}</span>
              </div>
            )}
            {product.subCategory && (
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Subcategory</span>
                <span className='font-medium'>{product.subCategory}</span>
              </div>
            )}
            {product.barcode && (
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Barcode</span>
                <span className='font-mono text-xs'>{product.barcode}</span>
              </div>
            )}
            {product.weight && (
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Weight</span>
                <span className='font-medium'>{product.weight} kg</span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className='flex flex-wrap gap-2 pt-2'>
          {product.tags.map((tag) => (
            <span 
              key={tag} 
              className='text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20'
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
