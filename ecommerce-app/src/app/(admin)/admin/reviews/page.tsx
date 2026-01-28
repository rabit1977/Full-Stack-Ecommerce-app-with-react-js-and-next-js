import { getAllReviewsAction } from '@/actions/review-actions';
import { ReviewsClient } from '@/components/admin/reviews-client';
import { Star } from 'lucide-react';

export const metadata = {
  title: 'Admin Reviews | ElectroAdmin',
  description: 'Manage product reviews',
};

interface AdminReviewsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function AdminReviewsPage(props: AdminReviewsPageProps) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || '';

  const { reviews, total, pages } = await getAllReviewsAction(page, 10, search);

  return (
    <div className='space-y-6 sm:space-y-8 pb-20'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground flex items-center gap-2 sm:gap-3 flex-wrap'>
            <Star className="h-8 w-8 text-primary fill-primary" />
            Reviews Management
            <span className='inline-flex items-center justify-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-inset ring-primary/20'>
              {total || 0}
            </span>
          </h1>
          <p className='text-sm sm:text-lg text-muted-foreground font-medium'>
            Moderate customer feedback and respond to reviews.
          </p>
        </div>
      </div>

      <ReviewsClient 
        reviews={reviews || []} 
        total={total || 0} 
        pages={pages || 1} 
      />
    </div>
  );
}
