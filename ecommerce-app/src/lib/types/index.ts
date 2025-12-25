

export interface AppState {
  user: User | null;
  users: User[];
  cart: CartItem[];
  wishlist: Set<string>;
  orders: Order[];
  products: Product[];
  savedForLater: CartItem[];
  theme: 'light' | 'dark';
  searchQuery: string;
  isMenuOpen: boolean;
  selectedProductId: string | null;
  quickViewProductId: string | null;
  selectedOrder: Order | null;
  toast: string | null;
  isLoading: boolean;
}

export interface AppContextType extends AppState {
  setPage: (page: string) => void;
  viewProduct: (productId: string) => void;
  viewOrder: (orderId: string) => void;
  login: (
    email: string,
    password: string
  ) => { success: boolean; message?: string };
  logout: () => void;
  signup: (
    name: string,
    email: string,
    password: string
  ) => { success: boolean; message?: string };
  addToCart: (item: Omit<CartItem, 'cartItemId' | 'image'>) => void;
  updateCartQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  saveForLater: (cartItemId: string) => void;
  moveToCart: (cartItemId: string) => void;
  removeFromSaved: (cartItemId: string) => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (orderDetails: Omit<Order, 'id' | 'date'>) => string;
  addReview: (productId: string, reviewData: ReviewPayload) => void;
  updateReviewHelpfulCount: (productId: string, reviewId: string) => void;
  showToast: (message: string) => void;
  setSearchQuery: (query: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setIsMenuOpen: (isOpen: boolean) => void;
  setQuickViewProductId: (id: string | null) => void;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Should not be stored in client-side state long-term
  role?: 'admin' | 'customer'; // New property for user role
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
  thumbnail?: string;
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
  id?: string; // Optional for editing
}

export interface CartItem {
  id: string; // Product ID
  cartItemId: string; // Unique ID for this cart item instance
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
  subtotal?: number; // Added - calculated from items
  shippingCost?: number; // Added - from checkout
  taxes?: number; // Added - calculated tax
  discountAmount?: number; // Added - discount applied
  shippingMethod?: 'standard' | 'express'; // Added - shipping option
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
  currentCategories: string; // Comma-separated string
  currentBrands: string; // Comma-separated string
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
  currentSort: SortKey; // ✅ Typed as SortKey
  onSortChange: (sort: SortKey) => void;
  onFilterToggle: () => void;
}