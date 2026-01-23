// import { prisma } from '@/lib/db';
// import { Product, Review, SortKey } from '@/lib/types';
// import { Prisma } from '@/generated/prisma/client';

// /**
//  * Available sort options for products
//  */

// /**
//  * Sort comparator functions
//  */
// const sortOptions: Record<SortKey, Prisma.ProductOrderByWithRelationInput> = {
//   featured: { rating: 'desc' },
//   'price-asc': { price: 'asc' },
//   'price-desc': { price: 'desc' },
//   rating: { rating: 'desc' },
//   newest: { createdAt: 'desc' },
//   popularity: { reviewCount: 'desc' },
// };

// /**
//  * Helper function to map Prisma review to frontend Review type
//  */
// function mapReviewToFrontend(review: any): Review {
//   return {
//     id: review.id,
//     author: review.userId, // Map userId to author
//     rating: review.rating,
//     comment: review.comment,
//     date: review.createdAt.toISOString(), // Convert Date to ISO string
//     helpful: 0, // Default value since not in Prisma model
//     title: review.title || '',
//   };
// }

// /**
//  * Options for fetching products
//  */
// export interface GetProductsOptions {
//   query?: string;
//   categories?: string; // Comma-separated string of categories
//   brands?: string; // Comma-separated string of brands
//   minPrice?: number;
//   maxPrice?: number;
//   minRating?: number;
//   inStock?: boolean;
//   sort?: SortKey;
//   page?: number;
//   limit?: number;
// }

// /**
//  * Result of product fetch operation
//  */
// export interface GetProductsResult {
//   products: Product[];
//   totalCount: number;
//   page: number;
//   totalPages: number;
//   hasMore: boolean;
// }

// /**
//  * Fetch and filter products with pagination from the database
//  * @param options - Filter and pagination options
//  * @returns Filtered and paginated products with metadata
//  */
// export async function getProducts(
//   options: GetProductsOptions = {}
// ): Promise<GetProductsResult> {
//   const {
//     query,
//     categories,
//     brands,
//     minPrice,
//     maxPrice,
//     minRating,
//     inStock,
//     sort = 'featured',
//     page = 1,
//     limit = 8,
//   } = options;

//   const where: Prisma.ProductWhereInput = {};

//   if (query) {
//     where.OR = [
//       { title: { contains: query } },
//       { description: { contains: query } },
//       { brand: { contains: query } },
//       { category: { contains: query } },
//     ];
//   }

//   if (categories) {
//     const selectedCategories = categories
//       .split(',')
//       .map((c) => c.trim())
//       .filter(Boolean);
//     if (selectedCategories.length > 0) {
//       where.category = { in: selectedCategories };
//     }
//   }

//   if (brands) {
//     const selectedBrands = brands
//       .split(',')
//       .map((b) => b.trim())
//       .filter(Boolean);
//     if (selectedBrands.length > 0) {
//       where.brand = { in: selectedBrands };
//     }
//   }

//   if (minPrice !== undefined) {
//     where.price = { ...(where.price as Prisma.FloatFilter), gte: minPrice };
//   }

//   if (maxPrice !== undefined) {
//     where.price = { ...(where.price as Prisma.FloatFilter), lte: maxPrice };
//   }

//   if (minRating !== undefined) {
//     where.rating = { gte: minRating };
//   }

//   if (inStock) {
//     where.stock = { gt: 0 };
//   }

//   const orderBy = sortOptions[sort] || sortOptions.featured;
//   const skip = (page - 1) * limit;

//   const [products, totalCount] = await prisma.$transaction([
//     prisma.product.findMany({
//       where,
//       orderBy,
//       skip,
//       take: limit,
//       include: {
//         images: true, // Include related images
//         reviews: true, // Include related reviews
//       },
//     }),
//     prisma.product.count({ where }),
//   ]);

//   const totalPages = Math.ceil(totalCount / limit);

//   // Adapt Prisma products to frontend Product type
//   const adaptedProducts: Product[] = products.map((product) => ({
//     id: product.id,
//     title: product.title,
//     description: product.description,
//     price: product.price,
//     brand: product.brand,
//     category: product.category,
//     thumbnail: product.thumbnail,
//     images: product.images.map((image) => image.url),
//     rating: product.rating,
//     stock: product.stock,
//     discount: product.discount,
//     reviewCount: product.reviewCount,
//     reviews: product.reviews.map(mapReviewToFrontend),
//     createdAt: product.createdAt.toISOString(),
//     updatedAt: product.updatedAt.toISOString(),
//   }));

