'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronLeftIcon,
  ChevronRight,
  ChevronRightIcon,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export function PaginationControls({
  currentPage,
  totalPages,
  hasPreviousPage,
  hasNextPage,
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  const handlePageSizeChange = (size: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('limit', size);
    params.set('page', '1'); // Reset to first page
    router.push(`?${params.toString()}`);
  };

  const limit = searchParams.get('limit') || '12';

  return (
    <div className='flex items-center justify-between px-2 '>
      <div className='flex items-center space-x-6 lg:space-x-8 mx-auto'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium hidden'>Rows per page</p>
          <Select value={limit} onValueChange={handlePageSizeChange}>
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[12, 24, 36, 48, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium '>
          Page {currentPage} of {totalPages}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => handlePageChange(1)}
            disabled={!hasPreviousPage}
          >
            <span className='sr-only'>Go to first page</span>
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPreviousPage}
          >
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
          >
            <span className='sr-only'>Go to next page</span>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => handlePageChange(totalPages)}
            disabled={!hasNextPage}
          >
            <span className='sr-only'>Go to last page</span>
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
