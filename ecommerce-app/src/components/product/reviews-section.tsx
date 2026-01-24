'use client';

import { deleteReviewAction, toggleReviewHelpfulAction } from '@/actions/review-actions';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Stars } from '@/components/ui/stars';
import { ProductWithRelations, Review } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Pencil, ThumbsUp, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AddReviewForm } from './add-review-form';

interface ReviewsSectionProps {
  productId: string;
  product?: ProductWithRelations;
  helpfulReviews?: string[];
}

const ReviewsSection = ({
  productId,
  product: propsProduct,
  helpfulReviews = [],
}: ReviewsSectionProps) => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  // Use product from props (server-side) or default
  const product = propsProduct;

  // Memoize reviews to stabilize dependency
  const reviews = useMemo(() => product?.reviews || [], [product?.reviews]);

  // Find user's review
  const userReview = useMemo(() => {
    if (!user) return null;
    return reviews.find((review) => review.userId === user.id) || null;
  }, [reviews, user]);

  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [reviewIdToDelete, setReviewIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!product) return null;

  const handleEditClick = (review: Review) => {
    setEditingReview(review);
    // Scroll to form
    const formElement = document.getElementById('review-form-anchor');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handleToggleHelpful = async (reviewId: string) => {
    if (!user) {
      toast.error('Please login to mark reviews as helpful');
      return;
    }
    
    try {
      const result = await toggleReviewHelpfulAction(reviewId);
      if (result.success) {
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update helpful status');
      }
    } catch (error) {
      console.error('Error toggling helpful:', error);
    }
  };

  const handleDeleteReviewClick = (reviewId: string) => {
    setReviewIdToDelete(reviewId);
    setShowConfirmDeleteDialog(true);
  };

  const confirmDeleteReview = async () => {
    if (reviewIdToDelete) {
      setIsDeleting(true);
      try {
        const result = await deleteReviewAction(reviewIdToDelete, productId);
        if (result.success) {
          toast.success('Review deleted successfully');
          router.refresh();
        } else {
          toast.error(result.error || 'Failed to delete review');
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        toast.error('Something went wrong');
      } finally {
        setIsDeleting(false);
        setReviewIdToDelete(null);
        setShowConfirmDeleteDialog(false);
      }
    }
  };

  const canShowAddForm = user && !userReview && !editingReview;

  return (
    <div className='mt-12 py-12 border-t dark:border-slate-800' id="reviews">
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10'>
        <div>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white'>
            Customer Reviews
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} for this product
          </p>
        </div>
      </div>

      <div id="review-form-anchor" className="scroll-mt-24">
        {canShowAddForm && (
          <AddReviewForm
            productId={productId}
            reviewToEdit={null}
            onCancelEdit={handleCancelEdit}
          />
        )}

        {editingReview && (
          <AddReviewForm
            productId={productId}
            reviewToEdit={editingReview}
            onCancelEdit={handleCancelEdit}
          />
        )}
      </div>

      <div className='mt-10 space-y-8'>
        {reviews.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className='text-lg text-slate-500 dark:text-slate-400'>
              No reviews yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          reviews.map((review) => {
            const isHelpful = helpfulReviews.includes(review.id);
            const isUserReview = user && user.id === review.userId;
            
            return (
              <div 
                key={review.id} 
                className={cn(
                  'relative group p-6 rounded-2xl border transition-all duration-300',
                  isUserReview 
                    ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm'
                )}
              >
                {isUserReview && (
                  <div className="absolute top-6 right-6 flex items-center justify-center">
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 border-none px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold">
                      Your Review
                    </Badge>
                  </div>
                )}

                <div className='flex flex-col sm:flex-row gap-6'>
                  <div className='shrink-0'>
                    <Avatar className='w-14 h-14 rounded-2xl shadow-sm'>
                      <AvatarImage 
                        src={
                          (isUserReview && user?.image) 
                            ? (user.image.startsWith('http') || user.image.startsWith('/') ? user.image : `/${user.image}`)
                            : (review.user.image 
                                ? (review.user.image.startsWith('http') || review.user.image.startsWith('/') ? review.user.image : `/${review.user.image}`)
                                : undefined
                              )
                        } 
                        alt={review.user.name || 'User'} 
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-xl font-bold text-slate-600 dark:text-slate-300 rounded-2xl">
                        {(review.user.name || '?').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-3 mb-2'>
                      <h4 className='font-bold text-slate-900 dark:text-white truncate'>
                        {review.user.name || 'Verified Buyer'}
                      </h4>
                      <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />
                      <Stars value={review.rating} />
                    </div>

                    <h5 className='font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2 leading-tight'>
                      {review.title}
                    </h5>
                    
                    <p className='text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl'>
                      {review.comment}
                    </p>

                    <div className='mt-6 flex flex-wrap items-center justify-between gap-4'>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleToggleHelpful(review.id)}
                          disabled={isUserReview as boolean | undefined}
                          className={cn(
                            'flex items-center gap-2 text-sm font-medium transition-all px-3 py-1.5 rounded-lg',
                            isHelpful 
                              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
                            isUserReview && 'cursor-not-allowed opacity-50 grayscale'
                          )}
                        >
                          <ThumbsUp
                            className={cn('h-4 w-4', isHelpful && 'fill-current')}
                          />
                          <span>Helpful ({review.helpful || 0})</span>
                        </button>
                      </div>

                      {isUserReview && !editingReview && (
                        <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleEditClick(review)}
                            className='h-9 gap-2 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5'
                          >
                            <Pencil className='h-4 w-4' />
                            Edit
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDeleteReviewClick(review.id)}
                            className='h-9 gap-2 text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
                          >
                            <Trash2 className='h-4 w-4' />
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Dialog
        open={showConfirmDeleteDialog}
        onOpenChange={setShowConfirmDeleteDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Delete Review?</DialogTitle>
            <DialogDescription className="pt-2 text-slate-500 dark:text-slate-400">
              Are you sure you want to delete your review? This action will permanently remove your feedback from this product.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-2 sm:gap-0">
            <Button
              variant='outline'
              onClick={() => setShowConfirmDeleteDialog(false)}
              disabled={isDeleting}
              className="flex-1 sm:flex-none"
            >
              Keep Review
            </Button>
            <Button 
              variant='destructive' 
              onClick={confirmDeleteReview}
              disabled={isDeleting}
              className="flex-1 sm:flex-none shadow-lg shadow-red-500/20"
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { ReviewsSection };

