import {
  CartItem as PrismaCartItem,
  Order as PrismaOrder,
  Product as PrismaProduct,
  ProductImage,
  Review as PrismaReview,
  User as PrismaUser,
} from '@prisma/client';

// Re-exporting Prisma types for central access
export type User = PrismaUser;
export type Product = PrismaProduct;
export type Review = PrismaReview;
export type CartItem = PrismaCartItem;
export type Order = PrismaOrder;

// Extended types for relations
export type ProductWithRelations = PrismaProduct & {
  images: ProductImage[];
  reviews: PrismaReview[];
};

export type ReviewWithUser = PrismaReview & {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

// Props for UI components
export interface ProductGridProps {
  title?: string;
  subtitle?: string;
  products: ProductWithRelations[]; // Use the new extended type
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

// Other types remain the same
export type SortKey =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'newest'
  | 'popularity';

export interface FilterState {
  category: string;
  brands: string;
  minPrice?: number;
  maxPrice?: number;
  sort: SortKey;
  page: number;
}

export interface ProductGridControlsProps {
  title: string;
  subtitle: string;
  currentSort: SortKey;
  onSortChange: (sort: SortKey) => void;
  onFilterToggle: () => void;
}

