// components/admin/product-form.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    productFormSchema,
    type ProductFormValues,
} from '@/lib/schemas/product-schema';
import { ProductWithRelations } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    DollarSign,
    Image as ImageIcon,
    Layers,
    LayoutList,
    Loader2,
    Plus,
    Ruler,
    Save,
    Trash2,
    Type,
    Upload,
    X
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ProductFormProps {
  product?: ProductWithRelations | null;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
}

// Predefined Categories for Quick Selection
const CATEGORIES = [
    "Electronics", "Computers", "Smartphones", "Home & Kitchen", 
    "Appliances", "Fashion", "Sports", "Toys", "Beauty", "Automotive"
];

const SUB_CATEGORIES: Record<string, string[]> = {
    "Electronics": ["TVs", "Audio", "Cameras", "Wearables"],
    "Computers": ["Laptops", "Desktops", "Monitors", "Components"],
    "Smartphones": ["Android", "iOS", "Accessories"],
    "Appliances": ["White Goods", "Small Appliances", "Vacuum Cleaners"],
};

export const ProductForm = ({
  product,
  onSubmit,
  isSubmitting = false,
}: ProductFormProps) => {
  const [useUrlInput, setUseUrlInput] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.images?.map(img => img.url) || []
  );
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Initialize form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: product?.title || '',
      description: product?.description || '',
      price: product?.price || 0,
      stock: product?.stock || 0,
      brand: product?.brand || '',
      category: product?.category || '',
      subCategory: product?.subCategory || '',
      discount: product?.discount || undefined,
      sku: product?.sku || '',
      barcode: product?.barcode || '',
      weight: product?.weight || undefined,
      isFeatured: product?.isFeatured || false,
      isArchived: product?.isArchived || false,
      tags: product?.tags || [],
      dimensions: product?.dimensions && typeof product.dimensions === 'object' 
        ? {
            length: 'length' in product.dimensions ? Number((product.dimensions as any).length) : undefined,
            width: 'width' in product.dimensions ? Number((product.dimensions as any).width) : undefined,
            height: 'height' in product.dimensions ? Number((product.dimensions as any).height) : undefined,
          }
        : undefined,
      specifications: product?.specifications && Array.isArray(product.specifications)
        ? (product.specifications as { key: string; value: string }[])
        : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "specifications",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB.`);
        continue;
      }
      
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await res.json();

        if (result.success) {
          uploadedUrls.push(result.url);
        } else {
          toast.error(`Failed to upload ${file.name}: ${result.error}`);
        }
      } catch {
        toast.error(`An error occurred while uploading ${file.name}`);
      }
    }

    setImageUrls(prev => [...prev, ...uploadedUrls]);
    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && tagInput.trim()) {
          e.preventDefault();
          const currentTags = form.getValues('tags') || [];
          if (!currentTags.includes(tagInput.trim())) {
              form.setValue('tags', [...currentTags, tagInput.trim()]);
          }
          setTagInput('');
      }
  };

  const removeTag = (tag: string) => {
      const currentTags = form.getValues('tags') || [];
      form.setValue('tags', currentTags.filter(t => t !== tag));
  };

  const handleFormSubmit = async (values: ProductFormValues) => {
    const finalValues = {
      ...values,
      images: imageUrls,
      imageUrl: imageUrls[0],
    };

    await onSubmit(finalValues);
  };

  // Watch category to update subcategories if needed (optional enhancement)
  const selectedCategory = form.watch('category');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-8'>
        
        <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column: Main Tabs */}
            <div className="flex-1">
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/60 backdrop-blur rounded-xl">
                        <TabsTrigger value="general" className="rounded-lg py-2">General</TabsTrigger>
                        <TabsTrigger value="organize" className="rounded-lg py-2">Organize</TabsTrigger>
                        <TabsTrigger value="pricing" className="rounded-lg py-2">Pricing</TabsTrigger>
                        <TabsTrigger value="specs" className="rounded-lg py-2">Specs</TabsTrigger>
                        <TabsTrigger value="media" className="rounded-lg py-2">Media</TabsTrigger>
                    </TabsList>
                    
                    {/* --- GENERAL TAB --- */}
                    <TabsContent value="general" className="space-y-6 mt-6">
                         <div className='card-premium p-6 space-y-6'>
                            <div className="flex items-center justify-between pb-4 border-b border-border/50">
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center'>
                                        <Type className='h-5 w-5 text-primary' />
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-foreground'>Basic Details</h3>
                                        <p className='text-sm text-muted-foreground'>Title and Description</p>
                                    </div>
                                </div>
                            </div>
                            
                            <FormField
                                control={form.control}
                                name='title'
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Title</FormLabel>
                                    <FormControl>
                                    <Input placeholder='e.g. Ultra HD 4K Smart TV' className='input-premium' {...field} disabled={isSubmitting} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                    <Textarea 
                                        placeholder='Detailed description of the product...' 
                                        rows={6} 
                                        className='input-premium resize-y min-h-[150px]' 
                                        {...field} 
                                        disabled={isSubmitting} 
                                    />
                                    </FormControl>
                                    <FormDescription>Supports basic formatting.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                            <div className="flex items-center gap-8 pt-4">
                                <FormField
                                    control={form.control}
                                    name="isFeatured"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border/50 p-4 shadow-sm w-full">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Featured Product</FormLabel>
                                                <FormDescription>Show on homepage and featured lists.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isArchived"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border/50 p-4 shadow-sm w-full">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Archived</FormLabel>
                                                <FormDescription>Hide from store without deleting.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* --- ORGANIZATION TAB --- */}
                    <TabsContent value="organize" className="space-y-6 mt-6">
                        <div className='card-premium p-6 space-y-6'>
                            <div className='flex items-center gap-3 pb-4 border-b border-border/50'>
                                <div className='w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center'>
                                    <Layers className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-foreground'>Categorization</h3>
                                    <p className='text-sm text-muted-foreground'>Organize your catalog</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name='category'
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input placeholder='Select or type...' list="categories" className='input-premium' {...field} disabled={isSubmitting} />
                                                <datalist id="categories">
                                                    {CATEGORIES.map(cat => <option key={cat} value={cat} />)}
                                                </datalist>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='subCategory'
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sub-Category</FormLabel>
                                        <FormControl>
                                            <Input placeholder='e.g. 4K TVs' list="subcategories" className='input-premium' {...field} disabled={isSubmitting} />
                                        </FormControl>
                                        <datalist id="subcategories">
                                            {selectedCategory && SUB_CATEGORIES[selectedCategory]?.map(sub => <option key={sub} value={sub} />)}
                                        </datalist>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='brand'
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Brand</FormLabel>
                                        <FormControl>
                                            <Input placeholder='e.g. Samsung, Apple' className='input-premium' {...field} disabled={isSubmitting} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                name="tags"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Tags (SEO)</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col gap-3">
                                                <Input 
                                                    placeholder="Type and press Enter to add..." 
                                                    value={tagInput}
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    onKeyDown={handleAddTag}
                                                    className="input-premium"
                                                    disabled={isSubmitting}
                                                />
                                                <div className="flex flex-wrap gap-2 min-h-[30px]">
                                                    {form.watch('tags')?.map((tag, i) => (
                                                        <Badge key={i} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                                                            {tag}
                                                            <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeTag(tag)} />
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>

                    {/* --- PRICING TAB --- */}
                    <TabsContent value="pricing" className="space-y-6 mt-6">
                        <div className='card-premium p-6 space-y-6'>
                            <div className='flex items-center gap-3 pb-4 border-b border-border/50'>
                                <div className='w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center'>
                                    <DollarSign className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-foreground'>Pricing & Inventory</h3>
                                    <p className='text-sm text-muted-foreground'>Manage costs and stock</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name='price'
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price ($)</FormLabel>
                                        <FormControl>
                                            <Input type='number' step='0.01' className='input-premium' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='discount'
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discount (%)</FormLabel>
                                        <FormControl>
                                            <Input type='number' className='input-premium' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='stock'
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock Quantity</FormLabel>
                                        <FormControl>
                                            <Input type='number' className='input-premium' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                                <FormField
                                    control={form.control}
                                    name='sku'
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. ELE-TV-001" className='input-premium' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='barcode'
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Barcode / UPC</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Scan or type..." className='input-premium' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* --- SPECIFICATIONS TAB --- */}
                    <TabsContent value="specs" className="space-y-6 mt-6">
                         <div className='card-premium p-6 space-y-6'>
                            <div className='flex items-center gap-3 pb-4 border-b border-border/50'>
                                <div className='w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center'>
                                    <Ruler className='h-5 w-5 text-amber-600 dark:text-amber-400' />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-foreground'>Physical Specs</h3>
                                    <p className='text-sm text-muted-foreground'>Dimensions and weight</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <FormField
                                    control={form.control}
                                    name='weight'
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Weight (kg)</FormLabel>
                                        <FormControl>
                                            <Input type='number' step="0.1" className='input-premium' {...field} />
                                        </FormControl>
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='dimensions.length'
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Length (cm)</FormLabel>
                                        <FormControl>
                                            <Input type='number' step="0.1" className='input-premium' {...field} />
                                        </FormControl>
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='dimensions.width'
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Width (cm)</FormLabel>
                                        <FormControl>
                                            <Input type='number' step="0.1" className='input-premium' {...field} />
                                        </FormControl>
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='dimensions.height'
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Height (cm)</FormLabel>
                                        <FormControl>
                                            <Input type='number' step="0.1" className='input-premium' {...field} />
                                        </FormControl>
                                    </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='card-premium p-6 space-y-6'>
                            <div className='flex items-center justify-between pb-4 border-b border-border/50'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center'>
                                        <LayoutList className='h-5 w-5 text-indigo-600 dark:text-indigo-400' />
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-foreground'>Technical Specifications</h3>
                                        <p className='text-sm text-muted-foreground'>Add custom attributes key-value pairs</p>
                                    </div>
                                </div>
                                <Button type="button" size="sm" onClick={() => append({ key: '', value: '' })} className="gap-2">
                                    <Plus className="h-4 w-4" /> Add Spec
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-4 items-start">
                                        <FormField
                                            control={form.control}
                                            name={`specifications.${index}.key`}
                                            render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input placeholder="Feature (e.g. Screen Size)" className="input-premium" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`specifications.${index}.value`}
                                            render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input placeholder="Value (e.g. 55 inch)" className="input-premium" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-muted-foreground hover:text-destructive transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {fields.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                                        No specifications added yet. Click "Add Spec" to define custom features.
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* --- MEDIA TAB --- */}
                    <TabsContent value="media" className="space-y-6 mt-6">
                        <div className='card-premium p-6 space-y-6'>
                            <div className='flex items-center gap-3 pb-4 border-b border-border/50'>
                                <div className='w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center'>
                                    <ImageIcon className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-foreground'>Product Gallery</h3>
                                    <p className='text-sm text-muted-foreground'>High quality images</p>
                                </div>
                            </div>

                            <div className='flex gap-2'>
                                <Button
                                type='button'
                                variant={useUrlInput ? 'default' : 'outline'}
                                size='sm'
                                onClick={() => setUseUrlInput(true)}
                                disabled={isUploading}
                                className='rounded-xl'
                                >
                                <ImageIcon className='h-4 w-4 mr-2' />
                                Image URL
                                </Button>
                                <Button
                                type='button'
                                variant={!useUrlInput ? 'default' : 'outline'}
                                size='sm'
                                onClick={() => setUseUrlInput(false)}
                                disabled={isUploading}
                                className='rounded-xl'
                                >
                                <Upload className='h-4 w-4 mr-2' />
                                File Upload
                                </Button>
                            </div>

                            {/* ... Image Input Logic Repeated for consistency but wrapped in Tabs ... */}
                             {useUrlInput ? (
                                <div className='space-y-4'>
                                <Input
                                    type='url'
                                    placeholder='https://example.com/image.jpg'
                                    value={imageUrls[0] || ''}
                                    onChange={(e) => setImageUrls([e.target.value])}
                                    disabled={isSubmitting || isUploading}
                                    className='input-premium'
                                />
                                {imageUrls[0] && (
                                    <div className='relative h-60 w-full overflow-hidden rounded-2xl border border-border/50 shadow-sm bg-muted/10'>
                                    <Image 
                                        src={imageUrls[0]} 
                                        alt='Preview' 
                                        fill
                                        className='object-contain'
                                        unoptimized
                                    />
                                    </div>
                                )}
                                </div>
                            ) : (
                                <div className='space-y-4'>
                                <div className='border-2 border-dashed border-border/50 rounded-2xl p-10 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer group'>
                                    <Input
                                    id='images'
                                    type='file'
                                    accept='image/*'
                                    multiple
                                    onChange={handleImageUpload}
                                    disabled={isSubmitting || isUploading}
                                    className='hidden'
                                    />
                                    <label htmlFor='images' className='cursor-pointer flex flex-col items-center gap-4'>
                                    {isUploading ? (
                                        <>
                                            <Loader2 className='h-10 w-10 text-primary animate-spin' />
                                            <span className='text-sm font-medium text-muted-foreground'>Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className='w-16 h-16 rounded-full bg-muted group-hover:bg-primary/10 transition-colors flex items-center justify-center'>
                                                <Upload className='h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors' />
                                            </div>
                                            <div>
                                                <span className='text-base font-semibold text-foreground'>Drop images here or click to upload</span>
                                                <p className='text-xs text-muted-foreground mt-1'>Supports PNG, JPG, WEBP (Max 5MB)</p>
                                            </div>
                                        </>
                                    )}
                                    </label>
                                </div>

                                {imageUrls.length > 0 && (
                                    <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4'>
                                    {imageUrls.map((url, index) => (
                                        <div key={index} className='relative group aspect-square'>
                                        <div className='relative h-full w-full overflow-hidden rounded-xl border border-border/50 bg-background'>
                                            <Image
                                            src={url}
                                            alt={`Preview ${index + 1}`}
                                            fill
                                            className='object-cover'
                                            unoptimized
                                            />
                                        </div>
                                        <Button
                                            type='button'
                                            variant='destructive'
                                            size='icon'
                                            className='absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg'
                                            onClick={() => removeImage(index)}
                                        >
                                            <X className='h-4 w-4' />
                                        </Button>
                                        </div>
                                    ))}
                                    </div>
                                )}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Right Column: Key Status and Actions (Sticky) */}
            <div className="w-full md:w-80 space-y-6">
                 {/* ID and Status Card */}
                 <div className="card-premium p-6 space-y-4 sticky top-24">
                     <div>
                        <h3 className="font-bold text-lg">Publishing</h3>
                        <p className="text-xs text-muted-foreground">Manage visibility and status</p>
                     </div>
                     
                     <div className="space-y-4 pt-2">
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-border/50">
                            <span className="text-sm font-medium">Status</span>
                            <Badge variant={form.watch('isArchived') ? 'destructive' : 'default'} className="uppercase text-[10px]">
                                {form.watch('isArchived') ? 'Archived' : 'Active'}
                            </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-border/50">
                            <span className="text-sm font-medium">Featured</span>
                            <Badge variant={form.watch('isFeatured') ? 'default' : 'secondary'} className="uppercase text-[10px]">
                                {form.watch('isFeatured') ? 'Yes' : 'No'}
                            </Badge>
                        </div>

                        <div className="pt-4 space-y-3">
                            <Button 
                                type="submit" 
                                className="w-full rounded-xl gap-2 font-bold shadow-lg shadow-primary/20" 
                                size="lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                {product ? 'Save Changes' : 'Publish Product'}
                            </Button>
                            
                            <Button 
                                type="button" 
                                variant="outline" 
                                className="w-full rounded-xl gap-2"
                                onClick={() => window.history.back()}
                            >
                                Discard
                            </Button>
                        </div>
                     </div>
                 </div>
            </div>
        </div>
      </form>
    </Form>
  );
};