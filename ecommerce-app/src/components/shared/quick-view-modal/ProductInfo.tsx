import { Badge } from '@/components/ui/badge';
import { Stars } from '@/components/ui/stars';
import { ProductInfoProps } from '@/lib/types/quickview';
import { formatPrice } from '@/lib/utils/formatters';
import { Package, Shield, Truck } from 'lucide-react';

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className='space-y-1'>
      {/* Title and Brand */}
      <div className='flex justify-between  md:flex-row md:items-center mt-8 gap-2'>
        <h2 className='text-xl md:text-2xl font-bold text-foreground'>
          {product.title}
        </h2>
        {product.brand && (
          <p className='text-sm text-muted-foreground bg-accent rounded-full px-2 py-1'>
            brand * {product.brand}
          </p>
        )}
      </div>

      {/* Rating */}
      <div className='flex items-center gap-2'>
        <Stars value={product.rating} />
        <span className='text-xs md:text-sm text-muted-foreground'>
          {product.rating} ({product.reviewCount} reviews)
        </span>
      </div>

      {/* Price */}
      <div className='flex items-center gap-3'>
        <p className='text-xl md:text-3xl font-bold text-foreground'>
          {formatPrice(product.price)}
        </p>
        {product.discount && product.discount > 0 && (
          <div className='flex items-center gap-2'>
            <p className='text-sm md:text-base text-muted-foreground line-through'>
              {formatPrice(product.price / (1 - product.discount / 100))}
            </p>
            <Badge variant='destructive'>{product.discount}% OFF</Badge>
          </div>
        )}
      </div>

      {/* Stock Status */}
      <div>
        {isOutOfStock ? (
          <Badge variant='destructive' className=' text-xs md:text-sm'>
            Out of Stock
          </Badge>
        ) : isLowStock ? (
          <Badge variant='secondary' className='text-xs md:text-sm'>
            Only {product.stock} left in stock
          </Badge>
        ) : (
          <Badge variant='outline' className='text-xs md:text-sm'>
            In Stock ({product.stock} available)
          </Badge>
        )}
      </div>

      {/* Description */}
      <p className='text-sm md:text-base text-muted-foreground leading-relaxed'>
        {product.description}
      </p>

      {/* Features/Benefits */}
      <div className='grid grid-cols-1 gap-2 pt-2'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Truck className='h-4 w-4' />
          <span>Free shipping on orders over $50</span>
        </div>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Shield className='h-4 w-4' />
          <span>1 year warranty included</span>
        </div>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Package className='h-4 w-4' />
          <span>Easy 30-day returns</span>
        </div>
      </div>
    </div>
  );
};
