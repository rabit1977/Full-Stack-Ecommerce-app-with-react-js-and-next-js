import { auth } from '@/auth';
import { BulkDiscountModal } from '@/components/admin/bulk-discount-modal';
import { ProductsClient } from '@/components/admin/products-client';
import { Button } from '@/components/ui/button';
import { PaginationControls } from '@/components/ui/pagination';
import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/db';
import { Package, PlusCircle } from 'lucide-react';
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
  if (!session?.user || session.user.role !== 'ADMIN') {
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
  const products = rawProducts.map((product) => ({
    ...product,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: product.options as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    specifications: product.specifications as any,
  }));

  const totalPages = Math.ceil(totalCount / limit);

  const stats = {
    total: totalCount,
    categories: categories.length,
    brands: brands.length,
    lowStock: products.filter((p) => p.stock < 10).length,
  };

  // // --- SERVER ACTIONS ---

  async function deleteProductAction(id: string) {
    'use server';
    await requireAdmin();
    try {
      await prisma.product.delete({ where: { id } });
      revalidatePath('/admin/products');
      return { success: true, message: 'Product deleted' };
    } catch {
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
    } catch {
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
      const where: Prisma.ProductWhereInput = {};
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
    } catch {
      return { success: false, error: 'Failed to apply discount' };
    }
  }

  return (
    <div className='space-y-8 pb-20'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500'>
        <div className='space-y-1'>
          <h1 className='text-3xl sm:text-4xl font-black tracking-tight text-foreground flex items-center gap-3'>
            Products
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-inset ring-primary/20">
               {stats.total}
            </span>
          </h1>
          <p className='text-lg text-muted-foreground font-medium'>
            Manage your product inventory and catalog
          </p>
        </div>
        <div className='flex gap-3'>
          <BulkDiscountModal
            categories={categories.map((c) => c.category)}
            brands={brands.map((b) => b.brand)}
            applyBulkDiscountAction={applyBulkDiscountAction}
          />
          <Button asChild size="lg" className="rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all btn-premium">
            <Link href='/admin/products/new'>
              <PlusCircle className='h-5 w-5 mr-2' />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100'>
        {[
            { label: 'Total Products', value: stats.total, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
            { label: 'Active Categories', value: stats.categories, icon: Package, color: 'text-violet-500', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
            { label: 'Brands', value: stats.brands, icon: Package, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
            { label: 'Low Stock', value: stats.lowStock, icon: Package, color: stats.lowStock > 0 ? 'text-orange-500' : 'text-emerald-500', bg: stats.lowStock > 0 ? 'bg-orange-500/10' : 'bg-emerald-500/10', border: stats.lowStock > 0 ? 'border-orange-500/20' : 'border-emerald-500/20' },
        ].map((stat, i) => (
             <div key={i} className={`glass-card p-6 rounded-3xl flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group border ${stat.border}`}>
                <div className='flex justify-between items-start mb-2'>
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} ring-1 ring-inset ring-white/10 group-hover:scale-110 transition-transform`}>
                       <stat.icon className='h-6 w-6' />
                    </div>
                </div>
                <div>
                   <h3 className='text-3xl font-black mt-2 tracking-tight text-foreground'>{stat.value}</h3>
                   <p className='text-sm font-bold text-muted-foreground uppercase tracking-wider mt-1'>{stat.label}</p>
                </div>
             </div>
        ))}
      </div>

      {/* Products List */}
      <div className='glass-card rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5 border border-border/60 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200'>
        <div className='p-8'> 
           {products.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-20 text-center space-y-6'>
              <div className='w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center animate-bounce duration-[3s]'>
                  <Package className='h-12 w-12 text-muted-foreground/50' />
              </div>
              <div className="space-y-2">
                 <h3 className='text-2xl font-black text-foreground'>
                    No products found
                 </h3>
                 <p className='text-muted-foreground max-w-sm mx-auto'>
                    Get started by adding your first product to the catalog.
                 </p>
              </div>
              <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">
                <Link href='/admin/products/new'>
                  <PlusCircle className='h-5 w-5 mr-2' />
                  Create First Product
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

           {products.length > 0 && (
             <div className="mt-8">
                <PaginationControls
                  currentPage={page}
                  totalPages={totalPages}
                  hasNextPage={page < totalPages}
                  hasPreviousPage={page > 1}
                />
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
