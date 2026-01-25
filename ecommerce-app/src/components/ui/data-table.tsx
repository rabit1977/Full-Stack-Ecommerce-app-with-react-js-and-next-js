'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string | ReactNode;
    cell: (item: T) => ReactNode;
    className?: string;
    /** Hide this column on mobile */
    hiddenOnMobile?: boolean;
    /** Minimum width for this column */
    minWidth?: string;
  }[];
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  /** Custom class for the wrapper */
  className?: string;
}

/**
 * Enhanced DataTable with mobile-responsive design
 * - Horizontal scroll on mobile for wide tables
 * - Optional column hiding on mobile
 * - Better touch targets
 */
export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = 'No results.',
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('rounded-xl border bg-card overflow-hidden shadow-sm', className)}>
      {/* Scrollable container for mobile */}
      <div className='overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent'>
        <Table className='min-w-full'>
          <TableHeader className='bg-muted/50'>
            <TableRow className='hover:bg-transparent'>
              {columns.map((col, index) => (
                <TableHead 
                  key={index} 
                  className={cn(
                    'whitespace-nowrap text-xs font-bold uppercase tracking-wider text-muted-foreground py-3 px-3 sm:px-4',
                    col.hiddenOnMobile && 'hidden md:table-cell',
                    col.className
                  )}
                  style={{ minWidth: col.minWidth }}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow 
                  key={keyExtractor(item)}
                  className='hover:bg-muted/30 transition-colors'
                >
                  {columns.map((col, index) => (
                    <TableCell 
                      key={index} 
                      className={cn(
                        'py-3 px-3 sm:px-4 text-sm',
                        col.hiddenOnMobile && 'hidden md:table-cell',
                        col.className
                      )}
                    >
                      {col.cell(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-32 text-center text-muted-foreground'
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
