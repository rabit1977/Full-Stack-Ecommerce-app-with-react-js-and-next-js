import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store';
import { addOrder } from '../slices/orderSlice';
import { 
  addReview as addReviewAction, 
  deleteReview as deleteReviewAction, 
  updateReviewHelpfulCount,
  updateStock 
} from '../slices/productSlice';
import { clearCart } from '../slices/cartSlice';
import { toggleHelpfulReview as toggleHelpfulReviewAction } from '../slices/userSlice';
import { showToast } from './uiThunks';
import { Order, ReviewPayload } from '@/lib/types';

/**
 * Generate unique order ID with random component for better uniqueness
 */
const generateOrderId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

/**
 * Place an order - handles order creation, stock updates, and cart clearing
 */
export const placeOrder = createAsyncThunk<
  string, // Return type (order ID)
  Omit<Order, 'id' | 'date'>, // Argument type
  { dispatch: AppDispatch; state: RootState }
>(
  'order/placeOrder',
  async (orderDetails, { dispatch }) => {
    try {
      const newOrder: Order = {
        id: generateOrderId(),
        date: new Date().toISOString(),
        ...orderDetails,
      };

      // Add order to state
      dispatch(addOrder(newOrder));

      // Batch stock updates for better performance
      const stockUpdates = newOrder.items.map(item => 
        dispatch(updateStock({ 
          productId: item.id, 
          quantity: item.quantity 
        }))
      );

      // Wait for all stock updates to complete
      await Promise.all(stockUpdates);

      // Clear cart after successful order
      dispatch(clearCart());
      
      // Show success message
      dispatch(showToast('Order placed successfully!', 'success'));
      
      return newOrder.id;
    } catch (error) {
      dispatch(showToast('Failed to place order. Please try again.', 'error'));
      throw error;
    }
  }
);

/**
 * Add or update a product review
 */
export const addReview = createAsyncThunk<
  void,
  { productId: string; reviewData: ReviewPayload },
  { dispatch: AppDispatch }
>(
  'product/addReview',
  async ({ productId, reviewData }, { dispatch }) => {
    try {
      dispatch(addReviewAction({ productId, reviewData }));
      
      const message = reviewData.id 
        ? 'Review updated successfully!' 
        : 'Thank you for your review!';
      
      dispatch(showToast(message, 'success'));
    } catch (error) {
      dispatch(showToast('Failed to submit review. Please try again.', 'error'));
      throw error;
    }
  }
);

/**
 * Delete a product review
 */
export const deleteReview = createAsyncThunk<
  void,
  { productId: string; reviewId: string },
  { dispatch: AppDispatch }
>(
  'product/deleteReview',
  async ({ productId, reviewId }, { dispatch }) => {
    try {
      dispatch(deleteReviewAction({ productId, reviewId }));
      dispatch(showToast('Review deleted successfully', 'info'));
    } catch (error) {
      dispatch(showToast('Failed to delete review. Please try again.', 'error'));
      throw error;
    }
  }
);

/**
 * Toggle helpful status on a review
 */
export const toggleHelpfulReview = createAsyncThunk<
  void,
  { productId: string; reviewId: string },
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
  'product/toggleHelpfulReview',
  async ({ productId, reviewId }, { dispatch, getState, rejectWithValue }) => {
    const { user } = getState().user;
    
    // Check authentication
    if (!user) {
      dispatch(showToast('You must be logged in to do that.', 'error'));
      return rejectWithValue('User not authenticated');
    }

    try {
      const hasBeenMarkedHelpful = user.helpfulReviews?.includes(reviewId) ?? false;
      const direction = hasBeenMarkedHelpful ? 'decrement' : 'increment';

      // Update user's helpful reviews list
      dispatch(toggleHelpfulReviewAction(reviewId));
      
      // Update the review's helpful count
      dispatch(updateReviewHelpfulCount({
        productId,
        reviewId,
        direction,
      }));
    } catch (error) {
      dispatch(showToast('Failed to update review. Please try again.', 'error'));
      throw error;
    }
  }
);

// Export legacy thunk functions for backward compatibility
// These wrap the new async thunks for components that haven't been updated yet
export const placeOrderLegacy = (orderDetails: Omit<Order, 'id' | 'date'>) => 
  (dispatch: AppDispatch) => dispatch(placeOrder(orderDetails));

export const addReviewLegacy = (productId: string, reviewData: ReviewPayload) => 
  (dispatch: AppDispatch) => dispatch(addReview({ productId, reviewData }));

export const deleteReviewLegacy = (productId: string, reviewId: string) => 
  (dispatch: AppDispatch) => dispatch(deleteReview({ productId, reviewId }));

export const toggleHelpfulReviewLegacy = (productId: string, reviewId: string) => 
  (dispatch: AppDispatch) => dispatch(toggleHelpfulReview({ productId, reviewId }));