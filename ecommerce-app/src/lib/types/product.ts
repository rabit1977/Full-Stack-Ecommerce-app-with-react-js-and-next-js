// types/product.ts
import { Product as PrismaProduct } from '@/generated/prisma/browser';

/**
 * Product option variant (single variant within an option)
 */
export interface ProductOptionVariant {
  name?: string;
  value: string;
  image?: string;
  priceModifier?: number;
  inStock?: boolean;
}

/**
 * Product option interface (e.g., "Size", "Color")
 * Contains multiple variants
 */
export interface ProductOption {
  name: string;
  type: string;
  variants: ProductOptionVariant[];
}

/**
 * Base Product type with all fields
 * Overrides Prisma's JsonValue types with proper TypeScript types
 */
export type Product = Omit<PrismaProduct, 'options' | 'specifications' | 'dimensions'> & {
  options: ProductOption[] | null;
  specifications: { key: string; value: string }[] | Record<string, string> | null;
  dimensions: { length?: number; width?: number; height?: number } | null;
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
  reviews?: {
    id: string;
    userId: string;
    productId: string;
    rating: number;
    title: string;
    comment: string;
    helpful: number;
    verifiedPurchase: boolean;
    createdAt: Date;
    user: {
      name: string | null;
      image: string | null;
    };
  }[];
  inBundles?: {
    id: string;
    quantity: number;
    discount: number;
    product: {
      id: string;
      title: string;
      price: number;
      images: {
        url: string;
      }[];
    };
  }[];
  relatedTo?: {
    id: string;
    relationType: string;
    relatedProduct: {
      id: string;
      title: string;
      price: number;
      images: {
        url: string;
      }[];
    };
  }[];
  bundleItems?: {
    id: string;
    bundleId: string;
    productId: string;
    quantity: number;
    discount: number;
    bundle: {
        id: string;
        title: string;
        slug: string;
        price: number;
        images: {
            url: string;
        }[];
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

export interface CategoryHierarchy {
  name: string;
  subCategories: string[];
}

export interface ProductGridProps {
  title?: string;
  subtitle?: string;
  products: ProductWithImages[]; // Changed to ProductWithImages
  totalCount: number;
  currentPage: number;
  currentCategories: string;
  currentSubCategories?: string;
  currentBrands: string;
  currentMinPrice?: number;
  currentMaxPrice?: number;
  currentSort: SortKey;
  pageSize?: number;
  allCategories: (string | CategoryHierarchy)[];
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