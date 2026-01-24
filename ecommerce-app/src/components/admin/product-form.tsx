// components/admin/product-form.tsx
'use client';

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
import { Textarea } from '@/components/ui/textarea';
import {
    productFormSchema,
    type ProductFormValues,
} from '@/lib/schemas/product-schema';
import { ProductWithRelations } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { DollarSign, Image as ImageIcon, Layers, Loader2, Package, Percent, Tag, Type, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ProductFormProps {
  product?: ProductWithRelations | null;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
}

export const ProductForm = ({
  product,
  onSubmit,
  isSubmitting = false,
}: ProductFormProps) => {
  const [useUrlInput, setUseUrlInput] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.images?.map(img => img.url) || []
  );
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: product?.title || '',
      description: product?.description || '',
      price: product?.price || 0,
      stock: product?.stock || 0,
      brand: product?.brand || '',
      category: product?.category || '',
      discount: product?.discount || undefined,
    },
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

  const handleFormSubmit = async (values: ProductFormValues) => {
    const finalValues = {
      ...values,
      images: imageUrls,
      imageUrl: imageUrls[0],
    };

    await onSubmit(finalValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-8'>
        {/* Basic Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='card-premium p-6 space-y-6'
        >
          <div className='flex items-center gap-3 pb-4 border-b border-border/50'>
            <div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center'>
              <Package className='h-5 w-5 text-primary' />
            </div>
            <div>
              <h3 className='font-semibold text-foreground'>Basic Information</h3>
              <p className='text-sm text-muted-foreground'>Product details and description</p>
            </div>
          </div>

          {/* Title */}
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center gap-2'>
                  <Type className='h-4 w-4 text-muted-foreground' />
                  Product Title
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='e.g. Quantum QLED 65" Smart TV'
                    className='input-premium'
                    disabled={isSubmitting || isUploading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A clear, compelling title that describes your product
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center gap-2'>
                  <Layers className='h-4 w-4 text-muted-foreground' />
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Describe the product features, specifications, and benefits...'
                    rows={5}
                    className='input-premium resize-none'
                    disabled={isSubmitting || isUploading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Detailed description helps customers make informed decisions
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        {/* Pricing & Inventory Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='card-premium p-6 space-y-6'
        >
          <div className='flex items-center gap-3 pb-4 border-b border-border/50'>
            <div className='w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center'>
              <DollarSign className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
            </div>
            <div>
              <h3 className='font-semibold text-foreground'>Pricing & Inventory</h3>
              <p className='text-sm text-muted-foreground'>Set pricing and stock levels</p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-2'>
                    <DollarSign className='h-4 w-4 text-muted-foreground' />
                    Price
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <span className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium'>$</span>
                      <Input
                        type='number'
                        step='0.01'
                        min='0'
                        placeholder='0.00'
                        className='input-premium pl-8'
                        disabled={isSubmitting || isUploading}
                        {...field}
                        value={field.value === 0 ? '' : field.value}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                      />
                    </div>
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
                  <FormLabel className='flex items-center gap-2'>
                    <Percent className='h-4 w-4 text-muted-foreground' />
                    Discount (%)
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type='number'
                        min='0'
                        max='100'
                        placeholder='0'
                        className='input-premium pr-8'
                        disabled={isSubmitting || isUploading}
                        {...field}
                        value={field.value === undefined || field.value === 0 ? '' : field.value}
                        onChange={(e) => {
                          const value = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                          field.onChange(value);
                        }}
                      />
                      <span className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground'>%</span>
                    </div>
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
                  <FormLabel className='flex items-center gap-2'>
                    <Package className='h-4 w-4 text-muted-foreground' />
                    Stock Quantity
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min='0'
                      placeholder='0'
                      className='input-premium'
                      disabled={isSubmitting || isUploading}
                      {...field}
                      value={field.value === 0 ? '' : field.value}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                        field.onChange(isNaN(value) ? 0 : value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </motion.div>

        {/* Organization Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='card-premium p-6 space-y-6'
        >
          <div className='flex items-center gap-3 pb-4 border-b border-border/50'>
            <div className='w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center'>
              <Tag className='h-5 w-5 text-blue-600 dark:text-blue-400' />
            </div>
            <div>
              <h3 className='font-semibold text-foreground'>Organization</h3>
              <p className='text-sm text-muted-foreground'>Brand and category classification</p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormField
              control={form.control}
              name='brand'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g. AuroVision, TechPro, SoundMax'
                      className='input-premium'
                      disabled={isSubmitting || isUploading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g. TVs, Laptops, Audio, Phones'
                      className='input-premium'
                      disabled={isSubmitting || isUploading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </motion.div>

        {/* Product Images Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='card-premium p-6 space-y-6'
        >
          <div className='flex items-center gap-3 pb-4 border-b border-border/50'>
            <div className='w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center'>
              <ImageIcon className='h-5 w-5 text-purple-600 dark:text-purple-400' />
            </div>
            <div>
              <h3 className='font-semibold text-foreground'>Product Images</h3>
              <p className='text-sm text-muted-foreground'>Add images to showcase your product</p>
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
              Upload Files
            </Button>
          </div>

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
                <div className='relative h-40 w-40 overflow-hidden rounded-2xl border border-border/50 shadow-sm'>
                  <Image 
                    src={imageUrls[0]} 
                    alt='Preview' 
                    fill
                    className='object-cover'
                    unoptimized
                  />
                </div>
              )}
            </div>
          ) : (
            <div className='space-y-4'>
              <div className='border-2 border-dashed border-border/50 rounded-2xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer group'>
                <Input
                  id='images'
                  type='file'
                  accept='image/*'
                  multiple
                  onChange={handleImageUpload}
                  disabled={isSubmitting || isUploading}
                  className='hidden'
                />
                <label 
                  htmlFor='images'
                  className='cursor-pointer flex flex-col items-center gap-3'
                >
                  {isUploading ? (
                    <>
                      <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center'>
                        <Loader2 className='h-8 w-8 text-primary animate-spin' />
                      </div>
                      <span className='text-sm font-medium text-muted-foreground'>
                        Uploading...
                      </span>
                    </>
                  ) : (
                    <>
                      <div className='w-16 h-16 rounded-full bg-muted group-hover:bg-primary/10 transition-colors flex items-center justify-center'>
                        <Upload className='h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors' />
                      </div>
                      <div>
                        <span className='text-sm font-medium text-foreground'>
                          Click to upload or drag and drop
                        </span>
                        <p className='text-xs text-muted-foreground mt-1'>
                          PNG, JPG, WEBP up to 5MB each
                        </p>
                      </div>
                    </>
                  )}
                </label>
              </div>

              {imageUrls.length > 0 && (
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                  {imageUrls.map((url, index) => (
                    <div key={index} className='relative group'>
                      <div className='relative h-28 w-full overflow-hidden rounded-xl border border-border/50'>
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
                        disabled={isSubmitting || isUploading}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                      {index === 0 && (
                        <span className='absolute bottom-2 left-2 text-xs font-medium bg-primary text-primary-foreground px-2 py-0.5 rounded-md'>
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='flex justify-end gap-4 pt-4'
        >
          <Button
            type='submit'
            disabled={isSubmitting || isUploading}
            size='lg'
            className='min-w-[160px] rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40'
          >
            {isSubmitting ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                Saving...
              </>
            ) : product ? (
              <>
                <Package className='h-4 w-4 mr-2' />
                Save Changes
              </>
            ) : (
              <>
                <Package className='h-4 w-4 mr-2' />
                Create Product
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
};