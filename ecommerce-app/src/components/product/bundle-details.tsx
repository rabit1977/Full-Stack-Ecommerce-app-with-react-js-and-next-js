'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductWithRelations } from '@/lib/types';
import { formatPrice } from '@/lib/utils/formatters';
import { Check, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface BundleDetailsProps {
    product: ProductWithRelations;
}

export function BundleDetails({ product }: BundleDetailsProps) {
    if (!product.inBundles || product.inBundles.length === 0) return null;

    // Calculate total value of individual items
    const totalValue = product.inBundles.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
    }, 0);

    const savings = totalValue - product.price;
    const savingsPercent = Math.round((savings / totalValue) * 100);

    return (
        <Card className="rounded-3xl border-2 border-primary/10 overflow-hidden">
            <CardHeader className="bg-primary/5 pb-4">
                <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Package className="h-5 w-5" />
                     </div>
                     <div>
                        <CardTitle className="text-xl">Bundle Contents</CardTitle>
                        <p className="text-sm text-muted-foreground">This kit includes {product.inBundles.length} items</p>
                     </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                    {product.inBundles.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-secondary/20 transition-colors">
                            <div className="relative h-16 w-16 shrink-0 rounded-xl border border-border bg-background overflow-hidden">
                                {item.product.images && item.product.images[0] ? (
                                    <Image
                                        src={item.product.images[0].url}
                                        alt={item.product.title}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-muted">
                                        <span className="text-xs text-muted-foreground">No img</span>
                                    </div>
                                )}
                                <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-tl-lg">
                                    x{item.quantity}
                                </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <Link href={`/products/${item.product.id}`} className="font-semibold hover:underline hover:text-primary transition-colors truncate block">
                                    {item.product.title}
                                </Link>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm text-muted-foreground">{formatPrice(item.product.price)} each</span>
                                    <Badge variant="outline" className="text-[10px] h-5 px-1.5 gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                                        <Check className="h-3 w-3" /> Included
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {savings > 0 && (
                     <div className="bg-emerald-500/10 p-4 flex items-center justify-between">
                        <span className="text-emerald-700 font-semibold dark:text-emerald-400">Total Value</span>
                        <div className="flex items-center gap-2">
                             <span className="text-muted-foreground line-through text-sm">{formatPrice(totalValue)}</span>
                             <span className="font-bold text-emerald-700 dark:text-emerald-400">Save {formatPrice(savings)} ({savingsPercent}%)</span>
                        </div>
                     </div>
                )}
            </CardContent>
        </Card>
    );
}
