import { getBrands } from '@/actions/admin/brands-actions';
import { BrandsClient } from '@/components/admin/brands-client';

export default async function BrandsPage() {
  const result = await getBrands();
  
  // @ts-ignore
  const brands = result.success && result.brands ? result.brands : [];

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <BrandsClient initialBrands={brands} />
    </div>
  );
}
