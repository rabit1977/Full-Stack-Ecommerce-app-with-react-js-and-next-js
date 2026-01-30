import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CategoryFilterProps } from '@/lib/types/filter';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Folder } from 'lucide-react';
import { useMemo, useState } from 'react';

/**
 * Format category label for display
 */
const formatLabel = (text: string): string => {
  return text
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const CategoryFilter = ({
  categories,
  selectedCategories,
  selectedSubCategories,
  onCategoryToggle,
  onSubCategoryToggle,
  isPending,
  showFilterCount = true,
}: CategoryFilterProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const activeFilterCount = useMemo(() => {
    return selectedCategories.size + selectedSubCategories.size;
  }, [selectedCategories, selectedSubCategories]);

  const shouldShowBadge = showFilterCount && activeFilterCount > 0;
  const isShowingAll = activeFilterCount === 0;

  const handleShowAll = () => {
    selectedCategories.forEach(cat => onCategoryToggle(cat, false));
    selectedSubCategories.forEach(sub => onSubCategoryToggle(sub, false));
  };

  const toggleExpanded = (name: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(name)) {
      newExpanded.delete(name);
    } else {
      newExpanded.add(name);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <AccordionItem value='category' className="border-none">
      <AccordionTrigger
        className={cn(
          'py-4 text-base font-semibold hover:no-underline transition-all',
          isPending && 'opacity-50 cursor-not-allowed'
        )}
        disabled={isPending}
      >
        <div className='flex items-center gap-2.5'>
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
             <Folder className="w-4 h-4 fill-current" />
          </div>
          <span>Category</span>
          {shouldShowBadge && (
            <Badge 
              variant='default' 
              className='h-5 px-1.5 text-[10px] font-bold bg-primary text-primary-foreground rounded-full'
            >
              {activeFilterCount}
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      
      <AccordionContent className="pb-6">
        <div className='space-y-3 pt-1'>
          {/* All Categories Button */}
          <Button
            variant={isShowingAll ? 'secondary' : 'ghost'}
            onClick={handleShowAll}
            className={cn(
              'w-full justify-start h-9 px-3 rounded-xl transition-all border border-transparent',
              isShowingAll ? 'bg-primary/5 text-primary border-primary/20 font-bold' : 'text-muted-foreground hover:text-foreground'
            )}
            disabled={isPending}
          >
            All Products
          </Button>

          <div className='space-y-1 mt-2'>
            {categories.map((category) => {
              if (typeof category === 'string') {
                if (category === 'all') return null;
                const isChecked = selectedCategories.has(category);
                const label = formatLabel(category);
                
                return (
                  <label
                    key={category}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all hover:bg-muted/50 group',
                      isChecked && 'bg-primary/5 text-primary'
                    )}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => onCategoryToggle(category, checked as boolean)}
                      disabled={isPending}
                      className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className='text-sm flex-1 font-medium'>{label}</span>
                  </label>
                );
              }

              // Hierarchical Category
              const isMainChecked = selectedCategories.has(category.name);
              const isExpanded = expandedCategories.has(category.name);
              const hasSelectedSub = category.subCategories.some(sub => selectedSubCategories.has(sub));
              
              return (
                <div key={category.name} className="space-y-1">
                  <div className={cn(
                    'flex items-center gap-1 px-1 rounded-xl transition-all group',
                    (isMainChecked || hasSelectedSub) && 'bg-primary/5'
                  )}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:bg-transparent"
                      onClick={() => toggleExpanded(category.name)}
                    >
                      {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    </Button>
                    
                    <label
                      className={cn(
                        'flex flex-1 items-center gap-3 py-2 cursor-pointer transition-all',
                        isMainChecked ? 'text-primary font-bold' : 'text-foreground font-medium'
                      )}
                    >
                      <Checkbox
                        checked={isMainChecked}
                        onCheckedChange={(checked) => onCategoryToggle(category.name, checked as boolean)}
                        disabled={isPending}
                        className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className='text-sm flex-1'>{formatLabel(category.name)}</span>
                    </label>
                  </div>

                  {isExpanded && category.subCategories.length > 0 && (
                    <div className="ml-9 space-y-1 border-l border-border/60 pl-2 mt-1">
                      {category.subCategories.map(sub => {
                        const isSubChecked = selectedSubCategories.has(sub);
                        return (
                          <label
                            key={sub}
                            className={cn(
                              'flex items-center gap-3 px-3 py-1.5 rounded-lg cursor-pointer transition-all hover:bg-muted/50',
                              isSubChecked ? 'text-primary font-bold' : 'text-muted-foreground'
                            )}
                          >
                            <Checkbox
                              checked={isSubChecked}
                              onCheckedChange={(checked) => onSubCategoryToggle(sub, checked as boolean)}
                              disabled={isPending}
                              className="w-3.5 h-3.5 rounded-[4px] border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <span className='text-xs flex-1'>{formatLabel(sub)}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};