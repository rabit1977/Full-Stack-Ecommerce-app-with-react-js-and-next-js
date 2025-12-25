'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAppDispatch } from '@/lib/store/hooks';
import { addReview } from '@/lib/store/thunks/managementThunks';
import { Review } from '@/lib/types';
import { Star } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

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
  const { user } = useAuth();
  const dispatch = useAppDispatch();
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
    if (!user || rating === 0 || title.trim() === '' || comment.trim() === '') {
      return;
    }

    dispatch(addReview({
      productId,
      reviewData: {
        id: reviewToEdit?.id,
        author: user.name,
        rating,
        title,
        comment,
      },
    }));

    setRating(0);
    setTitle('');
    setComment('');
    onCancelEdit();
  };

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
                className={`h-6 w-6 cursor-pointer ${ 
                  starValue <= rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
                onClick={() => setRating(starValue)}
              />
            ))}
          </div>
        </div>
        <Input
          ref={inputRef}
          placeholder={'Review Title (e.g., "Great product!")'}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='bg-white dark:bg-slate-900 dark:text-white'
        />
        <Textarea
          placeholder='Share your thoughts on this product...'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className='min-h-[100px] bg-white dark:bg-slate-900 dark:text-white'
        />
        <div className='flex gap-2'>
          <Button
            type='submit'
            disabled={rating === 0 || title.trim() === '' || comment.trim() === ''}
          >
            {reviewToEdit ? 'Update Review' : 'Submit Review'}
          </Button>
          {reviewToEdit && (
            <Button type='button' variant='outline' onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

