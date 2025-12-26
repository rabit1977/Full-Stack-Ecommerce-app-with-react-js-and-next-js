import { getProductsAction } from '@/actions/product-actions';
import { ProductsList } from '@/components/admin/products-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PaginationControls } from '@/components/ui/pagination';
import { Package, PlusCircle } from 'lucide-react';
import Link from 'next/link';

interface AdminProductsPageProps {
  searchParams?: {
    page?: string;
    limit?: string;
  };
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 12;

  const result = await getProductsAction({ page, limit, sort: 'newest' });
  const products = result.products || [];

  const stats = {
    total: result.totalCount,
    categories: [...new Set(products.map(p => p.category))].length,
    brands: [...new Set(products.map(p => p.brand))].length,
    lowStock: products.filter(p => p.stock < 10).length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            <h1 className="text-3xl font-bold tracking-tight dark:text-white">
              Products
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your product catalog and inventory
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Products
              </p>
              <p className="text-3xl font-bold dark:text-white mt-2">
                {stats.total}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Categories
              </p>
              <p className="text-3xl font-bold dark:text-white mt-2">
                {stats.categories}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Brands
              </p>
              <p className="text-3xl font-bold dark:text-white mt-2">
                {stats.brands}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Low Stock
              </p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                {stats.lowStock}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <Card>
        <CardContent className="pt-6">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold dark:text-white mb-2">
                No products yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Get started by creating your first product
              </p>
              <Button asChild>
                <Link href="/admin/products/new">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Product
                </Link>
              </Button>
            </div>
          ) : (
            <ProductsList products={products} />
          )}
        </CardContent>
      </Card>
      <PaginationControls
        currentPage={result.page}
        totalPages={result.totalPages}
        hasNextPage={result.hasMore}
        hasPreviousPage={result.page > 1}
      />
    </div>
  );
}