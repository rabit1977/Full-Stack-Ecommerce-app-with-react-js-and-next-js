import cartReducer, {
  addToCart,
  removeFromCart,
  updateCartQuantity,
} from './cartSlice';
import { CartItem } from '@/lib/types';

// Helper to create a mock product
const createMockItem = (id: string, quantity: number): CartItem => ({
  id: `prod-${id}`,
  cartItemId: `cart-${id}`,
  title: `Product ${id}`,
  price: 10 * parseInt(id),
  quantity,
  image: '',
  brand: 'Brand',
  category: 'Category',
  stock: 10,
});

describe('cart slice', () => {
  const initialState = {
    cart: [],
    savedForLater: [],
  };

  const item1 = createMockItem('1', 1);
  const item2 = createMockItem('2', 2);

  it('should handle initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('addToCart', () => {
    it('should add a new item to an empty cart', () => {
      const state = cartReducer(initialState, addToCart(item1));
      expect(state.cart).toHaveLength(1);
      expect(state.cart[0]).toEqual(item1);
    });

    it('should add a different item to a non-empty cart', () => {
      const currentState = { ...initialState, cart: [item1] };
      const state = cartReducer(currentState, addToCart(item2));
      expect(state.cart).toHaveLength(2);
      expect(state.cart[1]).toEqual(item2);
    });

    it('should increase the quantity of an existing item', () => {
      const currentState = { ...initialState, cart: [item1] };
      const item1AddPayload = { ...item1, quantity: 2 }; // Payload to add 2 more
      const state = cartReducer(currentState, addToCart(item1AddPayload));
      expect(state.cart).toHaveLength(1);
      expect(state.cart[0].quantity).toBe(3);
    });
  });

  describe('updateCartQuantity', () => {
    const currentState = { ...initialState, cart: [item1, item2] };

    it('should update the quantity of a specific item', () => {
      const payload = { cartItemId: item1.cartItemId, newQuantity: 5 };
      const state = cartReducer(currentState, updateCartQuantity(payload));
      expect(state.cart[0].quantity).toBe(5);
      expect(state.cart[1].quantity).toBe(2); // Should not change
    });

    it('should remove an item if quantity is updated to 0', () => {
      const payload = { cartItemId: item1.cartItemId, newQuantity: 0 };
      const state = cartReducer(currentState, updateCartQuantity(payload));
      expect(state.cart.find(item => item.cartItemId === item1.cartItemId)).toBeUndefined();
      expect(state.cart).toHaveLength(1);
    });

    it('should not change state if item does not exist', () => {
      const payload = { cartItemId: 'cart-999', newQuantity: 5 };
      const state = cartReducer(currentState, updateCartQuantity(payload));
      expect(state).toEqual(currentState);
    });
  });

  describe('removeFromCart', () => {
    const currentState = { ...initialState, cart: [item1, item2] };

    it('should remove a specific item from the cart', () => {
      const state = cartReducer(currentState, removeFromCart(item1.cartItemId));
      expect(state.cart).toHaveLength(1);
      expect(state.cart[0].cartItemId).toBe(item2.cartItemId);
    });

    it('should not change state if item does not exist', () => {
      const state = cartReducer(currentState, removeFromCart('cart-999'));
      expect(state).toEqual(currentState);
    });
  });
});