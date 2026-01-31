import { auth } from '@/auth';
import { AdminProductFilters } from '@/components/admin/admin-product-filters';
import { BulkDiscountModal } from '@/components/admin/bulk-discount-modal';
import { ProductsClient } from '@/components/admin/products-client';
import { Button } from '@/components/ui/button';
import { PaginationControls } from '@/components/ui/pagination';
import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/db';
import { AlertTriangle, Layers, Package, PlusCircle, Tag } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface AdminProductsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    category?: string;
    brand?: string;
    stock?: string;
    q?: string;
  }>;
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }
}

export default async function AdminProductsPage(props: AdminProductsPageProps) {
  await requireAdmin();

  const searchParams = await props.searchParams;

  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 12;
  const skip = (page - 1) * limit;

  const { category, brand, stock, q } = searchParams;

  // Build dynamic where clause
  const where: Prisma.ProductWhereInput = {};

  if (category && category !== 'all') {
    where.category = category;
  }

  if (brand && brand !== 'all') {
    where.brand = brand;
  }

  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { category: { contains: q, mode: 'insensitive' } },
      { brand: { contains: q, mode: 'insensitive' } },
    ];
  }

  if (stock && stock !== 'all') {
    if (stock === 'out') {
      where.stock = 0;
    } else if (stock === 'low') {
      where.stock = { gt: 0, lt: 10 };
    } else if (stock === 'in') {
      where.stock = { gte: 10 };
    }
  }

  const [rawProducts, totalCount, categoriesRaw, brandsRaw] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.product.findMany({
      distinct: ['category'],
      select: { category: true },
      where: { category: { not: "" } }
    }),
    prisma.product.findMany({ 
      distinct: ['brand'], 
      select: { brand: true },
      where: { brand: { not: "" } }
    }),
  ]);

  const categories = categoriesRaw.map(c => c.category).filter(Boolean) as string[];
  const brands = brandsRaw.map(b => b.brand).filter(Boolean) as string[];

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

  const statItems = [
    { 
      label: 'Products', 
      value: stats.total, 
      icon: Package, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10', 
      border: 'border-blue-500/20' 
    },
    { 
      label: 'Categories', 
      value: stats.categories, 
      icon: Layers, 
      color: 'text-violet-500', 
      bg: 'bg-violet-500/10', 
      border: 'border-violet-500/20' 
    },
    { 
      label: 'Brands', 
      value: stats.brands, 
      icon: Tag, 
      color: 'text-pink-500', 
      bg: 'bg-pink-500/10', 
      border: 'border-pink-500/20' 
    },
    { 
      label: 'Low Stock', 
      value: stats.lowStock, 
      icon: AlertTriangle, 
      color: stats.lowStock > 0 ? 'text-orange-500' : 'text-emerald-500', 
      bg: stats.lowStock > 0 ? 'bg-orange-500/10' : 'bg-emerald-500/10', 
      border: stats.lowStock > 0 ? 'border-orange-500/20' : 'border-emerald-500/20' 
    },
  ];

  return (
    <div className='space-y-6 sm:space-y-8 pb-20'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground flex items-center gap-2 sm:gap-3 flex-wrap'>
            Products
            <span className='inline-flex items-center justify-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-inset ring-primary/20'>
              {stats.total}
            </span>
          </h1>
          <p className='text-sm sm:text-lg text-muted-foreground font-medium'>
            Manage your product catalog
          </p>
        </div>
        
        {/* Action Buttons - Stack on mobile */}
        <div className='flex  gap-2 sm:gap-3'>
          <BulkDiscountModal
            categories={categories}
            brands={brands}
            applyBulkDiscountAction={applyBulkDiscountAction}
          />
          <Button 
            asChild 
            size='default'
            className='w-full sm:w-auto rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all btn-premium flex-1'
          >
            <Link href='/admin/products/new'>
              <PlusCircle className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <AdminProductFilters categories={categories} brands={brands} />

      {/* Stats Grid - 2 columns on mobile, 4 on desktop */}
      <div className='grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5'>
        {statItems.map((stat, i) => (
          <div 
            key={i} 
            className={`glass-card  p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex items-center justify-between hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group border gap-2 flex-row-reverse ${stat.border}`}
          >
            <div className='flex justify-between items-start mb-2'>
              <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${stat.bg} ${stat.color} ring-1 ring-inset ring-white/10 group-hover:scale-110 transition-transform`}>
                <stat.icon className='h-4 w-4 sm:h-6 sm:w-6' />
              </div>
            </div>
            <div className='flex flex-col items-start min-w-24'>
              <h3 className='text-xl sm:text-3xl font-black tracking-tight  text-foreground'>
                {stat.value}
              </h3>
              <p className='text-[10px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wider mt-0.5 sm:mt-1'>
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Products List */}
      <div className='glass-card rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5 border border-border/60'>
        <div className='p-4 sm:p-6 lg:p-8'> 
          {products.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 sm:py-20 text-center space-y-4 sm:space-y-6'>
              <div className='w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-secondary/50 flex items-center justify-center'>
                <Package className='h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground/50' />
              </div>
              <div className='space-y-2'>
                <h3 className='text-xl sm:text-2xl font-black text-foreground'>
                  No products found
                </h3>
                <p className='text-sm sm:text-base text-muted-foreground max-w-sm mx-auto'>
                  Get started by adding your first product to the catalog.
                </p>
              </div>
              <Button asChild size='lg' className='rounded-xl px-6 sm:px-8 shadow-lg shadow-primary/20'>
                <Link href='/admin/products/new'>
                  <PlusCircle className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
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
            <div className='mt-6 sm:mt-8'>
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
