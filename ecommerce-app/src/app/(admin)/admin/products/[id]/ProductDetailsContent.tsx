// app/admin/products/[id]/ProductDetailsContent.tsx
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getProductById } from '@/lib/data/get-products';
import { formatPrice } from '@/lib/utils/formatters';
import { staggerContainer, staggerItem } from '@/lib/constants/animations';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  Edit, 
  Package, 
  DollarSign, 
  Star,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { use } from 'react';

interface ProductDetailsContentProps {
  productPromise: ReturnType<typeof getProductById>;
}

export function ProductDetailsContent({ productPromise }: ProductDetailsContentProps) {
  const product = use(productPromise);

  if (!product) {
    notFound();
  }

  const stockStatus = product.stock === 0 
    ? { label: 'Out of Stock', color: 'text-red-600 dark:text-red-400' }
    : product.stock < 10
    ? { label: 'Low Stock', color: 'text-orange-600 dark:text-orange-400' }
    : { label: 'In Stock', color: 'text-green-600 dark:text-green-400' };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href="/admin/products">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold dark:text-white">
              Product Details
            </h1>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/products/${product.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Product
          </Link>
        </Button>
      </motion.div>

      <motion.div variants={staggerItem} className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{product.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {product.brand} • {product.category}
                  </CardDescription>
                </div>
                <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                  {stockStatus.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Image and Basic Info */}
              <div className="flex flex-col md:flex-row gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="w-full md:w-64 h-64 relative rounded-lg overflow-hidden border dark:border-slate-700"
                >
                  <Image
                    alt={product.title}
                    src={product.images?.[0] || '/images/placeholder.jpg'}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Product ID
                      </p>
                      <p className="text-sm font-mono mt-1 dark:text-white">
                        {product.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        SKU
                      </p>
                      <p className="text-sm font-mono mt-1 dark:text-white">
                        {product.sku || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Price
                      </p>
                      <p className="text-lg font-bold mt-1 dark:text-white">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Stock
                      </p>
                      <p className={`text-lg font-bold mt-1 ${stockStatus.color}`}>
                        {product.stock}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold dark:text-white">
                        {product.rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        ({product.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="font-semibold text-lg mb-2 dark:text-white">
                  Description
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Additional Images */}
              {product.images && product.images.length > 1 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-4 dark:text-white">
                      Product Images
                    </h3>
                    <div className="grid grid-cols-4 gap-4">
                      {product.images.map((image, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                          className="aspect-square relative rounded-lg overflow-hidden border dark:border-slate-700 cursor-pointer"
                        >
                          <Image
                            src={image}
                            alt={`${product.title} - ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Price
                  </span>
                </div>
                <span className="font-semibold dark:text-white">
                  {formatPrice(product.price)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Stock
                  </span>
                </div>
                <span className={`font-semibold ${stockStatus.color}`}>
                  {product.stock}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Rating
                  </span>
                </div>
                <span className="font-semibold dark:text-white">
                  {product.rating} / 5
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Stock Alert */}
          {product.stock < 10 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-orange-200 dark:border-orange-900">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-orange-600 dark:text-orange-400">
                    <AlertCircle className="h-5 w-5" />
                    Stock Alert
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {product.stock === 0
                      ? 'This product is out of stock. Consider restocking soon.'
                      : `Only ${product.stock} units left in stock. Consider restocking.`}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Category & Brand */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Classification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Category
                </p>
                <Badge variant="outline">{product.category}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Brand
                </p>
                <Badge variant="outline">{product.brand}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}