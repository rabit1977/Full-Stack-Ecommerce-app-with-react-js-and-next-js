import { Order } from '@/lib/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
}

const ORDERS_STORAGE_KEY = 'orders';

/**
 * Load orders from localStorage
 */
const loadOrdersFromStorage = (): Order[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading orders from storage:', error);
    return [];
  }
};

/**
 * Save orders to localStorage
 */
const saveOrdersToStorage = (orders: Order[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders to storage:', error);
  }
};

const initialState: OrderState = {
  orders: loadOrdersFromStorage(),
  selectedOrder: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    /**
     * Add a new order
     */
    addOrder: (state, action: PayloadAction<Order>) => {
      // Add to beginning for most recent first
      state.orders.unshift(action.payload);
      saveOrdersToStorage(state.orders);
    },

    /**
     * Clear all orders
     */
    clearOrders: (state) => {
      state.orders = [];
      state.selectedOrder = null;
      saveOrdersToStorage(state.orders);
    },

    /**
     * Set selected order for viewing details
     */
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },

    /**
     * Update existing order
     */
    updateOrder: (state, action: PayloadAction<Order>) => {
      const updated = action.payload;
      const idx = state.orders.findIndex(o => o.id === updated.id);
      
      if (idx !== -1) {
        state.orders[idx] = updated;
        
        // Update selectedOrder if it's the same order
        if (state.selectedOrder?.id === updated.id) {
          state.selectedOrder = updated;
        }
        
        saveOrdersToStorage(state.orders);
      }
    },

    /**
     * Update order status
     */
    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: Order['status'] }>
    ) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      
      if (order) {
        order.status = status;
        
        if (state.selectedOrder?.id === orderId) {
          state.selectedOrder.status = status;
        }
        
        saveOrdersToStorage(state.orders);
      }
    },

    /**
     * Delete an order
     */
    deleteOrder: (state, action: PayloadAction<string>) => {
      const orderId = action.payload;
      state.orders = state.orders.filter(o => o.id !== orderId);
      
      if (state.selectedOrder?.id === orderId) {
        state.selectedOrder = null;
      }
      
      saveOrdersToStorage(state.orders);
    },

    /**
     * Replace entire order state (for hydration)
     */
    setOrderState: (state, action: PayloadAction<OrderState>) => {
      state.orders = action.payload.orders;
      state.selectedOrder = action.payload.selectedOrder;
      saveOrdersToStorage(state.orders);
    },
  },
});

export const {
  addOrder,
  clearOrders,
  setSelectedOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  setOrderState,
} = orderSlice.actions;

export default orderSlice.reducer;