'use client';

import { createCategory, deleteCategory, getCategories, updateCategory } from '@/actions/admin/categories-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Category } from '@/generated/prisma/browser';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, MoreHorizontal, Plus, Trash } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Schema must match the server action schema
const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  parentId: z.string().optional().nullable(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoriesClientProps {
  initialCategories: (Category & { parent: { name: string } | null; _count: { children: number } })[];
}

export function CategoriesClient({ initialCategories = [] }: CategoriesClientProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CategoryFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      image: '',
      isActive: true,
      isFeatured: false,
      parentId: null,
    },
  });

  // Reset form when dialog opens/closes or editing changes
  useEffect(() => {
    if (editingCategory) {
      form.reset({
        name: editingCategory.name,
        slug: editingCategory.slug,
        description: editingCategory.description || '',
        image: editingCategory.image || '',
        isActive: editingCategory.isActive,
        isFeatured: editingCategory.isFeatured,
        parentId: editingCategory.parentId,
      });
    } else {
      form.reset({
        name: '',
        slug: '',
        description: '',
        image: '',
        isActive: true,
        isFeatured: false,
        parentId: null,
      });
    }
  }, [editingCategory, form, isOpen]);

  // Auto-generate slug from name
  const name = form.watch('name');
  useEffect(() => {
    if (!editingCategory && name) {
      form.setValue('slug', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));
    }
  }, [name, editingCategory, form]);

  const onSubmit = (data: CategoryFormValues) => {
    startTransition(async () => {
      try {
        let result;
        if (editingCategory) {
          result = await updateCategory(editingCategory.id, data);
        } else {
          result = await createCategory(data);
        }
        if (result.success) {
          toast.success(editingCategory ? 'Category updated' : 'Category created');
          setIsOpen(false);
          setEditingCategory(null);
          refreshData(); // Simple refresh strategy
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error('Something went wrong');
      }
    });
  };

  const refreshData = async () => {
    const result = await getCategories();
    if (result.success && result.categories) {
       // @ts-ignore - mismatch in type complexity is fine for this simple refresh
      setCategories(result.categories);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const result = await deleteCategory(id);
      if (result.success) {
        toast.success('Category deleted');
        refreshData();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setIsOpen(true);
  };

  const openCreate = () => {
    setEditingCategory(null);
    setIsOpen(true);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight text-xl sm:text-xl md:text-2xl lg:text-3xl'>Categories</h2>
          <p className='text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg'>Manage your product categories and hierarchy.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className='text-xs sm:text-sm md:text-base lg:text-lg h-8 sm:h-9 md:h-10 lg:h-11'>
              <Plus className='mr-2 h-4 w-4' /> New Category
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle className='text-xl sm:text-xl md:text-2xl lg:text-3xl'>{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
              <DialogDescription className='text-xs sm:text-sm md:text-base lg:text-lg'>
                {editingCategory ? 'Make changes to the category details.' : 'Add a new category to your store.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel className='text-xs sm:text-sm md:text-base lg:text-lg'>Name</FormLabel>
                      <FormControl>
                        <Input className='text-xs sm:text-sm md:text-base lg:text-lg' placeholder='e.g. Electronics' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='slug'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs sm:text-sm md:text-base lg:text-lg'>Slug</FormLabel>
                      <FormControl>
                        <Input className='text-xs sm:text-sm md:text-base lg:text-lg' placeholder='e.g. electronics' {...field} />
                      </FormControl>
                      <FormDescription className='text-xs sm:text-sm md:text-base lg:text-lg'>URL-friendly version of the name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs sm:text-sm md:text-base lg:text-lg'>Description</FormLabel>
                      <FormControl>
                        <Textarea className='text-xs sm:text-sm md:text-base lg:text-lg' rows={4} placeholder='Category description...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name='isFeatured'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-xs sm:text-sm md:text-base lg:text-lg'>Featured</FormLabel>
                        <FormDescription className='text-xs sm:text-sm md:text-base lg:text-lg'>Show on homepage</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name='isActive'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                      <div className='space-y-0.5'>
                        <FormLabel  className='text-xs sm:text-sm md:text-base lg:text-lg'>Active</FormLabel>
                        <FormDescription className='text-xs sm:text-sm md:text-base lg:text-lg'>Visible to customers</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type='button' variant='outline' onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type='submit' disabled={isPending}>
                    {isPending ? 'Saving...' : 'Save Category'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className='text-lg font-bold tracking-tight sm:text-xl md:text-2xl lg:text-3xl'>All Categories</CardTitle>
            <CardDescription className='text-xs sm:text-sm md:text-base lg:text-lg'>
                You have {categories.length} categories.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow className='text-xs sm:text-sm md:text-base lg:text-lg'>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right text-xs sm:text-sm md:text-base lg:text-lg'>Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {categories.length === 0 ? (
                    <TableRow className='text-xs sm:text-sm md:text-base lg:text-lg'>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg">
                            No categories found. Create one to get started.
                        </TableCell>
                    </TableRow>
                ) : (
                    categories.map((category) => (
                        <TableRow key={category.id}>
                        <TableCell className='font-medium text-xs sm:text-sm md:text-base lg:text-lg'>{category.name}</TableCell>
                        <TableCell className='text-xs sm:text-sm md:text-base lg:text-lg'>{category.slug}</TableCell>
                        <TableCell className='text-xs sm:text-sm md:text-base lg:text-lg'>-</TableCell> {/* Placeholder for product count if expensive to join */}
                        <TableCell className='text-xs sm:text-sm md:text-base lg:text-lg'>
                            {category.isActive ? (
                            <span className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25'>
                                Active
                            </span>
                            ) : (
                            <span className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20'>
                                Inactive
                            </span>
                            )}
                        </TableCell>
                        <TableCell className='text-right text-xs sm:text-sm md:text-base lg:text-lg'>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='ghost' className='h-8 w-8 p-0 text-xs sm:text-sm md:text-base lg:text-lg'>
                                <span className='sr-only text-xs sm:text-sm md:text-base lg:text-lg'>Open menu</span>
                                <MoreHorizontal className='h-4 w-4 text-xs sm:text-sm md:text-base lg:text-lg' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => openEdit(category)}>
                                <Edit className='mr-2 h-4 w-4 text-xs sm:text-sm md:text-base lg:text-lg' />
                                Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => window.open(`/shop/${category.slug}`, '_blank')}>
                                View on Store
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className='text-destructive' onClick={() => handleDelete(category.id)}>
                                <Trash className='mr-2 h-4 w-4 text-xs sm:text-sm md:text-base lg:text-lg' />
                                Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    ))
                )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
