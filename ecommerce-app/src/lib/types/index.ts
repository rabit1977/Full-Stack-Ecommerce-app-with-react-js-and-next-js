export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role?: 'ADMIN' | 'USER' | 'CUSTOMER';
  bio?: string;
  cart: CartItem[];
  savedForLater: CartItem[];
  wishlist: string[];
  helpfulReviews?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discount?: number;
  stock: number;
  brand: string;
  category: string;
  images: string[];
  rating: number;
  thumbnail?: string | null;
  reviewCount: number;
  reviews?: Review[];
  options?: ProductOption[];
  features?: string[];
  specifications?: Record<string, string>;
  sku?: string;
  tags?: string[];
  releaseDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductOption {
  name: string;
  type: string;
  variants: ProductVariant[];
}

export interface ProductVariant {
  name: string;
  value: string;
  priceModifier?: number;
  image?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
  verifiedPurchase?: boolean;
}

export interface ReviewPayload extends Omit<Review, 'id' | 'date' | 'helpful'> {
  id?: string;
}

export interface CartItem {
  id: string;
  cartItemId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  options?: Record<string, string>;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  subtotal?: number;
  shippingCost?: number;
  taxes?: number;
  discountAmount?: number;
  shippingMethod?: 'standard' | 'express';
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  createdAt: string;
}

export interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

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

export interface ProductGridProps {
  title?: string;
  subtitle?: string;
  products: Product[];
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

export interface ProductGridControlsProps {
  title: string;
  subtitle: string;
  currentSort: SortKey;
  onSortChange: (sort: SortKey) => void;
  onFilterToggle: () => void;
}

export type ProductWithImages = Product & {
  images: string[];
};

export type UserWithActivity = User & {
  wishlistCount?: number;
  ordersCount?: number;
  reviewsCount?: number;
  cartCount?: number;
};

export type OrderWithItems = Order & {
  items: CartItem[];
};

export type ReviewWithUser = Review & {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};
