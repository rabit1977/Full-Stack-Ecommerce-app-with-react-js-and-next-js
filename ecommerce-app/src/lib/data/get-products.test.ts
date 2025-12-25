import { getProducts } from './get-products';
import { Product } from '@/lib/types';

// Create a predictable, isolated dataset for our tests
const mockProducts: Product[] = [
  { id: 'sku-1', title: 'Z', brand: 'Apple', category: 'Phones', price: 1000, rating: 5, stock: 10, description: '', images: [] },
  { id: 'sku-2', title: 'Y', brand: 'Samsung', category: 'Phones', price: 800, rating: 4, stock: 10, description: '', images: [] },
  { id: 'sku-3', title: 'X', brand: 'Apple', category: 'Laptops', price: 1500, rating: 5, stock: 10, description: '', images: [] },
  { id: 'sku-4', title: 'W', brand: 'Sony', category: 'Audio', price: 500, rating: 3, stock: 10, description: '', images: [] },
  { id: 'sku-5', title: 'V', brand: 'Samsung', category: 'TVs', price: 1200, rating: 4, stock: 10, description: '', images: [] },
];

describe('getProducts', () => {
  it('should return all products when no options are provided', async () => {
    const { products, totalCount } = await getProducts({}, mockProducts);
    expect(products).toHaveLength(5);
    expect(totalCount).toBe(5);
  });

  describe('Filtering', () => {
    it('should filter by a single category (case-insensitive)', async () => {
      const { products, totalCount } = await getProducts({ category: 'phones' }, mockProducts);
      expect(totalCount).toBe(2);
      expect(products.every(p => p.category === 'Phones')).toBe(true);
    });

    it('should filter by multiple brands (case-insensitive)', async () => {
      const { totalCount } = await getProducts({ brands: 'apple,samsung' }, mockProducts);
      expect(totalCount).toBe(4);
    });

    it('should filter by a price range', async () => {
      const { products, totalCount } = await getProducts({ minPrice: 900, maxPrice: 1300 }, mockProducts);
      expect(totalCount).toBe(2);
      expect(products.every(p => p.price >= 900 && p.price <= 1300)).toBe(true);
    });

    it('should filter by a combination of category and brand', async () => {
      const { products } = await getProducts({ category: 'Phones', brands: 'Samsung' }, mockProducts);
      expect(products).toHaveLength(1);
      expect(products[0].brand).toBe('Samsung');
    });
  });

  describe('Sorting', () => {
    it('should sort by price ascending', async () => {
      const { products } = await getProducts({ sort: 'price-asc' }, mockProducts);
      expect(products.map(p => p.price)).toEqual([500, 800, 1000, 1200, 1500]);
    });

    it('should sort by price descending', async () => {
      const { products } = await getProducts({ sort: 'price-desc' }, mockProducts);
      expect(products.map(p => p.price)).toEqual([1500, 1200, 1000, 800, 500]);
    });

    it('should sort by rating descending', async () => {
      const { products } = await getProducts({ sort: 'rating' }, mockProducts);
      expect(products.map(p => p.rating)).toEqual([5, 5, 4, 4, 3]);
    });

    it('should use rating as default for featured', async () => {
        const { products } = await getProducts({ sort: 'featured' }, mockProducts);
        expect(products.map(p => p.rating)).toEqual([5, 5, 4, 4, 3]);
    });

    it('should sort by newest (ID descending)', async () => {
        const { products } = await getProducts({ sort: 'newest' }, mockProducts);
        expect(products.map(p => p.id)).toEqual(['sku-5', 'sku-4', 'sku-3', 'sku-2', 'sku-1']);
    });
  });

  describe('Pagination', () => {
    it('should return the correct number of items per page', async () => {
      const { products } = await getProducts({ limit: 2 }, mockProducts);
      expect(products).toHaveLength(2);
    });

    it('should return the correct page of items with a predictable sort', async () => {
      // Sort by price descending to get a predictable order: 1500, 1200, 1000, 800, 500
      // Page 2 with limit 2 should contain items with price 1000 and 800
      const { products } = await getProducts({ limit: 2, page: 2, sort: 'price-desc' }, mockProducts);
      expect(products).toHaveLength(2);
      expect(products[0].price).toBe(1000);
      expect(products[1].price).toBe(800);
    });

    it('should return the remaining items on the last page', async () => {
      const { products } = await getProducts({ limit: 3, page: 2 }, mockProducts);
      expect(products).toHaveLength(2);
    });
  });
});