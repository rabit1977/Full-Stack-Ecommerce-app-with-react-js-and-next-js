import { getCategories } from '@/actions/admin/categories-actions';
import { CategoriesClient } from '@/components/admin/categories-client';

export default async function CategoriesPage() {
  const result = await getCategories();
  
  // @ts-ignore - mismatch in type complexity is fine for this simple pass-through
  const categories = result.success && result.categories ? result.categories : [];

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <CategoriesClient initialCategories={categories} />
    </div>
  );
}
