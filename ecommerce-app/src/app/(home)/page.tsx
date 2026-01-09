// app/page.tsx
import { getProductsAction } from '@/actions/product-actions';
import { Hero } from '@/components/home/hero';
import { FeaturedProducts } from '@/components/product/featured-products';
import { mapPrismaProductsToFrontend } from '@/lib/utils/product-mapper';

export default async function HomePage() {
  const { products: rawProducts } = await getProductsAction({
    limit: 10,
    sort: 'featured',
  });

  // Convert Prisma products to frontend format
  const products = mapPrismaProductsToFrontend(rawProducts);

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
