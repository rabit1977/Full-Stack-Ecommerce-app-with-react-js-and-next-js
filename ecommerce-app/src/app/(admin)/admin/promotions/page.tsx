import { getPromotions } from '@/actions/admin/promotions-actions';
import { PromotionsClient } from '@/components/admin/promotions-client';

export default async function PromotionsPage() {
  const result = await getPromotions();
  
  // @ts-ignore
  const promotions = result.success && result.promotions ? result.promotions : [];

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <PromotionsClient initialPromotions={promotions} />
    </div>
  );
}
