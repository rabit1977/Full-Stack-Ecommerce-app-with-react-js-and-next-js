import { addToCartAction } from './cart-actions';

describe('Cart Actions', () => {
  describe('addToCartAction', () => {
    it('should add a new item to the cart', async () => {
      // Mock the dependencies
      const productId = 'product-1';
      const quantity = 1;
      const options = { color: 'red' };

      // Call the action
      const result = await addToCartAction({ productId, quantity, options });

      // Assert the result
      expect(result.success).toBe(true);
      expect(result.message).toBe('Product added to cart');
    });
  });
});
