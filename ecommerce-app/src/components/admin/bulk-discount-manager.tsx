'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export function BulkDiscountManager() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [discountType, setDiscountType] = useState<
    'all' | 'category' | 'brand'
  >('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');

  const handleApplyDiscount = () => {
    const discountValue = parseFloat(discountPercentage);

    // Allow 0 to remove discounts
    if (
      discountPercentage === '' ||
      isNaN(discountValue) ||
      discountValue < 0
    ) {
      toast.error('Please enter a valid discount (0-100)');
      return;
    }

    if (discountType === 'category' && !selectedCategory) {
      toast.error('Please select a category');
      return;
    }

    if (discountType === 'brand' && !selectedBrand) {
      toast.error('Please select a brand');
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/admin/products/bulk-discount', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            discountType,
            category: selectedCategory,
            brand: selectedBrand,
            discount: discountValue,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to apply discount');
        }

        // Success toast
        toast.success(`✅ ${data.message}`, {
          description: `Updated ${data.count} products in the database`,
          duration: 4000,
        });

        // Reset form after success
        setDiscountPercentage('');
        setSelectedCategory('');
        setSelectedBrand('');
        setDiscountType('all');

        // Force refresh to show updated discounts
        router.push('/products');
        router.refresh();
      } catch (error) {
        console.error('Discount error:', error);
        toast.error('❌ Failed to apply discount', {
          description:
            error instanceof Error ? error.message : 'Please try again',
          duration: 4000,
        });
      }
    });
  };

  const handleReset = () => {
    setDiscountPercentage('');
    setSelectedCategory('');
    setSelectedBrand('');
    setDiscountType('all');
    toast.info('Form reset');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Discount Manager</CardTitle>
        <CardDescription>
          Apply discounts to multiple products. Enter 0 to remove discounts.
          Changes are saved to the database.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Discount Type */}
        <div className='space-y-2'>
          <Label>Apply discount to</Label>
          <Select
            value={discountType}
            onValueChange={(value: any) => {
              setDiscountType(value);
              // Clear selections when changing type
              setSelectedCategory('');
              setSelectedBrand('');
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Products</SelectItem>
              <SelectItem value='category'>Specific Category</SelectItem>
              <SelectItem value='brand'>Specific Brand</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Selection */}
        {discountType === 'category' && (
          <div className='space-y-2'>
            <Label>Select Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder='Choose category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Laptops'>Laptops</SelectItem>
                <SelectItem value='Smartphones'>Smartphones</SelectItem>
                <SelectItem value='Tablets'>Tablets</SelectItem>
                <SelectItem value='Cameras'>Cameras</SelectItem>
                <SelectItem value='Headphones'>Headphones</SelectItem>
                <SelectItem value='Monitors'>Monitors</SelectItem>
                <SelectItem value='TVs'>TVs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Brand Selection */}
        {discountType === 'brand' && (
          <div className='space-y-2'>
            <Label>Select Brand</Label>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger>
                <SelectValue placeholder='Choose brand' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Apple'>Apple</SelectItem>
                <SelectItem value='Samsung'>Samsung</SelectItem>
                <SelectItem value='Dell'>Dell</SelectItem>
                <SelectItem value='Sony'>Sony</SelectItem>
                <SelectItem value='LG'>LG</SelectItem>
                <SelectItem value='HP'>HP</SelectItem>
                <SelectItem value='Lenovo'>Lenovo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Discount Percentage */}
        <div className='space-y-2'>
          <Label>Discount Percentage (%)</Label>
          <Input
            type='number'
            min='0'
            max='100'
            step='1'
            placeholder='e.g., 20 (or 0 to remove)'
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
          />
          <p className='text-xs text-slate-500'>
            Enter 0 to remove all discounts • Enter 1-100 to apply discount
          </p>
        </div>

        {/* Preview */}
        {discountPercentage !== '' && (
          <div
            className={`p-4 rounded-lg border ${
              parseFloat(discountPercentage) === 0
                ? 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800'
                : 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
            }`}
          >
            <p
              className={`text-sm font-medium ${
                parseFloat(discountPercentage) === 0
                  ? 'text-orange-800 dark:text-orange-200'
                  : 'text-blue-800 dark:text-blue-200'
              }`}
            >
              <strong>Preview:</strong>{' '}
              {parseFloat(discountPercentage) === 0 ? (
                <>Remove all discounts from </>
              ) : (
                <>{discountPercentage}% discount will be applied to </>
              )}
              {discountType === 'all'
                ? 'all products'
                : discountType === 'category'
                  ? `all products in "${selectedCategory}"`
                  : `all "${selectedBrand}" products`}
            </p>
            <p
              className={`text-xs mt-1 ${
                parseFloat(discountPercentage) === 0
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-blue-600 dark:text-blue-400'
              }`}
            >
              This will update the database and refresh the page
            </p>
          </div>
        )}

        {/* Actions */}
        <div className='flex gap-3'>
          <Button
            onClick={handleApplyDiscount}
            disabled={isPending}
            className='flex-1'
            variant={
              parseFloat(discountPercentage) === 0 ? 'destructive' : 'default'
            }
          >
            {isPending
              ? 'Updating Database...'
              : parseFloat(discountPercentage) === 0
                ? 'Remove Discounts'
                : 'Apply Discount'}
          </Button>
          <Button variant='outline' onClick={handleReset} disabled={isPending}>
            Reset Form
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
