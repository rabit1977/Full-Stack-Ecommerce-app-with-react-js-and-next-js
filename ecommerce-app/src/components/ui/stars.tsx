import { cn } from '@/lib/utils';
import { Star, StarHalf } from 'lucide-react';

interface StarsProps {
  value: number;
  className?: string;
}

export const Stars = ({ value, className }: StarsProps) => {
  return (
    <div className={cn('flex items-center gap-0.5 text-yellow-400', className)}>
      {Array.from({ length: Math.floor(value) }).map((_, i) => (
        <Star key={`f${i}`} className="h-4 w-4 fill-current" />
      ))}
      {value % 1 >= 0.5 && <StarHalf className="h-4 w-4 fill-current" />}
      {Array.from({ length: 5 - Math.ceil(value) }).map((_, i) => (
        <Star key={`e${i}`} className="h-4 w-4 text-gray-300 dark:text-gray-600 fill-current" />
      ))}
    </div>
  );
};