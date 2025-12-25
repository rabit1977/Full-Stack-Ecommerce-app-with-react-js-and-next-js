// File: lib/store/slices/productSlice.ts
// Enhanced with full CRUD operations while keeping your existing logic

import { initialProducts } from '@/lib/constants/products';
import { Product, Review, ReviewPayload } from '@/lib/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

const PRODUCTS_STORAGE_KEY = 'products';

/**
 * Load products from localStorage, merging with initial products
 */
const loadProductsFromStorage = (): Product[] => {
  if (typeof window === 'undefined') return initialProducts;

  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!stored) return initialProducts;

    const storedProducts: Product[] = JSON.parse(stored);

    // Merge stored products with initial products
    // Keep user-generated reviews and stock updates
    const mergedProducts = initialProducts.map((initialProduct) => {
      const storedProduct = storedProducts.find(
        (p) => p.id === initialProduct.id
      );
      if (storedProduct) {
        return {
          ...initialProduct,
          reviews: storedProduct.reviews || initialProduct.reviews,
          reviewCount: storedProduct.reviewCount || initialProduct.reviewCount,
          rating: storedProduct.rating || initialProduct.rating,
          stock:
            storedProduct.stock !== undefined
              ? storedProduct.stock
              : initialProduct.stock,
        };
      }
      return initialProduct;
    });

    // Add user-created products that aren't in initialProducts
    const userCreatedProducts = storedProducts.filter(
      (storedProduct) =>
        !initialProducts.some((initial) => initial.id === storedProduct.id)
    );

    return [...mergedProducts, ...userCreatedProducts];
  } catch (error) {
    console.error('Error loading products from storage:', error);
    return initialProducts;
  }
};

/**
 * Save products to localStorage
 * Save full product data for user-created products
 * Only save essential data for initial products
 */
const saveProductsToStorage = (products: Product[]): void => {
  if (typeof window === 'undefined') return;

  try {
    const productsToSave = products.map((p) => {
      // Check if this is a user-created product (not in initialProducts)
      const isUserCreated = !initialProducts.some((initial) => initial.id === p.id);

      if (isUserCreated) {
        // Save full product data for user-created products
        return p;
      } else {
        // Only save essential data for initial products
        return {
          id: p.id,
          reviews: p.reviews,
          reviewCount: p.reviewCount,
          rating: p.rating,
          stock: p.stock,
        };
      }
    });

    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsToSave));

    // Dispatch custom event for cross-component sync
    window.dispatchEvent(
      new CustomEvent('productsUpdated', {
        detail: { products },
      })
    );
  } catch (error) {
    console.error('Error saving products to storage:', error);
  }
};

