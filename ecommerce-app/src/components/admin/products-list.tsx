
'use client';

import { useState, useTransition } from 'react';
import { Product } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ProductImage } from './product-image';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
import { DeleteProductButton } from './delete-product-button';
import { deleteMultipleProductsAction } from '@/actions/product-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ProductsListProps {
  products: Product[];
}

export function ProductsList({ products }: ProductsListProps) {
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

  const isAllSelected = selectedIds.length > 0 && selectedIds.length === products.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < products.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
            aria-label="Select all"
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            Select All
          </label>
        </div>

        {selectedIds.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
            disabled={isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected ({selectedIds.length})
          </Button>
        )}
      </div>

      {products.map((product) => (
        <div
          key={product.id}
          className="flex items-center gap-4 p-4 border dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <Checkbox
            checked={selectedIds.includes(product.id)}
            onCheckedChange={(checked) => handleSelectRow(product.id, !!checked)}
            aria-label={`Select product ${product.title}`}
          />

          <ProductImage
            src={product.thumbnail || product.images?.[0] || ''}
            alt={product.title}
            className="h-16 w-16 object-cover rounded border dark:border-slate-700"
          />

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold dark:text-white truncate">{product.title}</h3>
            <div className="flex items-center gap-4 mt-1 text-sm text-slate-600 dark:text-slate-400">
              <span>${product?.price?.toFixed(2)}</span>
              <span>•</span>
              <span>Stock: {product.stock}</span>
              <span>•</span>
              <span>{product.brand}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/products/${product.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <DeleteProductButton productId={product.id} productTitle={product.title} />
          </div>
        </div>
      ))}
    </div>
  );
}
