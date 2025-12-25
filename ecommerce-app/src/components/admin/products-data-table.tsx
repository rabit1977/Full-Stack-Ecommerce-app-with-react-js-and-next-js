'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteProduct } from '@/lib/actions/product-actions';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils/formatters';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface ProductsDataTableProps {
  products: Product[];
}

export const ProductsDataTable = ({ products }: ProductsDataTableProps) => {
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;

    startTransition(async () => {
      const result = await deleteProduct(productToDelete.id);
      if (result && 'error' in result && result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Product "${productToDelete.title}" deleted.`);
      }
      setShowDeleteDialog(false);
      setProductToDelete(null);
    });
  };

  const columns = [
    {
      header: <span className='sr-only'>Image</span>,
      className: 'hidden w-[100px] sm:table-cell',
      cell: (product: Product) => (
        <Image
          alt={product.title}
          className='aspect-square rounded-md object-cover'
          width={64}
          height={64}
          priority
          src={product.images?.[0] || '/images/placeholder.jpg'}
        />
      ),
    },
    {
      header: 'Name',
      cell: (product: Product) => (
        <span className='font-medium'>{product.title}</span>
      ),
    },
    {
      header: 'Status',
      cell: (product: Product) => (
        <Badge variant={product.stock > 0 ? 'outline' : 'destructive'}>
          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </Badge>
      ),
    },
    {
      header: 'Price',
      className: 'hidden md:table-cell',
      cell: (product: Product) => formatPrice(product.price),
    },
    {
      header: 'Stock',
      className: 'hidden md:table-cell',
      cell: (product: Product) => product.stock,
    },
    {
      header: <span className='sr-only'>Actions</span>,
      cell: (product: Product) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup='true' size='icon' variant='ghost'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${product.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className='text-red-500'
              onSelect={() => handleDeleteClick(product)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={products}
        columns={columns}
        keyExtractor={(product) => product.id}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product
              <span className='font-semibold'> {productToDelete?.title}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

