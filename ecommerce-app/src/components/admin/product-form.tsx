// components/admin/product-form.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { Product } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Upload, Image as ImageIcon, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
}

export const ProductForm = ({
  product,
  onSubmit,
  isSubmitting = false,
}: ProductFormProps) => {
  const [useUrlInput, setUseUrlInput] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>(product?.images || []);
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
      } catch (error) {
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
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-6'>
        {/* Title */}
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Title</FormLabel>
              <FormControl>
                <Input
                  placeholder='e.g. Quantum QLED 65" TV'
                  disabled={isSubmitting || isUploading}
                  {...field}
                />
              </FormControl>
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Describe the product features and benefits...'
                  rows={4}
                  disabled={isSubmitting || isUploading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price and Stock */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    min='0'
                    placeholder='e.g. 1299.99'
                    disabled={isSubmitting || isUploading}
                    {...field}
                    value={field.value === 0 ? '' : field.value}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      field.onChange(isNaN(value) ? 0 : value);
                    }}
                  />
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
                  <Input
                    type='number'
                    min='0'
                    placeholder='e.g. 25'
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

        {/* Brand and Category */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='brand'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input
                    placeholder='e.g. AuroVision'
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
                    placeholder='e.g. TVs'
                    disabled={isSubmitting || isUploading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Product Images Section */}
        <div className="border dark:border-slate-800 rounded-lg p-6 space-y-4">
          <FormLabel>Product Images</FormLabel>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant={useUrlInput ? 'default' : 'outline'}
              size="sm"
              onClick={() => setUseUrlInput(true)}
              disabled={isUploading}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Image URL
            </Button>
            <Button
              type="button"
              variant={!useUrlInput ? 'default' : 'outline'}
              size="sm"
              onClick={() => setUseUrlInput(false)}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </div>

          {useUrlInput ? (
            <div className="space-y-2">
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrls[0] || ''}
                onChange={(e) => setImageUrls([e.target.value])}
                disabled={isSubmitting || isUploading}
              />
              {imageUrls[0] && (
                <div className="mt-2">
                  <img 
                    src={imageUrls[0]} 
                    alt="Preview" 
                    className="h-32 w-32 object-cover rounded-lg border dark:border-slate-700"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid+URL';
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-2 border-dashed dark:border-slate-700 rounded-lg p-6 text-center hover:border-slate-400 dark:hover:border-slate-600 transition-colors">
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={isSubmitting || isUploading}
                  className="hidden"
                />
                <label 
                  htmlFor="images"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className='h-10 w-10 text-slate-400 animate-spin' />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Uploading...
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Click to upload or drag and drop
                      </span>
                      <span className="text-xs text-slate-500">
                        PNG, JPG, WEBP up to 5MB each
                      </span>
                    </>
                  )}
                </label>
              </div>

              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-full object-cover rounded-lg border dark:border-slate-700"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                        disabled={isSubmitting || isUploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className='flex gap-4 pt-4'>
          <Button
            type='submit'
            disabled={isSubmitting || isUploading}
            className='min-w-[120px]'
          >
            {isSubmitting ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                Saving...
              </>
            ) : product ? (
              'Save Changes'
            ) : (
              'Create Product'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};