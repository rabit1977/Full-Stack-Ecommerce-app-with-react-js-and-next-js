'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BulkDiscountManager } from './bulk-discount-manager';
import { Tag } from 'lucide-react';

interface BulkDiscountModalProps {
  categories: string[];
  brands: string[];
  applyBulkDiscountAction: (data: {
    discountType: 'all' | 'category' | 'brand';
    category?: string;
    brand?: string;
    discount: number;
  }) => Promise<{ success: boolean; error?: string; message?: string; count?: number }>;
}

export function BulkDiscountModal({
  categories,
  brands,
  applyBulkDiscountAction,
}: BulkDiscountModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <Tag className='h-4 w-4 mr-2' />
          Bulk Discounts
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Discount Manager</DialogTitle>
          <DialogDescription>
            Apply discounts to multiple products at once.
          </DialogDescription>
        </DialogHeader>
        <BulkDiscountManager
          categories={categories}
          brands={brands}
          applyBulkDiscountAction={applyBulkDiscountAction}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