const initialState: ProductsState = {
  products: loadProductsFromStorage(),
  isLoading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    /**
     * Set loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * Set error message
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    /**
     * Clear error message
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Replace all products
     */
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.isLoading = false;
      state.error = null;
      saveProductsToStorage(state.products);
    },

    /**
     * Add a new product (for admin)
     */
    addProduct: (state, action: PayloadAction<Product>) => {
      const existingProduct = state.products.find(
        (p) => p.id === action.payload.id
      );

      if (existingProduct) {
        state.error = 'Product with this ID already exists';
        return;
      }

      state.products.push(action.payload);
      state.error = null;
      saveProductsToStorage(state.products);
    },

    /**
     * Update existing product (for admin)
     */
    updateProduct: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<Product> }>
    ) => {
      const { id, changes } = action.payload;
      const productIndex = state.products.findIndex((p) => p.id === id);

      if (productIndex === -1) {
        state.error = `Product with ID ${id} not found`;
        return;
      }

      state.products[productIndex] = {
        ...state.products[productIndex],
        ...changes,
        updatedAt: new Date().toISOString(),
      };

      state.error = null;
      saveProductsToStorage(state.products);
    },

    /**
     * Delete product (for admin)
     */
    deleteProduct: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const productExists = state.products.some((p) => p.id === productId);

      if (!productExists) {
        state.error = `Product with ID ${productId} not found`;
        return;
      }

      state.products = state.products.filter((p) => p.id !== productId);
      state.error = null;
      saveProductsToStorage(state.products);
    },

    /**
     * Add or update a review
     */
    addReview: (
      state,
      action: PayloadAction<{ productId: string; reviewData: ReviewPayload }>
    ) => {
      const { productId, reviewData } = action.payload;
      const product = state.products.find((p) => p.id === productId);

      if (!product) {
        state.error = `Product with ID ${productId} not found`;
        return;
      }

      const existingReviews = product.reviews || [];
      let newReviews: Review[];

      if (reviewData.id) {
        // Update existing review
        const reviewExists = existingReviews.some(
          (r) => r.id === reviewData.id
        );
        if (reviewExists) {
          newReviews = existingReviews.map((r) =>
            r.id === reviewData.id ? ({ ...r, ...reviewData } as Review) : r
          );
        } else {
          state.error = `Review with ID ${reviewData.id} not found`;
          return;
        }
      } else {
        // Add new review
        const newReview: Review = {
          id: `review_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          author: reviewData.author,
          rating: reviewData.rating,
          title: reviewData.title,
          comment: reviewData.comment,
          date: new Date().toISOString(),
          helpful: 0,
        };
        newReviews = [newReview, ...existingReviews];
      }

      // Recalculate product rating
      const totalRating = newReviews.reduce((sum, r) => sum + r.rating, 0);
      product.reviews = newReviews;
      product.reviewCount = newReviews.length;
      product.rating =
        newReviews.length > 0
          ? parseFloat((totalRating / newReviews.length).toFixed(1))
          : 0;

      state.error = null;
      saveProductsToStorage(state.products);
    },

    /**
     * Delete a review
     */
    deleteReview: (
      state,
      action: PayloadAction<{ productId: string; reviewId: string }>
    ) => {
      const { productId, reviewId } = action.payload;
      const product = state.products.find((p) => p.id === productId);

      if (!product) {
        state.error = `Product with ID ${productId} not found`;
        return;
      }

      if (!product.reviews) {
        state.error = 'No reviews found for this product';
        return;
      }

      const reviewExists = product.reviews.some((r) => r.id === reviewId);
      if (!reviewExists) {
        state.error = `Review with ID ${reviewId} not found`;
        return;
      }

      product.reviews = product.reviews.filter((r) => r.id !== reviewId);

      // Recalculate rating
      if (product.reviews.length > 0) {
        const totalRating = product.reviews.reduce(
          (sum, r) => sum + r.rating,
          0
        );
        product.rating = parseFloat(
          (totalRating / product.reviews.length).toFixed(1)
        );
        product.reviewCount = product.reviews.length;
      } else {
        product.rating = 0;
        product.reviewCount = 0;
      }

      state.error = null;
      saveProductsToStorage(state.products);
    },

    /**
     * Update review helpful count
     */
    updateReviewHelpfulCount: (
      state,
      action: PayloadAction<{
        productId: string;
        reviewId: string;
        direction: 'increment' | 'decrement';
      }>
    ) => {
      const { productId, reviewId, direction } = action.payload;
      const product = state.products.find((p) => p.id === productId);

      if (!product || !product.reviews) {
        state.error = 'Product or reviews not found';
        return;
      }

      const review = product.reviews.find((r) => r.id === reviewId);

      if (!review) {
        state.error = `Review with ID ${reviewId} not found`;
        return;
      }

      if (direction === 'increment') {
        review.helpful = (review.helpful || 0) + 1;
      } else {
        review.helpful = Math.max(0, (review.helpful || 0) - 1);
      }

      state.error = null;
      saveProductsToStorage(state.products);
    },

    /**
     * Update product stock
     */
    updateStock: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const product = state.products.find((p) => p.id === productId);

      if (!product) {
        state.error = `Product with ID ${productId} not found`;
        return;
      }

      if (product.stock < quantity) {
        state.error = 'Insufficient stock available';
        return;
      }

      product.stock -= quantity;
      state.error = null;
      saveProductsToStorage(state.products);
    },

    /**
     * Update product stock directly (for admin)
     */
    setStock: (
      state,
      action: PayloadAction<{ productId: string; stock: number }>
    ) => {
      const { productId, stock } = action.payload;
      const product = state.products.find((p) => p.id === productId);

      if (!product) {
        state.error = `Product with ID ${productId} not found`;
        return;
      }

      product.stock = Math.max(0, stock);
      state.error = null;
      saveProductsToStorage(state.products);
    },

    /**
     * Reset products to initial state
     */
    resetProductsState: (state) => {
      state.products = initialProducts;
      state.isLoading = false;
      state.error = null;

      // Clear storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(PRODUCTS_STORAGE_KEY);
      }
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  addReview,
  deleteReview,
  updateReviewHelpfulCount,
  updateStock,
  setStock,
  resetProductsState,
} = productsSlice.actions;

export default productsSlice.reducer;