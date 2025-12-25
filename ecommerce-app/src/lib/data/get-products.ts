import { initialProducts } from '@/lib/constants/products';
import { Product, SortKey } from '@/lib/types';

/**
 * Available sort options for products
 */

/**
 * Extract numeric ID from SKU for sorting
 * @param id - Product SKU (e.g., "sku-1234567890")
 * @returns Numeric portion of the ID
 */
const extractIdNumber = (id: string): number => {
  const match = id.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

/**
 * Sort comparator functions
 */
const sortComparators: Record<SortKey, (a: Product, b: Product) => number> = {
  featured: (a, b) => (b.rating || 0) - (a.rating || 0),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => (b.rating || 0) - (a.rating || 0),
  newest: (a, b) => extractIdNumber(b.id) - extractIdNumber(a.id),
  popularity: (a, b) => (b.reviewCount || 0) - (a.reviewCount || 0),
};

/**
 * Options for fetching products
 */
export interface GetProductsOptions {
  query?: string;
  categories?: string; // Comma-separated string of categories
  brands?: string; // Comma-separated string of brands
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sort?: SortKey;
  page?: number;
  limit?: number;
}

/**
 * Result of product fetch operation
 */
export interface GetProductsResult {
  products: Product[];
  totalCount: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Fetch and filter products with pagination
 * @param options - Filter and pagination options
 * @param productSource - Product data source (defaults to initialProducts)
 * @returns Filtered and paginated products with metadata
 */
export async function getProducts(
  options: GetProductsOptions = {},
  productSource: Product[] = initialProducts
): Promise<GetProductsResult> {
  const {
    query,
    categories,
    brands,
    minPrice,
    maxPrice,
    minRating,
    inStock,
    sort = 'featured',
    page = 1,
    limit = 8,
  } = options;

  // Simulate database delay (remove in production with real DB)
  await new Promise((resolve) => setTimeout(resolve, 100));

  let products = [...productSource]; // Create copy to avoid mutations

  /**
   * Apply filters to product array
   */
  function applyFilters(
    products: Product[],
    filters: Omit<GetProductsOptions, 'sort' | 'page' | 'limit'>
  ): Product[] {
    let filtered = products;

    // Search query filter
    if (filters.query) {
      const lowerQuery = filters.query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery) ||
          p.brand.toLowerCase().includes(lowerQuery)
      );
    }

    // Categories filter (multiple categories support)
    if (filters.categories) {
      const selectedCategories = new Set(
        filters.categories
          .split(',')
          .map((c) => c.trim().toLowerCase())
          .filter(Boolean) // Remove empty strings
      );

      // Only filter if there are selected categories
      if (selectedCategories.size > 0) {
        filtered = filtered.filter((p) =>
          selectedCategories.has(p.category.toLowerCase())
        );
      }
    }

    // Brands filter
    if (filters.brands) {
      const selectedBrands = new Set(
        filters.brands
          .split(',')
          .map((b) => b.trim().toLowerCase())
          .filter(Boolean)
      );

      if (selectedBrands.size > 0) {
        filtered = filtered.filter((p) =>
          selectedBrands.has(p.brand.toLowerCase())
        );
      }
    }

    // Price range filters
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }

    // Rating filter
    if (filters.minRating !== undefined) {
      filtered = filtered.filter((p) => (p.rating || 0) >= filters.minRating!);
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    return filtered;
  }

  // Apply filters
  products = applyFilters(products, {
    query,
    categories,
    brands,
    minPrice,
    maxPrice,
    minRating,
    inStock,
  });

  // Get total count after filtering
  const totalCount = products.length;
  const totalPages = Math.ceil(totalCount / limit);

  // Apply sorting
  const comparator = sortComparators[sort];
  if (comparator) {
    products.sort(comparator);
  }

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const paginatedProducts = products.slice(startIndex, startIndex + limit);

  return {
    products: paginatedProducts,
    totalCount,
    page,
    totalPages,
    hasMore: page < totalPages,
  };
}

/**
 * Get a single product by ID
 * @param id - Product ID
 * @param productSource - Product data source
 * @returns Product or undefined if not found
 */
export async function getProductById(
  id: string,
  productSource: Product[] = initialProducts
): Promise<Product | undefined> {
  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return productSource.find((product) => product.id === id);
}

/**
 * Get multiple products by IDs (useful for cart/wishlist)
 * @param ids - Array of product IDs
 * @param productSource - Product data source
 * @returns Array of products
 */
export async function getProductsByIds(
  ids: string[],
  productSource: Product[] = initialProducts
): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const idSet = new Set(ids);
  return productSource.filter((product) => idSet.has(product.id));
}

/**
 * Get related products based on category and brand
 * @param productId - Current product ID
 * @param limit - Maximum number of related products
 * @returns Array of related products
 */
export async function getRelatedProducts(
  productId: string,
  limit: number = 4
): Promise<Product[]> {
  const product = await getProductById(productId);

  if (!product) return [];

  // Find products in same category or brand, excluding current product
  const related = initialProducts
    .filter(
      (p) =>
        p.id !== productId &&
        (p.category === product.category || p.brand === product.brand)
    )
    .sort((a, b) => {
      // Prioritize same category over same brand
      const aScore =
        (a.category === product.category ? 2 : 0) +
        (a.brand === product.brand ? 1 : 0);
      const bScore =
        (b.category === product.category ? 2 : 0) +
        (b.brand === product.brand ? 1 : 0);
      return bScore - aScore;
    })
    .slice(0, limit);

  return related;
}

/**
 * Get unique categories from all products
 * @returns Array of unique categories
 */
export async function getCategories(): Promise<string[]> {
  const categories = new Set(initialProducts.map((p) => p.category));
  return Array.from(categories).sort();
}

/**
 * Get unique brands from all products
 * @returns Array of unique brands
 */
export async function getBrands(): Promise<string[]> {
  const brands = new Set(initialProducts.map((p) => p.brand));
  return Array.from(brands).sort();
}

/**
 * Get price range across all products
 * @returns Object with min and max prices
 */
export async function getPriceRange(): Promise<{ min: number; max: number }> {
  if (initialProducts.length === 0) {
    return { min: 0, max: 0 };
  }

  const prices = initialProducts.map((p) => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}
