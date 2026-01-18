// app/page.tsx
import { getProductsAction } from '@/actions/product-actions';
import { Hero } from '@/components/home/hero';
import { FeaturedProducts } from '@/components/product/featured-products';

/**
 * Home Page Component
 * 
 * Displays hero section with featured products carousel
 * and featured products grid
 */
export default async function HomePage() {
  // Fetch featured products
  const { products } = await getProductsAction({
    limit: 10,
    sort: 'featured',
  });

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