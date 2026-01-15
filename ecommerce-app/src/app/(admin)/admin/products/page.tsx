import { auth } from '@/auth';
import { BulkDiscountManager } from '@/components/admin/bulk-discount-manager';
import { ProductsClient } from '@/components/admin/products-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PaginationControls } from '@/components/ui/pagination';
import { prisma } from '@/lib/db';
import { Package, PlusCircle, Tag } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { redirect } from 'next/navigation';

// 1. Update interface to use Promise for searchParams
interface AdminProductsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

// Helper to check admin access
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    // Better to redirect than throw error for UX
    redirect('/'); 
  }
}

export default async function AdminProductsPage(props: AdminProductsPageProps) {
  await requireAdmin();

  // 2. Await the searchParams before accessing properties
  const searchParams = await props.searchParams;
  
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 12;
  const skip = (page - 1) * limit;

  // --- DATA FETCHING ---
  const [rawProducts, totalCount, categories, brands] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.product.count(),
    prisma.product.findMany({
      distinct: ['category'],
      select: { category: true },
    }),
    prisma.product.findMany({ distinct: ['brand'], select: { brand: true } }),
  ]);

  // 3. Convert Dates to Strings for Client Component
  // Client components often expect JSON-serializable data (strings), not Date objects
  const products = rawProducts.map(product => ({
    ...product,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    // Ensure JSON fields are typed correctly if needed
    options: product.options as any, 
    specifications: product.specifications as any
  }));

  const totalPages = Math.ceil(totalCount / limit);

  const stats = {
    total: totalCount,
    categories: categories.length,
    brands: brands.length,
    lowStock: products.filter((p) => p.stock < 10).length,
  };

  // --- SERVER ACTIONS ---

  async function deleteProductAction(id: string) {
    'use server';
    await requireAdmin();
    try {
      await prisma.product.delete({ where: { id } });
      revalidatePath('/admin/products');
      return { success: true, message: 'Product deleted' };
    } catch (error) {
      return { success: false, error: 'Failed to delete product' };
    }
  }

  async function deleteMultipleProductsAction(ids: string[]) {
    'use server';
    await requireAdmin();
    try {
      await prisma.product.deleteMany({ where: { id: { in: ids } } });
      revalidatePath('/admin/products');
      return { success: true, message: `${ids.length} products deleted` };
    } catch (error) {
      return { success: false, error: 'Failed to delete products' };
    }
  }

  async function applyBulkDiscountAction(data: {
    discountType: 'all' | 'category' | 'brand';
    category?: string;
    brand?: string;
    discount: number;
  }) {
    'use server';
    await requireAdmin();
    try {
      const where: any = {};
      if (data.discountType === 'category') where.category = data.category;
      if (data.discountType === 'brand') where.brand = data.brand;

      const result = await prisma.product.updateMany({
        where,
        data: { discount: data.discount },
      });
      revalidatePath('/admin/products');
      return {
        success: true,
        message: 'Discount applied',
        count: result.count,
      };
    } catch (error) {
      return { success: false, error: 'Failed to apply discount' };
    }
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <Package className='h-6 w-6 text-slate-600 dark:text-slate-400' />
            <h1 className='text-3xl font-bold tracking-tight dark:text-white'>
              Products
            </h1>
          </div>
          <p className='text-slate-600 dark:text-slate-400'>
            Manage your product catalog and inventory
          </p>
        </div>
        <div className='flex gap-2'>
          <Dialog>
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
                categories={categories.map((c) => c.category)}
                brands={brands.map((b) => b.brand)}
                applyBulkDiscountAction={applyBulkDiscountAction}
              />
            </DialogContent>
          </Dialog>
          <Button asChild>
            <Link href='/admin/products/new'>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-center'>
              <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                Total Products
              </p>
              <p className='text-3xl font-bold dark:text-white mt-2'>
                {stats.total}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-center'>
              <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                Categories
              </p>
              <p className='text-3xl font-bold dark:text-white mt-2'>
                {stats.categories}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-center'>
              <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                Brands
              </p>
              <p className='text-3xl font-bold dark:text-white mt-2'>
                {stats.brands}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-center'>
              <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                Low Stock
              </p>
              <p className='text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2'>
                {stats.lowStock}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <Card>
        <CardContent className='pt-6'>
          {products.length === 0 ? (
            <div className='text-center py-12'>
              <Package className='h-12 w-12 mx-auto text-slate-400 mb-4' />
              <h3 className='text-lg font-semibold dark:text-white mb-2'>
                No products yet
              </h3>
              <p className='text-slate-600 dark:text-slate-400 mb-4'>
                Get started by creating your first product
              </p>
              <Button asChild>
                <Link href='/admin/products/new'>
                  <PlusCircle className='h-4 w-4 mr-2' />
                  Add Product
                </Link>
              </Button>
            </div>
          ) : (
            <ProductsClient
              products={products}
              deleteProductAction={deleteProductAction}
              deleteMultipleProductsAction={deleteMultipleProductsAction}
            />
          )}
        </CardContent>
      </Card>
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        hasNextPage={page < totalPages}
        hasPreviousPage={page > 1}
      />
    </div>
  );
}