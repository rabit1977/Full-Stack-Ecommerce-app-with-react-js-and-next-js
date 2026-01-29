'use client';

import { updateStoreSettings } from '@/actions/admin/settings-actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { StoreSettings } from '@/generated/prisma/browser';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const storeSettingsSchema = z.object({
  storeName: z.string().min(1, 'Store name is required'),
  storeEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  storePhone: z.string().optional().or(z.literal('')),
  currency: z.string().min(1, 'Currency is required'),
  currencySymbol: z.string().min(1, 'Currency symbol is required'),
  taxEnabled: z.boolean().default(false),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  taxIncluded: z.boolean().default(false),
  guestCheckout: z.boolean().default(true),
  minOrderAmount: z.coerce.number().default(0),
  trackInventory: z.boolean().default(true),
  facebook: z.string().optional().or(z.literal('')),
  instagram: z.string().optional().or(z.literal('')),
  twitter: z.string().optional().or(z.literal('')),
  termsOfService: z.string().optional().or(z.literal('')),
  privacyPolicy: z.string().optional().or(z.literal('')),
  returnPolicy: z.string().optional().or(z.literal('')),
});

type StoreSettingsValues = z.infer<typeof storeSettingsSchema>;

interface SettingsClientProps {
  initialData?: StoreSettings | null;
}

