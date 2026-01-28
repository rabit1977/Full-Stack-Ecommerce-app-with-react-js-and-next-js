import { getGiftCards } from '@/actions/admin/gift-cards-actions';
import { GiftCardsClient } from '@/components/admin/gift-cards-client';

export default async function GiftCardsPage() {
  const result = await getGiftCards();
  
  // @ts-ignore
  const giftCards = result.success && result.giftCards ? result.giftCards : [];

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <GiftCardsClient initialGiftCards={giftCards} />
    </div>
  );
}
