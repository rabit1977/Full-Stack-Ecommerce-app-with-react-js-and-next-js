// types/product.ts
import { Product as PrismaProduct, Prisma } from '@prisma/client';

/**
 * Product option variant (single variant within an option)
 */
export interface ProductOptionVariant {
  value: string;
  priceModifier?: number;
  inStock?: boolean;
}

/**
 * Product option interface (e.g., "Size", "Color")
 * Contains multiple variants
 */
export interface ProductOption {
  name: string;
  variants: ProductOptionVariant[];
}

/**
 * Base Product type with all fields
 * Overrides Prisma's JsonValue types with proper TypeScript types
 */
export type Product = Omit<PrismaProduct, 'options' | 'specifications'> & {
  options: ProductOption[] | null;
  specifications: Record<string, string> | null;
};

/**
 * Product with image relations
 */
export type ProductWithImages = Product & {
  images: {
    id: string;
    url: string;
  }[];
};

/**
 * Product with review relations (minimal)
 */
export type ProductWithReviews = Product & {
  reviews: {
    id: string;
    userId: string;
    rating: number;
    title: string;
    comment: string;
    helpful: number;
    verifiedPurchase: boolean;
    createdAt: Date;
  }[];
};

/**
 * Product with all relations (for product detail page)
 */
export type ProductWithRelations = Product & {
  images: {
    id: string;
    url: string;
  }[];
  reviews: {
    id: string;
    userId: string;
    rating: number;
    title: string;
    comment: string;
    helpful: number;
    verifiedPurchase: boolean;
    createdAt: Date;
    user: {
      name: string | null;
    };
  }[];
};

/**
 * Sort options for product listings
 */
export type SortKey =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'newest'
  | 'popularity';

/**
 * Filter state for product grid
 */
export interface FilterState {
  category: string;
  brands: string;
  minPrice?: number;
  maxPrice?: number;
  sort: SortKey;
  page: number;
}

/**
 * Product grid props
 */
export interface ProductGridProps {
  title?: string;
  subtitle?: string;
  products: ProductWithImages[]; // Changed to ProductWithImages
  totalCount: number;
  currentPage: number;
  currentCategories: string;
  currentBrands: string;
  currentMinPrice?: number;
  currentMaxPrice?: number;
  currentSort: SortKey;
  pageSize?: number;
  allCategories: string[];
  allBrands: string[];
  searchQuery?: string;
}

/**
 * Product grid controls props
 */
export interface ProductGridControlsProps {
  title: string;
  subtitle: string;
  currentSort: SortKey;
  onSortChange: (sort: SortKey) => void;
  onFilterToggle: () => void;
}