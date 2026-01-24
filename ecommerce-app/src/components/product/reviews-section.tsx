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
      <div className='mt-16 sm:mt-24 py-16 border-t border-border/40' id="reviews">
      <div className='grid lg:grid-cols-12 gap-12 lg:gap-16 items-start'>
        
        {/* Left Column: Rating Snapshot */}
        <div className='lg:col-span-4 space-y-8 lg:sticky lg:top-24'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight text-foreground'>
              Customer Reviews
            </h2>
             <div className='mt-6 flex items-baseline gap-4'>
                <span className='text-6xl font-extrabold tracking-tighter text-foreground'>
                   {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
                </span>
                <div className='flex flex-col'>
                  <Stars value={reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0} className='h-5 w-5' />
                  <span className='text-sm text-muted-foreground mt-1'>
                    Based on {reviews.length} reviews
                  </span>
                </div>
             </div>
          </div>

          {/* Rating Distribution */}
          <div className='space-y-3'>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter(r => r.rating === star).length;
              const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className='flex items-center gap-3 text-sm'>
                  <span className='w-3 font-medium text-muted-foreground'>{star}</span>
                  <div className='h-4 w-4 text-amber-500 fill-amber-500'>
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                       <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                     </svg>
                  </div>
                  <div className='flex-1 h-2.5 bg-secondary rounded-full overflow-hidden'>
                    <div 
                      className='h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full' 
                      style={{ width: `${percent}%` }} 
                    />
                  </div>
                  <span className='w-8 text-right text-muted-foreground tabular-nums font-medium'>
                    {Math.round(percent)}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Call to Action - Only show if user can review */}
          {canShowAddForm && (
             <div className='p-6 bg-gradient-to-br from-muted/50 to-muted/10 rounded-2xl border border-border/50 text-center'>
               <h3 className='font-semibold'>Share your thoughts</h3>
               <p className='text-sm text-muted-foreground mt-2 mb-4'>
                 If you’ve used this product, share your thoughts with other customers.
               </p>
               <Button 
                 onClick={() => {
                    const formElement = document.getElementById('review-form-anchor');
                    if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                 }}
                 className='w-full rounded-xl font-semibold'
                 variant='outline'
               >
                 Write a Review
               </Button>
             </div>
          )}
        </div>

        {/* Right Column: Review List & Form */}
        <div className='lg:col-span-8 space-y-10'>
          
          <div id="review-form-anchor" className="scroll-mt-24">
            {canShowAddForm && (
              <div className="mb-10 p-6 sm:p-8 card-premium">
                 <h3 className='text-xl font-bold mb-6'>Write a Review</h3>
                 <AddReviewForm
                  productId={productId}
                  reviewToEdit={null}
                  onCancelEdit={handleCancelEdit}
                />
              </div>
            )}

            {editingReview && (
              <div className="mb-10 p-6 sm:p-8 card-premium ring-2 ring-primary/20">
                <div className="flex items-center justify-between mb-6">
                   <h3 className='text-xl font-bold'>Edit your Review</h3>
                   <Button variant='ghost' size='sm' onClick={handleCancelEdit}>Cancel</Button>
                </div>
                <AddReviewForm
                  productId={productId}
                  reviewToEdit={editingReview}
                  onCancelEdit={handleCancelEdit}
                />
              </div>
            )}
          </div>

          <div className='space-y-6'>
            {reviews.length === 0 ? (
              <div className="bg-muted/30 rounded-3xl p-16 text-center border-2 border-dashed border-muted">
                <div className='mx-auto h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4'>
                   <Pencil className='h-6 w-6 text-muted-foreground' />
                </div>
                <h3 className='text-xl font-semibold mb-2'>No reviews yet</h3>
                <p className='text-muted-foreground max-w-sm mx-auto'>
                  Be the first to share your experience with this product. Your feedback helps others make better choices!
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
                      'group relative p-6 sm:p-8 card-premium transition-all duration-300',
                      isUserReview 
                        ? 'border-primary/20 bg-primary/5' 
                        : ''
                    )}
                  >
                    <div className='flex flex-col sm:flex-row gap-6'>
                      <div className='shrink-0'>
                        <Avatar className='w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-background shadow-sm'>
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
                          <AvatarFallback className="bg-gradient-to-br from-muted to-muted/80 text-lg font-bold text-muted-foreground rounded-2xl">
                            {(review.user.name || '?').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className='flex-1 min-w-0'>
                        <div className='flex flex-wrap items-center justify-between gap-4 mb-3'>
                          <div>
                            <h4 className='font-bold text-foreground text-lg truncate'>
                              {review.user.name || 'Verified Buyer'}
                            </h4>
                            <div className='flex items-center gap-2 mt-1 text-xs text-muted-foreground'>
                               {/* Date could go here if available in Review object */}
                               <span>Verified Purchase</span>
                            </div>
                          </div>
                          {isUserReview && (
                             <Badge variant='secondary' className="bg-primary/10 text-primary hover:bg-primary/20 border-none transition-colors">
                               You
                             </Badge>
                          )}
                        </div>

                        <div className='mb-4'>
                          <Stars value={review.rating} className="w-[18px] h-[18px]" />
                        </div>

                        <h5 className='font-bold text-xl text-foreground mb-3 leading-tight'>
                          {review.title}
                        </h5>
                        
                        <p className='text-muted-foreground leading-relaxed max-w-3xl'>
                          {review.comment}
                        </p>

                        <div className='mt-8 pt-6 border-t border-border/50 flex flex-wrap items-center justify-between gap-4'>
                          <button
                            onClick={() => handleToggleHelpful(review.id)}
                            disabled={isUserReview as boolean | undefined}
                            className={cn(
                              'flex items-center gap-2.5 text-sm font-medium transition-all px-4 py-2 rounded-full',
                              isHelpful 
                                ? 'text-primary bg-primary/10 font-semibold' 
                                : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                              isUserReview && 'cursor-not-allowed opacity-50'
                            )}
                          >
                            <ThumbsUp
                              className={cn('h-4 w-4', isHelpful && 'fill-current')}
                            />
                            <span>Helpful {review.helpful > 0 && `(${review.helpful})`}</span>
                          </button>

                          {isUserReview && !editingReview && (
                            <div className='flex items-center gap-2'>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => handleEditClick(review)}
                                className='h-8 px-3 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary'
                              >
                                <Pencil className='h-3.5 w-3.5 mr-2' />
                                Edit
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => handleDeleteReviewClick(review.id)}
                                className='h-8 px-3 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                              >
                                <Trash2 className='h-3.5 w-3.5 mr-2' />
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
        </div>
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

