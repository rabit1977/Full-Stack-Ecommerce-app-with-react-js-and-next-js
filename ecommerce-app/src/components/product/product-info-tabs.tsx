'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductWithRelations } from '@/lib/types';
import {
    Box,
    FileText,
    Globe,
    Layers,
    Ruler,
    Scale,
    ShieldCheck
} from 'lucide-react';

interface ProductInfoTabsProps {
  product: ProductWithRelations;
}

export function ProductInfoTabs({ product }: ProductInfoTabsProps) {
  // Parse dimensions if they exist
  const dimensions = product.dimensions as { length?: number; width?: number; height?: number } | null;
  const hasDimensions = dimensions && (dimensions.length || dimensions.width || dimensions.height);
  
  // Parse specifications
  const specs = Array.isArray(product.specifications) 
    ? product.specifications 
    : [];
    
  // Check if we have any specs to show
  const hasSpecs = specs.length > 0 || hasDimensions || product.weight;

  return (
    <div className='w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200'>
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-muted/30 backdrop-blur rounded-xl border border-border/40 gap-1 no-scrollbar">
          <TabsTrigger 
            value="description" 
            className="rounded-lg py-2.5 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary gap-2"
          >
            <FileText className="h-4 w-4" />
            Description
          </TabsTrigger>
          {hasSpecs && (
            <TabsTrigger 
              value="specifications" 
              className="rounded-lg py-2.5 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary gap-2"
            >
              <Layers className="h-4 w-4" />
              Specifications
            </TabsTrigger>
          )}
          <TabsTrigger 
            value="shipping" 
            className="rounded-lg py-2.5 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary gap-2"
          >
            <Box className="h-4 w-4" />
            Shipping & Returns
          </TabsTrigger>
        </TabsList>

        {/* Description Tab */}
        <TabsContent value="description" className="space-y-6 mt-6">
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-sm sm:text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                  {product.description}
                </p>
              </div>
              
              {/* Quick Feature Highlights from tags or categories could go here */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.brand && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30 border border-border/50">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Brand</p>
                      <p className="text-base font-semibold">{product.brand}</p>
                    </div>
                  </div>
                )}
                {product.category && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30 border border-border/50">
                     <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Category</p>
                      <p className="text-base font-semibold">{product.category}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Specifications Tab */}
        {hasSpecs && (
          <TabsContent value="specifications" className="space-y-6 mt-6">
            <Card className="border-border/40 shadow-sm">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40">
                  
                  {/* Technical Specs */}
                  {specs.length > 0 && (
                    <div className="p-6 sm:p-8 space-y-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Layers className="h-5 w-5 text-primary" />
                        Technical Details
                      </h3>
                      <div className="space-y-4">
                        {specs.map((spec, idx) => (
                          <div 
                            key={idx} 
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-border/40 last:border-0 gap-1 sm:gap-4"
                          >
                            <span className="text-sm font-medium text-muted-foreground sm:w-1/3">
                              {spec.key}
                            </span>
                            <span className="text-sm font-semibold sm:w-2/3 sm:text-right">
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Physical Dimensions */}
                  {(hasDimensions || product.weight) && (
                    <div className="p-6 sm:p-8 space-y-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Ruler className="h-5 w-5 text-primary" />
                        Physical Dimensions
                      </h3>
                      <div className="grid gap-4">
                        {product.weight && (
                          <div className="p-4 rounded-xl bg-secondary/20 border border-border/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Scale className="h-5 w-5 text-muted-foreground" />
                              <span className="text-sm font-medium">Weight</span>
                            </div>
                            <span className="font-semibold">{product.weight} kg</span>
                          </div>
                        )}
                        
                        {hasDimensions && (
                          <div className="space-y-3 pt-2">
                            {dimensions?.length && (
                              <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-secondary/30 transition-colors">
                                <span className="text-sm text-muted-foreground">Length</span>
                                <span className="font-mono text-sm">{dimensions.length} cm</span>
                              </div>
                            )}
                            {dimensions?.width && (
                              <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-secondary/30 transition-colors">
                                <span className="text-sm text-muted-foreground">Width</span>
                                <span className="font-mono text-sm">{dimensions.width} cm</span>
                              </div>
                            )}
                            {dimensions?.height && (
                              <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-secondary/30 transition-colors">
                                <span className="text-sm text-muted-foreground">Height</span>
                                <span className="font-mono text-sm">{dimensions.height} cm</span>
                              </div>
                            )}
                            
                            {/* Visual Box Representation (Abstract) */}
                            <div className="mt-6 flex justify-center p-6 bg-secondary/10 rounded-xl border border-dashed border-border/60">
                               <div className="relative w-24 h-24 border-2 border-primary/30 rounded-lg flex items-center justify-center transform hover:rotate-12 transition-transform duration-500">
                                  <Box className="h-10 w-10 text-primary/50" />
                                  <div className="absolute -bottom-6 text-[10px] text-muted-foreground font-mono">
                                    {dimensions?.length || '?'} x {dimensions?.width || '?'} x {dimensions?.height || '?'} cm
                                  </div>
                               </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Shipping Tab */}
        <TabsContent value="shipping" className="space-y-6 mt-6">
          <Card className="border-border/40 shadow-sm">
            <CardContent className="p-4 sm:p-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Box className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Fast Shipping</h4>
                    <p className="text-sm text-muted-foreground">
                      Free delivery for all orders over $100. Most orders ship within 24 hours.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Warranty</h4>
                    <p className="text-sm text-muted-foreground">
                      All products come with a minimum 1-year manufacturer warranty.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Global Delivery</h4>
                    <p className="text-sm text-muted-foreground">
                      We ship to over 150 countries worldwide with tracked shipping.
                    </p>
                  </div>
                </div>
              </div>

               <div className="mt-8 p-4 rounded-xl bg-secondary/20 border border-border/50">
                  <h5 className="font-medium text-sm text-muted-foreground mb-3">Estimated Delivery</h5>
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                     <div className="space-y-1">
                        <p className="font-semibold text-foreground">Standard Shipping</p>
                        <p className="text-xs text-muted-foreground">3-5 business days</p>
                     </div>
                     <Badge variant="outline" className="w-fit">Free</Badge>
                  </div>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