export function SettingsClient({ initialData }: SettingsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<StoreSettingsValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(storeSettingsSchema) as any,
    defaultValues: {
      storeName: initialData?.storeName || 'My E-Commerce Store',
      storeEmail: initialData?.storeEmail || '',
      storePhone: initialData?.storePhone || '',
      currency: initialData?.currency || 'USD',
      currencySymbol: initialData?.currencySymbol || '$',
      taxEnabled: initialData?.taxEnabled ?? false,
      taxRate: initialData?.taxRate ? Number(initialData.taxRate) : 0,
      taxIncluded: initialData?.taxIncluded ?? false,
      guestCheckout: initialData?.guestCheckout ?? true,
      minOrderAmount: initialData?.minOrderAmount ? Number(initialData.minOrderAmount) : 0,
      trackInventory: initialData?.trackInventory ?? true,
      facebook: initialData?.facebook || '',
      instagram: initialData?.instagram || '',
      twitter: initialData?.twitter || '',
      termsOfService: initialData?.termsOfService || '',
      privacyPolicy: initialData?.privacyPolicy || '',
      returnPolicy: initialData?.returnPolicy || '',
    },
  });

  function onSubmit(data: StoreSettingsValues) {
    startTransition(async () => {
      try {
        const result = await updateStoreSettings(data);
        if (result.success) {
          toast.success('Store settings updated successfully');
          router.refresh();
        } else {
          toast.error(result.error || 'Failed to update settings');
        }
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong');
      }
    });
  }

  return (
    <div className='flex-col space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl md:text-3xl font-bold tracking-tight'>Store Settings</h2>
          <p className='text-muted-foreground text-sm md:text-base'>
            Manage your store preferences and configurations.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <Tabs defaultValue='general' className='space-y-4 text-sm w-full'>
            <TabsList className="w-full h-auto p-2 bg-muted/60 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value='general' className='h-9 md:h-10 text-xs md:text-sm w-full data-[state=active]:bg-background data-[state=active]:shadow-sm'>General</TabsTrigger>
              <TabsTrigger value='checkout' className='h-9 md:h-10 text-xs md:text-sm w-full data-[state=active]:bg-background data-[state=active]:shadow-sm'>Checkout & Inventory</TabsTrigger>
              <TabsTrigger value='social' className='h-9 md:h-10 text-xs md:text-sm w-full data-[state=active]:bg-background data-[state=active]:shadow-sm'>Social Media</TabsTrigger>
              <TabsTrigger value='policies' className='h-9 md:h-10 text-xs md:text-sm w-full data-[state=active]:bg-background data-[state=active]:shadow-sm'>Policies</TabsTrigger>
            </TabsList>

            <TabsContent value='general'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-base md:text-xl'>General Information</CardTitle>
                  <CardDescription className='text-xs md:text-sm'>
                    Basic details about your store.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='storeName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xs md:text-sm'>Store Name</FormLabel>
                        <FormControl>
                          <Input className='text-xs md:text-sm p-2 md:p-3 h-8 md:h-10 w-full rounded-md text-foreground' placeholder='My Store' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='storeEmail'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-xs md:text-sm'>Support Email</FormLabel>
                          <FormControl>
                            <Input className='text-xs md:text-sm p-2 md:p-3 h-8 md:h-10 w-full rounded-md text-foreground' placeholder='support@example.com' {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='storePhone'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-xs md:text-sm'>Support Phone</FormLabel>
                          <FormControl>
                            <Input className='text-xs md:text-sm p-2 md:p-3 h-8 md:h-10 w-full rounded-md text-foreground' placeholder='+1 (555) 000-0000' {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='currency'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-xs md:text-sm'>Currency Code</FormLabel>
                          <FormControl>
                            <Input className='text-xs md:text-sm p-2 md:p-3 h-8 md:h-10 w-full rounded-md text-foreground' placeholder='USD' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='currencySymbol'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel   className='text-xs md:text-sm'>Currency Symbol</FormLabel>
                          <FormControl>
                            <Input className='text-xs md:text-sm p-2 md:p-3 h-8 md:h-10 w-full rounded-md text-foreground ' placeholder='$' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='checkout'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-base md:text-xl'>Checkout & Inventory</CardTitle>
                  <CardDescription className='text-xs md:text-sm'>
                    Configure how customers shop and checkout.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-xs md:text-sm'>
                        Guest Checkout
                      </FormLabel>
                      <FormDescription className='text-xs md:text-sm'>
                        Allow customers to checkout without creating an account.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <FormField
                        control={form.control}
                        name='guestCheckout'
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                  <div className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-xs md:text-sm'>
                        Track Inventory
                      </FormLabel>
                      <FormDescription className='text-xs md:text-sm'>
                        Automatically decrease stock when orders are placed.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <FormField
                        control={form.control}
                        name='trackInventory'
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                   <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='taxEnabled'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4 mb-2'>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className='space-y-1 leading-none w-full'>
                            <FormLabel className='text-xs md:text-sm'>Enable Tax</FormLabel>
                            <FormDescription className='text-xs md:text-sm'>
                                Calculate tax on checkout
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                        control={form.control}
                        name='taxRate'
                        render={({ field }) => (
                          <FormItem>
                             <FormLabel className='text-xs md:text-sm'>Tax Rate (%)</FormLabel>
                             <FormControl>
                                <Input type="number" step="0.01" className='text-xs md:text-sm p-2 md:p-3 h-8 md:h-10 w-full rounded-md text-foreground' {...field} />
                             </FormControl>
                             <FormMessage />
                          </FormItem>
                        )}
                    />
                   </div>
                   <FormField
                      control={form.control}
                      name='minOrderAmount'
                      render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormLabel className='text-xs md:text-sm'>Minimum Order Amount</FormLabel>
                            <FormControl>
                                <Input type="number" step="1" className='text-xs md:text-sm p-2 md:p-3 h-8 md:h-10 w-full rounded-md text-foreground' {...field} />
                            </FormControl>
                            <FormDescription className='text-xs md:text-sm'>Set to 0 to disable</FormDescription>
                        </FormItem>
                      )}
                   />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='social'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-sm md:text-xl'>Social Media Links</CardTitle>
                  <CardDescription className='text-xs md:text-sm'>
                    Links to your social media profiles.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='facebook'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormLabel className='text-xs md:text-sm'>Facebook URL</FormLabel>
                        <FormControl>
                          <Input className='text-xs md:text-sm p-2 md:p-3 h-8 md:h-10 w-full rounded-md text-foreground' placeholder='https://facebook.com/yourpage' {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='instagram'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormLabel className='text-xs md:text-sm'>Instagram URL</FormLabel>
                        <FormControl>
                          <Input className='text-xs md:text-sm p-2 md:p-3 h-8 md:h-10 w-full rounded-md text-foreground' placeholder='https://instagram.com/yourhandle' {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='twitter'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormLabel className='text-xs md:text-sm'>Twitter/X URL</FormLabel>
                        <FormControl>
                          <Input className='text-xs md:text-sm p-2 md:p-3 h-8 md:h-10 w-full rounded-md text-foreground' placeholder='https://twitter.com/yourhandle' {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='policies'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-sm md:text-xl'>Store Policies</CardTitle>
                  <CardDescription className='text-xs md:text-sm'>
                    Details for your Terms, Privacy, and Returns.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <FormField
                        control={form.control}
                        name='termsOfService'
                        render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormLabel className='text-xs md:text-sm'>Terms of Service</FormLabel>
                            <FormControl>
                                <Textarea className="min-h-[100px] md:min-h-[150px] text-xs md:text-sm p-2 md:p-3 h-8 md:h-auto w-full rounded-md text-foreground" placeholder='Your terms...' {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='privacyPolicy'
                        render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormLabel className='text-xs md:text-sm'>Privacy Policy</FormLabel>
                            <FormControl>
                                <Textarea className="min-h-[100px] md:min-h-[150px] text-xs md:text-sm p-2 md:p-3 h-8 md:h-auto w-full rounded-md text-foreground" placeholder='Your privacy policy...' {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name='returnPolicy'
                        render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormLabel className='text-xs md:text-sm'>Return Policy</FormLabel>
                            <FormControl>
                                <Textarea className="min-h-[100px] md:min-h-[150px] text-xs md:text-sm p-2 md:p-3 h-8 md:h-auto w-full rounded-md text-foreground" placeholder='Your return policy...' {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className='flex justify-end'>
            <Button type='submit' className="h-10 px-4 py-2 text-sm md:h-12 md:px-8 md:text-base w-full md:w-auto" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                <>
                  <Save className='mr-2 h-4 w-4' />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
