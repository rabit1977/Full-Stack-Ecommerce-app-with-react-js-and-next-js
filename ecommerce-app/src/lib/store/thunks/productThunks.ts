import { Product, ProductOption } from '@/lib/types';
import {
  addProduct as addProductAction,
  clearError,
  deleteProduct as deleteProductAction,
  setError,
  setLoading,
  updateProduct as updateProductAction,
} from '../slices/productSlice';
import { AppDispatch, RootState } from '../store';
import { showToast } from './uiThunks';

interface ThunkResult {
  success: boolean;
  message?: string;
  product?: Product;
}

/**
 * Generate unique product ID
 */
const generateProductId = (): string => {
  return `product_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
};

/**
 * Create a new product
 */
export const createProduct =
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
  }) =>
  (
    dispatch: AppDispatch,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _getState: () => RootState
  ): ThunkResult => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      // Prepare images array
      const images =
        productData.images ||
        (productData.imageUrl
          ? [productData.imageUrl]
          : ['https://via.placeholder.com/400x400?text=No+Image']);

      // Create new product
      const newProduct: Product = {
        id: generateProductId(),
        title: productData.title,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        brand: productData.brand,
        category: productData.category,
        images,
        thumbnail: images[0],
        rating: 0,
        reviewCount: 0,
        discount: productData.discount,
        tags: productData.tags || [],
        options: productData.options || [],
        reviews: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to Redux state (which handles localStorage)
      dispatch(addProductAction(newProduct));
      dispatch(setLoading(false));
      dispatch(showToast('Product created successfully!', 'success'));

      return { success: true, product: newProduct };
    } catch (error) {
      console.error('Error creating product:', error);
      dispatch(setError('Failed to create product'));
      dispatch(showToast('Failed to create product', 'error'));
      return { success: false, message: 'Failed to create product' };
    }
  };

/**
 * Update existing product
 */
export const updateProduct =
  (productId: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>) =>
  (dispatch: AppDispatch, getState: () => RootState): ThunkResult => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const { products } = getState().products;
      const product = products.find((p) => p.id === productId);

      if (!product) {
        dispatch(setError('Product not found'));
        dispatch(showToast('Product not found', 'error'));
        return { success: false, message: 'Product not found' };
      }

      // Update product (slice handles localStorage)
      dispatch(updateProductAction({ id: productId, changes: updates }));
      dispatch(setLoading(false));
      dispatch(showToast('Product updated successfully!', 'success'));

      return { success: true, product: { ...product, ...updates } };
    } catch (error) {
      console.error('Error updating product:', error);
      dispatch(setError('Failed to update product'));
      dispatch(showToast('Failed to update product', 'error'));
      return { success: false, message: 'Failed to update product' };
    }
  };

/**
 * Delete product
 */
export const deleteProduct =
  (productId: string) =>
  (dispatch: AppDispatch, getState: () => RootState): ThunkResult => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const { products } = getState().products;
      const productExists = products.some((p) => p.id === productId);

      if (!productExists) {
        dispatch(setError('Product not found'));
        dispatch(showToast('Product not found', 'error'));
        return { success: false, message: 'Product not found' };
      }

      // Remove from Redux state (slice handles localStorage)
      dispatch(deleteProductAction(productId));
      dispatch(setLoading(false));
      dispatch(showToast('Product deleted successfully!', 'success'));

      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      dispatch(setError('Failed to delete product'));
      dispatch(showToast('Failed to delete product', 'error'));
      return { success: false, message: 'Failed to delete product' };
    }
  };

import { getProductByIdAction } from '@/actions/product-actions';

/**
 * Fetch a single product by ID and add to store if not present
 */
export const fetchProductById =
  (productId: string) =>
  async (
    dispatch: AppDispatch,
    getState: () => RootState
  ): Promise<Product | null> => {
    try {
      const { products } = getState().products;
      const existingProduct = products.find((p) => p.id === productId);

      if (existingProduct) {
        return existingProduct;
      }

      dispatch(setLoading(true));
      const fetchedProduct = await getProductByIdAction(productId);

      if (fetchedProduct) {
        // Transform the fetched product to the frontend Product type
        const transformedProduct: Product = {
          ...fetchedProduct,
          images: fetchedProduct.images.map((img) => img.url),
          reviews: fetchedProduct.reviews.map((review) => ({
            id: review.id,
            userId: review.userId,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            helpful: review.helpful,
            verifiedPurchase: review.verifiedPurchase,
            author: review.user.name || 'Anonymous',
            date: review.createdAt.toISOString(),
          })),
          createdAt: fetchedProduct.createdAt.toISOString(),
          updatedAt: fetchedProduct.updatedAt.toISOString(),
        };

        dispatch(addProductAction(transformedProduct));
        dispatch(clearError());
        return transformedProduct;
      } else {
        dispatch(setError('Product not found'));
        return null;
      }
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      dispatch(setError('Failed to fetch product'));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
