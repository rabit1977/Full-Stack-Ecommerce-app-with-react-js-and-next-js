import * as z from 'zod';

/**
 * Product form validation schema
 * Shared between client and server
 */
export const productFormSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce
    .number({ message: 'Price must be a number' })
    .min(0, { message: 'Price must be a positive number.' }),
  stock: z.coerce
    .number({ message: 'Stock must be a number' })
    .int({ message: 'Stock must be a whole number' })
    .min(0, { message: 'Stock must be a positive integer.' }),
  brand: z.string().min(2, { message: 'Brand is required.' }),
  category: z.string().min(2, { message: 'Category is required.' }),
  
  // Advanced Fields
  subCategory: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  weight: z.coerce.number().min(0).optional(),
  dimensions: z.object({
    length: z.coerce.number().min(0).optional(),
    width: z.coerce.number().min(0).optional(),
    height: z.coerce.number().min(0).optional(),
  }).optional(),
  
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  
  // JSON & Arrays
  images: z.array(z.string()).optional(),
  imageUrl: z.string().optional(), // For legacy or single url handling
  discount: z.coerce.number().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),

  // SEO Fields
  slug: z.string().optional(), // Auto-generated if empty
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  
  // Structured Data
  specifications: z.array(z.object({
    key: z.string().min(1, "Key required"),
    value: z.string().min(1, "Value required")
  })).optional(),
  
  options: z.any().optional(),

  // Bundle Fields
  bundleItems: z.array(z.object({
    productId: z.string(),
    quantity: z.coerce.number().min(1).default(1),
  })).optional(),
  
  // Relations Fields
  relatedProducts: z.array(z.object({
    relatedId: z.string(),
    type: z.enum(['similar', 'frequently_bought_together']), 
  })).optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
