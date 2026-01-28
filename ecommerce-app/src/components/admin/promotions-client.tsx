'use client';

import { createPromotion, deletePromotion, getPromotions, updatePromotion } from '@/actions/admin/promotions-actions';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Promotion } from '@/generated/prisma/browser';
import { PromotionType } from '@/generated/prisma/enums';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Edit, MoreHorizontal, Plus, Trash } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const promotionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  type: z.nativeEnum(PromotionType),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.coerce.number().min(0, 'Must be positive'),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  badgeText: z.string().optional(),
  isActive: z.boolean().default(true),
});

type PromotionFormValues = z.infer<typeof promotionSchema>;

interface PromotionsClientProps {
  initialPromotions: Promotion[];
}

export function PromotionsClient({ initialPromotions = [] }: PromotionsClientProps) {
  const [promotions, setPromotions] = useState(initialPromotions);
  const [isOpen, setIsOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<PromotionFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(promotionSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      type: PromotionType.SEASONAL,
      discountType: 'percentage',
      discountValue: 0,
      startsAt: new Date(),
      endsAt: new Date(new Date().setDate(new Date().getDate() + 7)),
      badgeText: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (editingPromotion) {
      form.reset({
        name: editingPromotion.name,
        description: editingPromotion.description || '',
        type: editingPromotion.type as PromotionType,
        discountType: editingPromotion.discountType as 'percentage' | 'fixed',
        discountValue: editingPromotion.discountValue,
        startsAt: new Date(editingPromotion.startsAt),
        endsAt: new Date(editingPromotion.endsAt),
        badgeText: editingPromotion.badgeText || '',
        isActive: editingPromotion.isActive,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        type: PromotionType.SEASONAL,
        discountType: 'percentage',
        discountValue: 0,
        startsAt: new Date(),
        endsAt: new Date(new Date().setDate(new Date().getDate() + 7)),
        badgeText: '',
        isActive: true,
      });
    }
  }, [editingPromotion, form, isOpen]);

  const onSubmit = (data: PromotionFormValues) => {
    startTransition(async () => {
      try {
        let result;
        if (editingPromotion) {
          result = await updatePromotion(editingPromotion.id, data);
        } else {
          result = await createPromotion(data);
        }

        if (result.success) {
          toast.success(editingPromotion ? 'Promotion updated' : 'Promotion created');
          setIsOpen(false);
          setEditingPromotion(null);
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
    const result = await getPromotions();
    if (result.success && result.promotions) {
      setPromotions(result.promotions);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;
    try {
      const result = await deletePromotion(id);
      if (result.success) {
        toast.success('Promotion deleted');
        refreshData();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const openEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setIsOpen(true);
  };

  const openCreate = () => {
    setEditingPromotion(null);
    setIsOpen(true);
  };

  // Helper for date input format
  const toInputDate = (date: Date) => date.toISOString().split('T')[0];

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Promotions</h2>
          <p className='text-muted-foreground'>Manage sale campaigns and special offers.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className='mr-2 h-4 w-4' /> New Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[600px]'>
            <DialogHeader>
              <DialogTitle>{editingPromotion ? 'Edit Promotion' : 'Create Promotion'}</DialogTitle>
              <DialogDescription>
                {editingPromotion ? 'Update promotion details.' : 'Launch a new marketing campaign.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder='Summer Sale' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name='type'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(PromotionType).map((type) => (
                              <SelectItem key={type} value={type}>
                                {type.replace('_', ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder='Internal description...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name='discountType'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select discount" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                            <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='discountValue'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Value</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <FormField
                    control={form.control}
                    name='startsAt'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            value={field.value ? toInputDate(field.value) : ''} 
                            onChange={(e) => field.onChange(new Date(e.target.value))} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name='endsAt'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                           <Input 
                            type="date" 
                            value={field.value ? toInputDate(field.value) : ''} 
                            onChange={(e) => field.onChange(new Date(e.target.value))} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                 <div className="grid grid-cols-2 gap-4">
                   <FormField
                      control={form.control}
                      name='badgeText'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Badge Text</FormLabel>
                          <FormControl>
                            <Input placeholder='e.g. 50% OFF' {...field} value={field.value || ''} />
                          </FormControl>
                          <FormDescription>Shown on product cards</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='isActive'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                          <div className='space-y-0.5 mt-2'>
                            <FormLabel>Active</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                    {isPending ? 'Saving...' : 'Save Promotion'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Active Promotions</CardTitle>
            <CardDescription>
                You have {promotions.length} campaigns.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {promotions.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                            No campaigns found. Create one to get started.
                        </TableCell>
                    </TableRow>
                ) : (
                    promotions.map((promo) => (
                        <TableRow key={promo.id}>
                        <TableCell className='font-medium'>
                            <div>{promo.name}</div>
                            {promo.badgeText && <div className="text-xs text-muted-foreground border inline-block px-1 rounded">{promo.badgeText}</div>}
                        </TableCell>
                        <TableCell className="text-xs">{promo.type.replace('_', ' ')}</TableCell>
                        <TableCell>
                            {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `$${promo.discountValue}`}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                            {format(new Date(promo.startsAt), 'MMM d')} - {format(new Date(promo.endsAt), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                            {promo.isActive ? (
                            <span className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-green-500/15 text-green-700 dark:text-green-400'>
                                Active
                            </span>
                            ) : (
                            <span className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-destructive/10 text-destructive'>
                                Inactive
                            </span>
                            )}
                        </TableCell>
                        <TableCell className='text-right'>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='ghost' className='h-8 w-8 p-0'>
                                <span className='sr-only'>Open menu</span>
                                <MoreHorizontal className='h-4 w-4' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => openEdit(promo)}>
                                <Edit className='mr-2 h-4 w-4' />
                                Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className='text-destructive' onClick={() => handleDelete(promo.id)}>
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
