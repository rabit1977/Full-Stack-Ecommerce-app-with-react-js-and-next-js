'use client';

import { deleteProductAction } from '@/actions/product-actions';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface DeleteProductButtonProps {
  productId: string;
  productTitle: string;
}

export function DeleteProductButton({ productId, productTitle }: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete "${productTitle}"?`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteProductAction(productId);
      
      if (result.success) {
        toast.success(result.message || 'Product deleted successfully');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete product');
      }
    });
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