//   return {
//     products: adaptedProducts,
//     totalCount,
//     page,
//     totalPages,
//     hasMore: page < totalPages,
//   };
// }

// /**
//  * Get a single product by ID
//  * @param id - Product ID
//  * @returns Product or undefined if not found
//  */
// export async function getProductById(id: string): Promise<Product | undefined> {
//   const product = await prisma.product.findUnique({
//     where: { id },
//     include: {
//       images: true,
//       reviews: true,
//     },
//   });

//   if (!product) return undefined;

//   return {
//     id: product.id,
//     title: product.title,
//     description: product.description,
//     price: product.price,
//     brand: product.brand,
//     category: product.category,
//     thumbnail: product.thumbnail,
//     images: product.images.map((image) => image.url),
//     rating: product.rating,
//     stock: product.stock,
//     discount: product.discount,
//     reviewCount: product.reviewCount,
//     reviews: product.reviews.map(mapReviewToFrontend),
//     createdAt: product.createdAt.toISOString(),
//     updatedAt: product.updatedAt.toISOString(),
//   };
// }

// /**
//  * Get multiple products by IDs (useful for cart/wishlist)
//  * @param ids - Array of product IDs
//  * @returns Array of products
//  */
// export async function getProductsByIds(ids: string[]): Promise<Product[]> {
//   const products = await prisma.product.findMany({
//     where: { id: { in: ids } },
//     include: { images: true, reviews: true },
//   });

//   return products.map((product) => ({
//     id: product.id,
//     title: product.title,
//     description: product.description,
//     price: product.price,
//     brand: product.brand,
//     category: product.category,
//     thumbnail: product.thumbnail,
//     images: product.images.map((image) => image.url),
//     rating: product.rating,
//     stock: product.stock,
//     discount: product.discount,
//     reviewCount: product.reviewCount,
//     reviews: product.reviews.map(mapReviewToFrontend),
//     createdAt: product.createdAt.toISOString(),
//     updatedAt: product.updatedAt.toISOString(),
//   }));
// }

// /**
//  * Get related products based on category and brand
//  * @param productId - Current product ID
//  * @param limit - Maximum number of related products
//  * @returns Array of related products
//  */
// export async function getRelatedProducts(
//   productId: string,
//   limit: number = 4
// ): Promise<Product[]> {
//   const product = await getProductById(productId);

//   if (!product) return [];

//   const relatedProducts = await prisma.product.findMany({
//     where: {
//       id: { not: productId },
//       OR: [
//         { category: { equals: product.category } },
//         { brand: { equals: product.brand } },
//       ],
//     },
//     take: limit,
//     include: { images: true, reviews: true },
//   });

//   return relatedProducts.map((p) => ({
//     id: p.id,
//     title: p.title,
//     description: p.description,
//     price: p.price,
//     brand: p.brand,
//     category: p.category,
//     thumbnail: p.thumbnail,
//     images: p.images.map((image) => image.url),
//     rating: p.rating,
//     stock: p.stock,
//     discount: p.discount,
//     reviewCount: p.reviewCount,
//     reviews: p.reviews.map(mapReviewToFrontend),
//     createdAt: p.createdAt.toISOString(),
//     updatedAt: p.updatedAt.toISOString(),
//   }));
// }

// /**
//  * Get unique categories from all products
//  * @returns Array of unique categories
//  */
// export async function getCategories(): Promise<string[]> {
//   const categories = await prisma.product.findMany({
//     distinct: ['category'],
//     select: { category: true },
//   });
//   return categories.map((c) => c.category).sort();
// }

// /**
//  * Get unique brands from all products
//  * @returns Array of unique brands
//  */
// export async function getBrands(): Promise<string[]> {
//   const brands = await prisma.product.findMany({
//     distinct: ['brand'],
//     select: { brand: true },
//   });
//   return brands.map((b) => b.brand).sort();
// }

// /**
//  * Get price range across all products
//  * @returns Object with min and max prices
//  */
// export async function getPriceRange(): Promise<{ min: number; max: number }> {
//   const result = await prisma.product.aggregate({
//     _min: { price: true },
//     _max: { price: true },
//   });

//   return {
//     min: result._min.price || 0,
//     max: result._max.price || 0,
//   };
// }
