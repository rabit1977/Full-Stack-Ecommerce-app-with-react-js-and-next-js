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
import { Briefcase, Filter, Package, RotateCcw, Search, Tag, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface AdminProductFiltersProps {
  categories: string[];
  brands: string[];
}

export function AdminProductFilters({ categories, brands }: AdminProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [brand, setBrand] = useState(searchParams.get('brand') || 'all');
  const [stock, setStock] = useState(searchParams.get('stock') || 'all');

  // Update local state if URL params change externally
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setCategory(searchParams.get('category') || 'all');
    setBrand(searchParams.get('brand') || 'all');
    setStock(searchParams.get('stock') || 'all');
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
      q: query,
      category,
      brand,
      stock,
    });
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
    setIsOpen(false);
  };

  const handleReset = () => {
    setQuery('');
    setCategory('all');
    setBrand('all');
    setStock('all');
    router.push(pathname);
    setIsOpen(false);
  };

  const activeFiltersCount = [
    query !== '',
    category !== 'all',
    brand !== 'all',
    stock !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
         {/* Could show breadcrumbs or small status indicators here */}
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
            {activeFiltersCount > 0 ? `Filters (${activeFiltersCount})` : 'Filter Products'}
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-md border-l border-border/50 bg-background/95 backdrop-blur-xl p-0">
          <SheetHeader className="px-6 py-6 border-b border-border/50">
            <SheetTitle className="text-2xl font-black flex items-center gap-2">
               <Package className="h-5 w-5 text-primary" />
               Catalog Filters
            </SheetTitle>
            <SheetDescription className="text-base text-muted-foreground font-medium">
              Refine your product search and inventory management.
            </SheetDescription>
          </SheetHeader>

          <div className="px-6 py-8 pb-36 space-y-8 overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* Search Query */}
            <div className="space-y-3">
              <Label htmlFor="admin-product-search" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                 <Search className="h-3.5 w-3.5" />
                 Keyword Search
              </Label>
              <div className="relative group">
                <Input
                  id="admin-product-search"
                  placeholder="Title, brand, or category..."
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

            {/* Category selection */}
            <div className="space-y-3">
              <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Tag className="h-3.5 w-3.5" />
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 rounded-xl bg-secondary/30 border-border/50">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brand selection */}
            <div className="space-y-3">
              <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5" />
                Brand
              </Label>
              <Select value={brand} onValueChange={setBrand}>
                <SelectTrigger className="h-12 rounded-xl bg-secondary/30 border-border/50">
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stock Level selection */}
            <div className="space-y-3">
              <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Package className="h-3.5 w-3.5" />
                Inventory Status
              </Label>
              <Select value={stock} onValueChange={setStock}>
                <SelectTrigger className="h-12 rounded-xl bg-secondary/30 border-border/50">
                  <SelectValue placeholder="Any Stock Level" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  <SelectItem value="all">Any Stock</SelectItem>
                  <SelectItem value="in">In Stock (10+)</SelectItem>
                  <SelectItem value="low">Low Stock (&lt;10)</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
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
