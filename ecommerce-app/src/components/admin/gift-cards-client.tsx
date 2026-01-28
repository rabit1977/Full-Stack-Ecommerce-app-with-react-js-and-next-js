'use client';

import { createGiftCard, deleteGiftCard, getGiftCards, updateGiftCardStatus } from '@/actions/admin/gift-cards-actions';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { GiftCard } from '@/generated/prisma/browser';
import { GiftCardStatus } from '@/generated/prisma/enums';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Copy, MoreHorizontal, Plus, Trash } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const giftCardSchema = z.object({
  initialAmount: z.coerce.number().min(1, 'Amount must be at least 1'),
  recipientEmail: z.string().email().optional().or(z.literal('')),
  senderName: z.string().optional(),
  message: z.string().optional(),
  expiresAt: z.coerce.date().optional().nullable(),
  status: z.nativeEnum(GiftCardStatus).default(GiftCardStatus.ACTIVE),
});

type GiftCardFormValues = z.infer<typeof giftCardSchema>;

interface GiftCardsClientProps {
  initialGiftCards: GiftCard[];
}

export function GiftCardsClient({ initialGiftCards = [] }: GiftCardsClientProps) {
  const [giftCards, setGiftCards] = useState(initialGiftCards);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<GiftCardFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(giftCardSchema) as any,
    defaultValues: {
      initialAmount: 50,
      recipientEmail: '',
      senderName: '',
      message: '',
      status: GiftCardStatus.ACTIVE,
    },
  });

  const onSubmit = (data: GiftCardFormValues) => {
    startTransition(async () => {
      try {
        const result = await createGiftCard(data);
        if (result.success) {
          toast.success('Gift card created');
          setIsOpen(false);
          form.reset();
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
    const result = await getGiftCards();
    if (result.success && result.giftCards) {
      setGiftCards(result.giftCards);
    }
  };

  const handleStatusChange = async (id: string, status: GiftCardStatus) => {
    try {
      const result = await updateGiftCardStatus(id, status);
      if (result.success) {
        toast.success(`Status updated to ${status}`);
        refreshData();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gift card?')) return;
    try {
      const result = await deleteGiftCard(id);
      if (result.success) {
        toast.success('Gift card deleted');
        refreshData();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Gift Cards</h2>
          <p className='text-muted-foreground'>Issue and manage gift cards.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='mr-2 h-4 w-4' /> Issue Gift Card
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle>Issue Gift Card</DialogTitle>
              <DialogDescription>
                Create a new gift card code with a specific balance.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <FormField
                  control={form.control}
                  name='initialAmount'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='recipientEmail'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Email (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder='recipient@example.com' {...field} />
                      </FormControl>
                      <FormDescription>We'll email the code if provided.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name='senderName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sender Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder='Your Name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name='message'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder='Best wishes...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type='button' variant='outline' onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type='submit' disabled={isPending}>
                    {isPending ? 'Issuing...' : 'Issue Card'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Issued Gift Cards</CardTitle>
            <CardDescription>
                You have {giftCards.length} gift cards in the system.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {giftCards.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                            No gift cards found.
                        </TableCell>
                    </TableRow>
                ) : (
                    giftCards.map((card) => (
                        <TableRow key={card.id}>
                        <TableCell className='font-medium font-mono'>
                            <div className="flex items-center gap-2">
                                {card.code}
                                <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => copyCode(card.code)}>
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                        </TableCell>
                        <TableCell>
                            ${card.balance.toFixed(2)} <span className="text-xs text-muted-foreground">/ ${card.initialAmount}</span>
                        </TableCell>
                        <TableCell>
                           {card.recipientEmail || <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell>
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors 
                                ${card.status === 'ACTIVE' ? 'bg-green-500/15 text-green-700 dark:text-green-400' : ''}
                                ${card.status === 'USED' ? 'bg-blue-500/15 text-blue-700' : ''}
                                ${card.status === 'EXPIRED' ? 'bg-orange-500/15 text-orange-700' : ''}
                                ${card.status === 'DISABLED' ? 'bg-destructive/10 text-destructive' : ''}
                            `}>
                                {card.status}
                            </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                            {format(new Date(card.createdAt), 'MMM d, yyyy')}
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
                                <DropdownMenuItem onClick={() => handleStatusChange(card.id, 'ACTIVE')}>
                                    Mark Active
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(card.id, 'DISABLED')}>
                                    Disable
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className='text-destructive' onClick={() => handleDelete(card.id)}>
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
