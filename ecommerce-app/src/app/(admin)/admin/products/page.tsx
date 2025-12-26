import { getProductsAction } from '@/actions/product-actions';
import { DeleteProductButton } from '@/components/admin/delete-product-button';
import { ProductImage } from '@/components/admin/product-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Package, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default async function AdminProductsPage() {
  const result = await getProductsAction({ limit: 1000, sort: 'newest' });
  const products = result.products || [];

  const stats = {
    total: products.length,
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
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 border dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {/* Product Image */}
                  <ProductImage
                    src={product.thumbnail || product.images?.[0] || ''}
                    alt={product.title}
                    className="h-16 w-16 object-cover rounded border dark:border-slate-700"
                  />

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold dark:text-white truncate">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-600 dark:text-slate-400">
                      <span>${product?.price?.toFixed(2)}</span>
                      <span>•</span>
                      <span>Stock: {product.stock}</span>
                      <span>•</span>
                      <span>{product.brand}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteProductButton productId={product.id} productTitle={product.title} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}