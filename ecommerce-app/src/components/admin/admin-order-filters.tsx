'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Calendar, Check, Filter, RotateCcw, Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Processing', value: 'Processing' },
  { label: 'Shipped', value: 'Shipped' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Cancelled', value: 'Cancelled' },
];

const DATE_OPTIONS = [
  { label: 'All Time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: '7days' },
  { label: 'Last 30 Days', value: '30days' },
  { label: 'Last 3 Months', value: '3months' },
];

export function AdminOrderFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [date, setDate] = useState(searchParams.get('date') || 'all');
  const [query, setQuery] = useState(searchParams.get('q') || '');

  // Update local state if URL params change externally
  useEffect(() => {
    setStatus(searchParams.get('status') || 'all');
    setDate(searchParams.get('date') || 'all');
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('page');

      Object.entries(params).forEach(([name, value]) => {
        if (value === null || value === 'all' || value === '') {
          newSearchParams.delete(name);
        } else {
          newSearchParams.set(name, value);
        }
      });

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const handleApply = () => {
    const queryString = createQueryString({
      status,
      date,
      q: query,
    });
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
    setIsOpen(false);
  };

  const handleReset = () => {
    setStatus('all');
    setDate('all');
    setQuery('');
    router.push(pathname);
    setIsOpen(false);
  };

  const activeFiltersCount = [
    status !== 'all',
    date !== 'all',
    query !== '',
  ].filter(Boolean).length;

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
         {/* Active Filter Indicators could go here if needed */}
      </div>
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant='outline' 
            size='default' 
            className={cn(
              'rounded-xl px-6 h-12 border-border/60 hover:bg-white/50 dark:hover:bg-slate-800 backdrop-blur-sm shadow-sm transition-all',
              activeFiltersCount > 0 && 'border-primary/50 bg-primary/5 text-primary'
            )}
          >
            <Filter className='h-4 w-4 mr-2' />
            {activeFiltersCount > 0 ? `Filters (${activeFiltersCount})` : 'Filter Orders'}
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-md border-l border-border/50 bg-background/95 backdrop-blur-xl p-0">
          <SheetHeader className="px-6 py-6 border-b border-border/50">
            <SheetTitle className="text-2xl font-black flex items-center gap-2">
               <Filter className="h-5 w-5 text-primary" />
               Management Filters
            </SheetTitle>
            <SheetDescription className="text-base text-muted-foreground font-medium">
              Search and filter all customer orders.
            </SheetDescription>
          </SheetHeader>

          <div className="px-6 py-8 pb-36 space-y-8 overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* Search Query */}
            <div className="space-y-3">
              <Label htmlFor="admin-order-search" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                 <Search className="h-3.5 w-3.5" />
                 Global Search
              </Label>
              <div className="relative group">
                <Input
                  id="admin-order-search"
                  placeholder="ID, Name, Email or Address..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                  className="h-12 pl-10 rounded-xl bg-secondary/30 border-border/50 focus:bg-background transition-all"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                {query && (
                  <button 
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Order Status</Label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStatus(opt.value)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all text-left",
                      status === opt.value 
                        ? "bg-primary/10 border-primary text-primary shadow-sm shadow-primary/10" 
                        : "bg-secondary/30 border-transparent hover:border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {opt.label}
                    {status === opt.value && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                Time period
              </Label>
              <Select value={date} onValueChange={setDate}>
                <SelectTrigger className="h-12 rounded-xl bg-secondary/30 border-border/50 focus:ring-primary/20">
                  <SelectValue placeholder="Select a timeframe" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  {DATE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="rounded-lg">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-md border-t border-border/50 flex flex-col sm:flex-row gap-3">
            <Button 
              variant="ghost" 
              onClick={handleReset} 
              className="flex-1 h-12 rounded-xl font-bold hover:bg-secondary"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={handleApply} 
              className="flex-1 h-12 rounded-xl font-bold btn-premium shadow-lg shadow-primary/20"
            >
              Apply All Filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
