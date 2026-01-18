'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { addOrUpdateReviewAction } from '@/actions/review-actions';
import { Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
}

interface AddReviewFormProps {
  productId: string;
  reviewToEdit?: Review | null;
  onCancelEdit: () => void;
}

export const AddReviewForm = ({
  productId,
  reviewToEdit,
  onCancelEdit,
}: AddReviewFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(reviewToEdit?.rating || 0);
  const [title, setTitle] = useState(reviewToEdit?.title || '');
  const [comment, setComment] = useState(reviewToEdit?.comment || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (reviewToEdit) {
      setRating(reviewToEdit.rating);
      setTitle(reviewToEdit.title);
      setComment(reviewToEdit.comment);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      setRating(0);
      setTitle('');
      setComment('');
    }
  }, [reviewToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to write a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (title.trim() === '' || comment.trim() === '') {
      toast.error('Please fill in all fields');
      return;
    }

    startTransition(async () => {
      try {
        const result = await addOrUpdateReviewAction(productId, {
          rating,
          title: title.trim(),
          comment: comment.trim(),
        });

        if (result.success) {
          toast.success(reviewToEdit ? 'Review updated!' : 'Review submitted!', {
            description: 'Thank you for your feedback',
          });

          // Reset form
          setRating(0);
          setTitle('');
          setComment('');
          onCancelEdit();

          // Refresh to show new review
          router.refresh();
        } else {
          toast.error(result.error || 'Failed to submit review');
        }
      } catch (error) {
        console.error('Review submission error:', error);
        toast.error('Something went wrong. Please try again.');
      }
    });
  };

  if (!user) {
    return (
      <div className='mt-8 p-6 bg-slate-100 rounded-lg dark:bg-slate-800 text-center'>
        <p className='text-slate-600 dark:text-slate-400'>
          Please login to write a review
        </p>
      </div>
    );
  }

  return (
    <div className='mt-8 p-6 bg-slate-100 rounded-lg dark:bg-slate-800'>
      <h3 className='text-lg font-semibold dark:text-white'>
        {reviewToEdit ? 'Edit Your Review' : 'Write a Review'}
      </h3>
      <form onSubmit={handleSubmit} className='mt-4 space-y-4'>
        <div>
          <p className="mb-2 font-medium dark:text-slate-300">Your Rating</p>
          <div className='flex items-center gap-1'>
            {[1, 2, 3, 4, 5].map((starValue) => (
              <Star
                key={starValue}
                className={`h-6 w-6 cursor-pointer transition-colors ${ 
                  starValue <= rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-slate-300 dark:text-slate-600 hover:text-yellow-200'
                }`}
                onClick={() => setRating(starValue)}
              />
            ))}
            {rating > 0 && (
              <span className='ml-2 text-sm text-slate-600 dark:text-slate-400'>
                {rating} out of 5
              </span>
            )}
          </div>
        </div>
        <Input
          ref={inputRef}
          placeholder='Review Title (e.g., "Great product!")'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='bg-white dark:bg-slate-900 dark:text-white'
          disabled={isPending}
        />
        <Textarea
          placeholder='Share your thoughts on this product...'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className='min-h-[100px] bg-white dark:bg-slate-900 dark:text-white'
          disabled={isPending}
        />
        <div className='flex gap-2'>
          <Button
            type='submit'
            disabled={isPending || rating === 0 || title.trim() === '' || comment.trim() === ''}
          >
            {isPending ? 'Submitting...' : reviewToEdit ? 'Update Review' : 'Submit Review'}
          </Button>
          {reviewToEdit && (
            <Button 
              type='button' 
              variant='outline' 
              onClick={onCancelEdit}
              disabled={isPending}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};