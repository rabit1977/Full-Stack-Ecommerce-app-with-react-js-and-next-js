// File: lib/hooks/useProducts.ts
import { useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { 
  createProduct as createProductThunk,
  updateProduct as updateProductThunk,
  deleteProduct as deleteProductThunk,
} from '@/lib/store/thunks/productThunks';
import { 
  addReview, 
  placeOrder, 
  toggleHelpfulReview 
} from '@/lib/store/thunks/managementThunks';
import { Order, ReviewPayload, Product, ProductOption } from '@/lib/types';

/**
 * Custom hook for product and order management
 * 
 * Provides access to products, orders, and related actions
 * with proper loading and error states
 */
export const useProducts = () => {
  const dispatch = useAppDispatch();
  
  // Select products state with loading and error
  const products = useAppSelector((state) => state.products.products);
  const isLoading = useAppSelector((state) => state.products.isLoading);
  const error = useAppSelector((state) => state.products.error);
  
  // Select orders state
  const orders = useAppSelector((state) => state.orders.orders);

  /**
   * Create a new product
   */
  const handleCreateProduct = useCallback(
    (productData: {
      title: string;
      description: string;
      price: number;
      stock: number;
      brand: string;
      category: string;
      images?: string[];
      imageUrl?: string;
      discount?: number;
      tags?: string[];
      options?: ProductOption[];
    }) => {
      return dispatch(createProductThunk(productData));
    },
    [dispatch]
  );

  /**
   * Update existing product
   */
  const handleUpdateProduct = useCallback(
    (productId: string, updates: Partial<Product>) => {
      return dispatch(updateProductThunk(productId, updates));
    },
    [dispatch]
  );

  /**
   * Delete product
   */
  const handleDeleteProduct = useCallback(
    (productId: string) => {
      return dispatch(deleteProductThunk(productId));
    },
    [dispatch]
  );

  /**
   * Get single product by ID
   */
  const getProduct = useCallback(
    (productId: string) => {
      return products.find(p => p.id === productId);
    },
    [products]
  );

  /**
   * Get products by category
   */
  const getProductsByCategory = useCallback(
    (category: string) => {
      return products.filter(p => p.category === category);
    },
    [products]
  );

  /**
   * Get products by brand
   */
  const getProductsByBrand = useCallback(
    (brand: string) => {
      return products.filter(p => p.brand === brand);
    },
    [products]
  );

  /**
   * Search products
   */
  const searchProducts = useCallback(
    (query: string) => {
      const lowerQuery = query.toLowerCase();
      return products.filter(
        p =>
          p.title.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.brand.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery)
      );
    },
    [products]
  );

  /**
   * Place a new order
   */
  const handlePlaceOrder = useCallback(
    (orderDetails: Omit<Order, 'id' | 'date'>) => {
      return dispatch(placeOrder(orderDetails));
    },
    [dispatch]
  );

  /**
   * Add a review to a product
   */
  const handleAddReview = useCallback(
    (productId: string, reviewData: ReviewPayload) => {
      return dispatch(addReview({ productId, reviewData }));
    },
    [dispatch]
  );

  /**
   * Toggle helpful count on a review
   */
  const handleUpdateReviewHelpfulCount = useCallback(
    (productId: string, reviewId: string) => {
      return dispatch(toggleHelpfulReview({ productId, reviewId }));
    },
    [dispatch]
  );

  return {
    // State
    products,
    orders,
    isLoading,
    error,
    
    // Product CRUD
    createProduct: handleCreateProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
    getProduct,
    
    // Product queries
    getProductsByCategory,
    getProductsByBrand,
    searchProducts,
    
    // Orders
    placeOrder: handlePlaceOrder,
    
    // Reviews
    addReview: handleAddReview,
    updateReviewHelpfulCount: handleUpdateReviewHelpfulCount,
  };
};