import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils/formatters';
import Image from 'next/image';
import Link from 'next/link';

interface SearchResultItemProps {
  product: Product;
  index: number;
  onSelect: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLAnchorElement>, index: number) => void;
}

export const SearchResultItem = ({
  product,
  index,
  onSelect,
  onKeyDown,
}: SearchResultItemProps) => {
  return (
    // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
    <li role='option'>
      <Link
        href={`/products/${product.id}`}
        onClick={onSelect}
        onKeyDown={(e) => onKeyDown(e, index)}
        className='flex items-center gap-3 rounded-md p-2 hover:bg-accent transition-colors focus:bg-accent focus:outline-none'
      >
        <div className='relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden bg-muted'>
          <Image
            src={product.images?.[0] || '/images/placeholder.jpg'}
            alt={product.title}
            fill
            className='object-cover'
            sizes='48px'
          />
        </div>

        <div className='flex-1 min-w-0'>
          <div className='text-sm font-medium truncate'>{product.title}</div>
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            {product.brand && <span>{product.brand}</span>}
            {product.price && (
              <>
                <span>•</span>
                <span className='font-semibold text-foreground'>
                  {formatPrice(product.price)}
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
};
