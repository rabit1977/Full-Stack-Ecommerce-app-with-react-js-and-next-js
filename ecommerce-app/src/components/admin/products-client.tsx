'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Product } from '@/generated/prisma/browser';
import { cn } from '@/lib/utils';
import { Edit, Package, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { DeleteProductButton } from './delete-product-button';
import { ProductImage } from './product-image';

// Serialized type for Client Component
type SerializedProduct = Omit<Product, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

interface ProductsClientProps {
  products: SerializedProduct[];
  deleteProductAction: (
    id: string
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
  deleteMultipleProductsAction: (
    ids: string[]
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
}

export function ProductsClient({
  products,
  deleteProductAction,
  deleteMultipleProductsAction,
}: ProductsClientProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;

    startTransition(async () => {
      const result = await deleteMultipleProductsAction(selectedIds);
      if (result.success) {
        toast.success(result.message);
        setSelectedIds([]);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  const isAllSelected =
    selectedIds.length > 0 && selectedIds.length === products.length;

  return (
    <div className='space-y-4'>
      {/* Header Actions */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-muted/30 rounded-xl border border-border/50'>
        <div className='flex items-center gap-3'>
          <Checkbox
            id='select-all'
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
            aria-label='Select all'
            className='h-5 w-5'
          />
          <label htmlFor='select-all' className='text-sm font-medium cursor-pointer'>
            Select All ({products.length})
          </label>
        </div>

        {selectedIds.length > 0 && (
          <Button
            variant='destructive'
            size='sm'
            onClick={handleDeleteSelected}
            disabled={isPending}
            className='w-full sm:w-auto'
          >
            <Trash2 className='h-4 w-4 mr-2' />
            Delete ({selectedIds.length})
          </Button>
        )}
      </div>

      {/* Products Grid/List */}
      <div className='space-y-2 sm:space-y-3'>
        {products.map((product) => (
          <div
            key={product.id}
            className={cn(
              'group relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4',
              'bg-card border border-border/50 rounded-xl',
              'hover:bg-muted/30 hover:border-primary/20 transition-all duration-200',
              selectedIds.includes(product.id) && 'bg-primary/5 border-primary/30 '
            )}
          >
            {/* Checkbox + Image */}
            <div className='flex items-center justify-between gap-3 sm:gap-4'>

            <div className='flex items-center gap-3 sm:gap-4'>
              <Checkbox
                checked={selectedIds.includes(product.id)}
                onCheckedChange={(checked) =>
                  handleSelectRow(product.id, !!checked)
                }
                aria-label={`Select ${product.title}`}
                className='h-5 w-5 shrink-0'
                />

              <div className='relative'>
                <ProductImage
                  src={
                    product.thumbnail?.trim()
                    ? product.thumbnail
                    : '/images/placeholder.jpg'
                  }
                  alt={product.title}
                  className='h-18 w-18 sm:h-20   sm:w-20 object-cover rounded-lg border border-border/50 shadow-sm'
                  />
                {product.stock === 0 && (
                  <div className='absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center'>
                    <span className='text-[8px] font-bold text-white uppercase'>Out</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className='flex-1 min-w-0 space-y-1'>
              <h3 className='font-semibold text-sm sm:text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors ml-1'>
                {product.title}
              </h3>
              
              {/* Mobile: Stacked info */}
              <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-muted-foreground'>
                <span className='font-bold text-foreground ml-1'>
                  ${product?.price?.toFixed(2)}
                </span>
                <span className='hidden sm:inline'>•</span>
                <span className={cn(
                  'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-medium',
                  product.stock === 0 
                  ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400'
                  : product.stock < 10
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                )}>
                  <Package className='h-3 w-3' />
                  {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
                </span>
                <span className='hidden sm:inline'>•</span>
                <span className='text-[10px] px-2 py-0.5 bg-secondary rounded-full text-muted-foreground'>
                  {product.category}
                </span>
              </div>
            </div>
                  </div>

            {/* Actions */}
            <div className='flex items-center gap-2 mt-2 sm:mt-0 sm:ml-auto'>
              <Button 
                variant='outline' 
                size='sm' 
                asChild 
                className='flex-1 sm:flex-none h-9 sm:h-8 rounded-lg'
              >
                <Link href={`/admin/products/${product.id}/edit`}>
                  <Edit className='h-4 w-4 sm:mr-0 mr-2' />
                  <span className='sm:hidden'>Edit</span>
                </Link>
              </Button>
              <DeleteProductButton
                productId={product.id}
                productTitle={product.title}
                deleteProductAction={deleteProductAction}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <Package className='h-12 w-12 text-muted-foreground/30 mb-3' />
          <p className='text-muted-foreground'>No products found</p>
        </div>
      )}
    </div>
  );
}
