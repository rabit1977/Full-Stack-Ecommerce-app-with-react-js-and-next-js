'use client';

import { getProductsAction } from '@/actions/product-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { ProductWithRelations } from '@/lib/types';
import { formatPrice } from '@/lib/utils/formatters';
import { Check, Loader2, Plus } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState, useTransition } from 'react';

interface ProductPickerProps {
    onSelect: (product: ProductWithRelations) => void;
    // IDs of products to exclude (already selected)
    excludeIds?: string[];
    children?: React.ReactNode;
}

export function ProductPicker({ onSelect, excludeIds = [], children }: ProductPickerProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [debouncedQuery] = useDebounce(query, 500);
    const [products, setProducts] = useState<ProductWithRelations[]>([]);
    const [isPending, startTransition] = useTransition();

    const searchProducts = useCallback(() => {
        startTransition(async () => {
            const { products } = await getProductsAction({
                query: debouncedQuery,
                limit: 10,
                // Ensure we get products even if we don't have a query (recent products)
            });
            setProducts(products);
        });
    }, [debouncedQuery]);

    useEffect(() => {
        if (open) {
            searchProducts();
        }
    }, [open, debouncedQuery, searchProducts]);

    const handleSelect = (product: ProductWithRelations) => {
        onSelect(product);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="outline" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden gap-0 glass-card">
                <DialogHeader className="p-4 pb-0 glass-card">
                    <DialogTitle>Select Product</DialogTitle>
                <Command>
                    <CommandInput
                        placeholder="Search products..."
                        value={query}
                        onValueChange={setQuery}
                        
                        />
                    <CommandList className="max-h-[400px] overflow-y-auto p-2">
                        {isPending ? (
                            <div className="flex items-center justify-center p-8 text-muted-foreground">
                                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                Searching...
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No products found.</CommandEmpty>
                                <CommandGroup heading="Products">
                                    {products.map((product) => {
                                        const isSelected = excludeIds.includes(product.id);
                                        return (
                                            <CommandItem
                                            key={product.id}
                                            value={product.title}
                                            onSelect={() => !isSelected && handleSelect(product)}
                                            className={`flex items-center gap-3 p-2 rounded-lg mb-1 cursor-pointer transition-colors ${
                                                isSelected ? 'opacity-50 cursor-not-allowed bg-muted' : 'hover:bg-accent'
                                            }`}
                                            >
                                                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-background">
                                                    {product.images && product.images[0] ? (
                                                        <Image
                                                            src={product.images[0].url}
                                                            alt={product.title}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-muted">
                                                            <span className="text-xs">No img</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-1 flex-col">
                                                    <span className="font-medium truncate">{product.title}</span>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span>{formatPrice(product.price)}</span>
                                                        {product.category && (
                                                            <Badge variant="outline" className="text-[10px] h-4 px-1">
                                                                {product.category}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                {isSelected && <Check className="h-4 w-4 text-primary" />}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
