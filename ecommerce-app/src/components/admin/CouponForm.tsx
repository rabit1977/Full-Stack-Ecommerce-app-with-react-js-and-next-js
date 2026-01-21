'use client';

import { createCouponAction } from '@/actions/coupon-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function CouponForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    expiresAt: '',
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.discount) {
      toast.error('Code and discount are required');
      return;
    }

    startTransition(async () => {
      const result = await createCouponAction({
        code: formData.code,
        discount: parseFloat(formData.discount),
        type: formData.type,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null,
        isActive: formData.isActive,
      });

      if (result.success) {
        toast.success(result.message);
        router.push('/admin/coupons');
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader className="border-b bg-muted/50">
        <CardTitle>Create New Coupon</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-semibold">Coupon Code</Label>
            <Input
              id="code"
              placeholder="e.g. SUMMER25"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="uppercase font-mono h-12 text-lg"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">Unique identifier used by customers at checkout.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-semibold">Discount Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                  <SelectItem value="FIXED">Fixed Amount ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount" className="text-sm font-semibold">Discount Value</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {formData.type === 'FIXED' ? '$' : '%'}
                </span>
                <Input
                  id="discount"
                  type="number"
                  step="0.01"
                  placeholder={formData.type === 'PERCENTAGE' ? '10' : '5.00'}
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="pl-8 h-11"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt" className="text-sm font-semibold">Expiry Date (Optional)</Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              className="h-11"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-base font-semibold">Active Status</Label>
              <p className="text-sm text-muted-foreground">Determine if this coupon can be used immediately.</p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked: boolean) => setFormData({ ...formData, isActive: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
              className="h-11 px-8"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="h-11 px-10 font-bold">
              {isPending ? 'Creating...' : 'Create Coupon'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
