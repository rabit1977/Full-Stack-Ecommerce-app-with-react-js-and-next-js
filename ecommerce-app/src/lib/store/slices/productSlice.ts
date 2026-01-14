import { Product, Review, ReviewPayload } from '@/lib/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
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
     * Replace all products (fetched from database)
     */
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    /**
     * Add a new product - typically done via Server Action
     * This is kept for optimistic updates only
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
    },

    /**
     * Update existing product
     * Typically updated via Server Action, this is for optimistic updates
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
    },

    /**
     * Delete product
     * Typically deleted via Server Action, this is for optimistic updates
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

      const existingReviews = product.reviews ? [...product.reviews] : [];
      const reviewIndex = existingReviews.findIndex(
        (r) => r.id === reviewData.id
      );

      if (reviewIndex !== -1) {
        // Update existing review
        existingReviews[reviewIndex] = {
          ...existingReviews[reviewIndex],
          ...reviewData,
        } as Review;
      } else {
        // Add new review
        existingReviews.unshift(reviewData as Review);
      }

      // Recalculate product rating
      const totalRating = existingReviews.reduce((sum, r) => sum + r.rating, 0);
      product.reviews = existingReviews;
      product.reviewCount = existingReviews.length;
      product.rating =
        existingReviews.length > 0
          ? parseFloat((totalRating / existingReviews.length).toFixed(1))
          : 0;

      state.error = null;
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

      const reviewExists = product.reviews.some(
        (r: Review) => r.id === reviewId
      );
      if (!reviewExists) {
        state.error = `Review with ID ${reviewId} not found`;
        return;
      }

      product.reviews = product.reviews.filter(
        (r: Review) => r.id !== reviewId
      );

      // Recalculate rating
      if (product.reviews.length > 0) {
        const totalRating = product.reviews.reduce(
          (sum: number, r: Review) => sum + r.rating,
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

      const review = product.reviews.find((r: Review) => r.id === reviewId);

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
    },

    /**
     * Reset products to empty state
     */
    resetProductsState: (state) => {
      state.products = [];
      state.isLoading = false;
      state.error = null;
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
