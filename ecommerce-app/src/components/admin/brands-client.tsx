'use client';

import { createBrand, deleteBrand, getBrands, updateBrand } from '@/actions/admin/brands-actions';
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
import { Brand } from '@/generated/prisma/browser';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Loader2, MoreHorizontal, Plus, Trash } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const brandSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  logo: z.string().optional(),
  website: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandsClientProps {
  initialBrands: Brand[];
}

export function BrandsClient({ initialBrands = [] }: BrandsClientProps) {
  const [brands, setBrands] = useState(initialBrands);
  const [isOpen, setIsOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<BrandFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(brandSchema) as any,
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      logo: '',
      website: '',
      isActive: true,
      isFeatured: false,
    },
  });

  useEffect(() => {
    if (editingBrand) {
      form.reset({
        name: editingBrand.name,
        slug: editingBrand.slug,
        description: editingBrand.description || '',
        logo: editingBrand.logo || '',
        website: editingBrand.website || '',
        isActive: editingBrand.isActive,
        isFeatured: editingBrand.isFeatured,
      });
    } else {
      form.reset({
        name: '',
        slug: '',
        description: '',
        logo: '',
        website: '',
        isActive: true,
        isFeatured: false,
      });
    }
  }, [editingBrand, form, isOpen]);

  const name = form.watch('name');
  useEffect(() => {
    if (!editingBrand && name) {
      form.setValue('slug', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));
    }
  }, [name, editingBrand, form]);

  const onSubmit = (data: BrandFormValues) => {
    startTransition(async () => {
      try {
        let result;
        if (editingBrand) {
          result = await updateBrand(editingBrand.id, data);
        } else {
          result = await createBrand(data);
        }

        if (result.success) {
          toast.success(editingBrand ? 'Brand updated' : 'Brand created');
          setIsOpen(false);
          setEditingBrand(null);
          refreshData();
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error('Something went wrong');
      }
    });
  };

  const refreshData = async () => {
    const result = await getBrands();
    if (result.success && result.brands) {
      setBrands(result.brands);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    
    try {
      const result = await deleteBrand(id);
      if (result.success) {
        toast.success('Brand deleted');
        refreshData();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const openEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setIsOpen(true);
  };

  const openCreate = () => {
    setEditingBrand(null);
    setIsOpen(true);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight'>Brands</h2>
          <p className='text-muted-foreground text-xs sm:text-sm'>Manage the brands you sell.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className='text-xs sm:text-sm'>
              <Plus className='mr-2 h-4 w-4' /> New Brand
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[500px] text-xs sm:text-sm'>
            <DialogHeader>
              <DialogTitle className='text-lg sm:text-sm'>{editingBrand ? 'Edit Brand' : 'Create Brand'}</DialogTitle>
              <DialogDescription className='text-xs sm:text-sm'>
                {editingBrand ? 'Update brand details.' : 'Add a new brand to your catalog.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs sm:text-sm'>Name</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g. Nike' {...field} />
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
                      <FormLabel className='text-xs sm:text-sm'>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g. nike' {...field} />
                      </FormControl>
                      <FormDescription className='text-xs sm:text-sm'>URL-friendly identifier.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='website'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs sm:text-sm'>Website</FormLabel>
                      <FormControl>
                        <Input placeholder='https://nike.com' {...field} className='text-xs sm:text-sm' value={field.value || ''} />
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
                      <FormLabel className='text-xs sm:text-sm'>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder='About the brand...' {...field} className='text-xs sm:text-sm' value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name='isFeatured'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-xs sm:text-sm'>Featured</FormLabel>
                          <FormDescription className='text-xs sm:text-sm'>Highlight brand</FormDescription>
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
                          <FormLabel className='text-xs sm:text-sm'>Active</FormLabel>
                          <FormDescription className='text-xs sm:text-sm'>Visible globally</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} className='text-xs sm:text-sm'/>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type='button' variant='outline' onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type='submit' disabled={isPending}>
                    {isPending ? 'Saving...' : 'Save Brand'} {isPending && <Loader2 className='ml-2 h-4 w-4 animate-spin' />}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className='text-xs sm:text-sm'>All Brands</CardTitle>
            <CardDescription className='text-xs sm:text-sm'>
                You have {brands.length} brands.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {brands.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            No brands found. Create one to get started.
                        </TableCell>
                    </TableRow>
                ) : (
                    brands.map((brand) => (
                        <TableRow key={brand.id}>
                        <TableCell className='font-medium text-xs sm:text-sm'>{brand.name}</TableCell>
                        <TableCell className='text-xs sm:text-sm'>{brand.slug}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-xs sm:text-sm">
                            {brand.website ? (
                                <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    {brand.website}
                                </a>
                            ) : (
                                <span className="text-muted-foreground">-</span>
                            )}
                        </TableCell>
                        <TableCell className='text-xs sm:text-sm'>
                            {brand.isActive ? (
                            <span className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25'>
                                Active
                            </span>
                            ) : (
                            <span className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20'>
                                Inactive
                            </span>
                            )}
                        </TableCell>
                        <TableCell className='text-right text-xs sm:text-sm'>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='ghost' className='h-8 w-8 p-0'>
                                <span className='sr-only'>Open menu</span>
                                <MoreHorizontal className='h-4 w-4' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' >
                                <DropdownMenuLabel className='text-xs sm:text-sm'>Actions</DropdownMenuLabel>
                                <DropdownMenuItem className='text-xs sm:text-sm' onClick={() => openEdit(brand)}>
                                <Edit className='mr-2 h-4 w-4' />
                                Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className='text-destructive text-xs sm:text-sm' onClick={() => handleDelete(brand.id)}>
                                <Trash className='mr-2 h-4 w-4' />
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
