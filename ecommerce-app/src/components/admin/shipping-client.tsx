'use client';

import {
    createShippingRate,
    createShippingZone,
    deleteShippingRate,
    deleteShippingZone,
    getShippingRates,
    getShippingZones
} from '@/actions/admin/shipping-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShippingRate, ShippingZone } from '@/generated/prisma/browser';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Plus, Trash, Truck } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// --- SCHEMAS (duplicated from server action for client validation consistency) ---
const zoneSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  countries: z.string().optional(),
  isActive: z.boolean().default(true),
});

const rateSchema = z.object({
  zoneId: z.string().min(1, 'Zone is required'),
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['flat', 'weight_based', 'price_based', 'free']),
  price: z.coerce.number().min(0).optional(),
  minOrderAmount: z.coerce.number().min(0).optional(),
  minDays: z.coerce.number().int().min(0).optional(),
  maxDays: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().default(true),
});

type ZoneFormValues = z.infer<typeof zoneSchema>;
type RateFormValues = z.infer<typeof rateSchema>;

interface ShippingClientProps {
  initialZones: ShippingZone[];
  initialRates: (ShippingRate & { zone: { name: string } })[];
}

export function ShippingClient({ initialZones = [], initialRates = [] }: ShippingClientProps) {
  const [zones, setZones] = useState(initialZones);
  const [rates, setRates] = useState(initialRates);
  const [isZoneOpen, setIsZoneOpen] = useState(false);
  const [isRateOpen, setIsRateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const zoneForm = useForm<ZoneFormValues>({
    resolver: zodResolver(zoneSchema),
    defaultValues: {
      name: '',
      countries: '',
      isActive: true,
    },
  });

  const rateForm = useForm<RateFormValues>({
    resolver: zodResolver(rateSchema),
    defaultValues: {
      zoneId: '',
      name: '',
      type: 'flat',
      price: 0,
      minOrderAmount: 0,
      minDays: 3,
      maxDays: 5,
      isActive: true,
    },
  });

  const onZoneSubmit = (data: ZoneFormValues) => {
    startTransition(async () => {
      const result = await createShippingZone(data);
      if (result.success) {
        toast.success('Zone created');
        setIsZoneOpen(false);
        zoneForm.reset();
        refreshZones();
      } else {
        toast.error(result.error);
      }
    });
  };

  const onRateSubmit = (data: RateFormValues) => {
    startTransition(async () => {
      const result = await createShippingRate(data);
      if (result.success) {
        toast.success('Rate created');
        setIsRateOpen(false);
        rateForm.reset();
        refreshRates();
      } else {
        toast.error(result.error);
      }
    });
  };

  const refreshZones = async () => {
    const result = await getShippingZones();
    if (result.success && result.zones) setZones(result.zones);
  };

  const refreshRates = async () => {
    const result = await getShippingRates();
    // @ts-ignore
    if (result.success && result.rates) setRates(result.rates);
  };

  const deleteZone = async (id: string) => {
    if (!confirm('Delete this zone? It may affect existing rates.')) return;
    const result = await deleteShippingZone(id);
    if (result.success) {
      toast.success('Zone deleted');
      refreshZones();
    } else {
      toast.error(result.error);
    }
  };

  const deleteRate = async (id: string) => {
    if (!confirm('Delete this rate?')) return;
    const result = await deleteShippingRate(id);
    if (result.success) {
      toast.success('Rate deleted');
      refreshRates();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Shipping</h2>
        <p className='text-muted-foreground'>Manage shipping zones and calculation rates.</p>
      </div>

      <Tabs defaultValue="zones" className="space-y-4">
        <TabsList>
          <TabsTrigger value="zones" className="gap-2"><Globe className="h-4 w-4" /> Zones</TabsTrigger>
          <TabsTrigger value="rates" className="gap-2"><Truck className="h-4 w-4" /> Rates</TabsTrigger>
        </TabsList>

        <TabsContent value="zones" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isZoneOpen} onOpenChange={setIsZoneOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className='mr-2 h-4 w-4' /> New Zone
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Shipping Zone</DialogTitle>
                </DialogHeader>
                <Form {...zoneForm}>
                  <form onSubmit={zoneForm.handleSubmit(onZoneSubmit)} className="space-y-4">
                    <FormField
                      control={zoneForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zone Name</FormLabel>
                          <FormControl><Input placeholder="North America" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={zoneForm.control}
                      name="countries"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Countries (Codes)</FormLabel>
                          <FormControl><Input placeholder="US, CA, MX" {...field} /></FormControl>
                          <FormDescription>Comma-separated ISO codes.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isPending} className="w-full">
                      {isPending ? 'Saving...' : 'Create Zone'}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader><CardTitle>Shipping Zones</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                     <TableHead>Name</TableHead>
                     <TableHead>Countries</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zones.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No zones created.</TableCell></TableRow>
                  ) : (
                    zones.map(zone => (
                      <TableRow key={zone.id}>
                        <TableCell className="font-medium">{zone.name}</TableCell>
                        <TableCell>{zone.countries.join(', ') || 'Global'}</TableCell>
                        <TableCell>{zone.isActive ? 'Active' : 'Inactive'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => deleteZone(zone.id)} className="text-destructive">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates" className="space-y-4">
           <div className="flex justify-end">
            <Dialog open={isRateOpen} onOpenChange={setIsRateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className='mr-2 h-4 w-4' /> Add Rate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Shipping Rate</DialogTitle>
                </DialogHeader>
                <Form {...rateForm}>
                  <form onSubmit={rateForm.handleSubmit(onRateSubmit)} className="space-y-4">
                    <FormField
                      control={rateForm.control}
                      name="zoneId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Zone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {zones.map(zone => (
                                <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={rateForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rate Name</FormLabel>
                          <FormControl><Input placeholder="Standard Shipping" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={rateForm.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="flat">Flat Rate</SelectItem>
                                        <SelectItem value="free">Free Shipping</SelectItem>
                                        <SelectItem value="price_based">Price Based</SelectItem>
                                    </SelectContent>
                                </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={rateForm.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Cost ($)</FormLabel>
                                <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <FormField
                            control={rateForm.control}
                            name="minDays"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Min Days</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={rateForm.control}
                            name="maxDays"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Max Days</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                     </div>
                    <Button type="submit" disabled={isPending} className="w-full">
                      {isPending ? 'Saving...' : 'Add Rate'}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
           </div>
           
           <Card>
            <CardHeader><CardTitle>Shipping Rates</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                     <TableHead>Service</TableHead>
                     <TableHead>Zone</TableHead>
                     <TableHead>Type</TableHead>
                     <TableHead>Cost</TableHead>
                     <TableHead>Time</TableHead>
                     <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rates.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No rates found.</TableCell></TableRow>
                  ) : (
                    rates.map(rate => (
                      <TableRow key={rate.id}>
                        <TableCell className="font-medium">{rate.name}</TableCell>
                        <TableCell>{rate.zone.name}</TableCell>
                        <TableCell className="capitalize">{rate.type.replace('_', ' ')}</TableCell>
                        <TableCell>${rate.price?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell>{rate.minDays}-{rate.maxDays} days</TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="icon" onClick={() => deleteRate(rate.id)} className="text-destructive">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
