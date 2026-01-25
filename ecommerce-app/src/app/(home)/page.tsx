// app/page.tsx
import { getProductsAction } from '@/actions/product-actions';
import { Hero } from '@/components/home/hero';
import { FeaturedProducts } from '@/components/product/featured-products';
import { ProductWithRelations } from '@/lib/types';

/**
 * Home Page Component
 * 
 * Displays hero section with featured products carousel
 * and featured products grid
 */
export default async function HomePage() {
  // Fetch featured products
  // Fetch featured products with error handling for debugging
  let products: ProductWithRelations[] = [];
  try {
    const result = await getProductsAction({
      limit: 10,
      sort: 'featured',
    });
    products = result.products;
  } catch (error) {
    console.error('HomePage Error: Failed to fetch products:', error);
    // Return empty array to allow page to load even if DB fails
    products = [];
  }

  return (
    <>
      <Hero
        products={products}
        carouselLimit={5}
        autoPlayInterval={4000}
        showTestimonials={true}
      />
      <FeaturedProducts
        title='Featured Products'
        subtitle='Check out our latest and greatest'
        products={products}
      />
    </>
  );
}