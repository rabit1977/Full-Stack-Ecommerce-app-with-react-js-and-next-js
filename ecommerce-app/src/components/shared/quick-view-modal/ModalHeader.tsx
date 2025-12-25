import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Heart, Share2, X } from 'lucide-react';

interface ModalHeaderProps {
  onClose: () => void;
  onToggleWishlist: () => void;
  isWished: boolean;
  onShare?: () => void;
}

export const ModalHeader = ({
  onClose,
  onToggleWishlist,
  isWished,
  onShare,
}: ModalHeaderProps) => {
  return (
    <div className='absolute top-4 right-4 flex items-center gap-2 z-10'>
      {onShare && (
        <Button
          variant='secondary'
          size='icon'
          onClick={onShare}
          className='h-9 w-9 rounded-full shadow-md'
          title='Share product'
        >
          <Share2 className='h-4 w-4' />
        </Button>
      )}
      <Button
        variant='secondary'
        size='icon'
        onClick={onToggleWishlist}
        className='h-9 w-9 rounded-full shadow-md'
        title={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          className={cn('h-4 w-4', isWished && 'fill-red-500 text-red-500')}
        />
      </Button>
      <Button
        variant='secondary'
        size='icon'
        onClick={onClose}
        className='h-9 w-9 rounded-full shadow-md'
        title='Close'
      >
        <X className='h-4 w-4' />
      </Button>
    </div>
  );
};
