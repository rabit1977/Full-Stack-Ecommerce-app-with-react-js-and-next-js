'use client';

import { createAddressAction, updateAddressAction, type AddressInput } from '@/actions/address-actions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Address, AddressType } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';
import { Building2, Home, Loader2, Truck } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface AddressFormProps {
  address?: Address | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Netherlands',
  'Belgium',
  'Austria',
  'Switzerland',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Ireland',
  'Portugal',
  'Poland',
  'Czech Republic',
];

const addressTypes: { value: AddressType; label: string; icon: typeof Home }[] = [
  { value: 'SHIPPING', label: 'Shipping Only', icon: Truck },
  { value: 'BILLING', label: 'Billing Only', icon: Building2 },
  { value: 'BOTH', label: 'Both Shipping & Billing', icon: Home },
];

export function AddressForm({ address, open, onOpenChange, onSuccess }: AddressFormProps) {
  const [isPending, startTransition] = useTransition();
  const isEditing = !!address;

  // Form state
  const [type, setType] = useState<AddressType>(address?.type || 'BOTH');
  const [label, setLabel] = useState(address?.label || '');
  const [firstName, setFirstName] = useState(address?.firstName || '');
  const [lastName, setLastName] = useState(address?.lastName || '');
  const [company, setCompany] = useState(address?.company || '');
  const [street1, setStreet1] = useState(address?.street1 || '');
  const [street2, setStreet2] = useState(address?.street2 || '');
  const [city, setCity] = useState(address?.city || '');
  const [state, setState] = useState(address?.state || '');
  const [postalCode, setPostalCode] = useState(address?.postalCode || '');
  const [country, setCountry] = useState(address?.country || 'United States');
  const [phone, setPhone] = useState(address?.phone || '');
  const [deliveryInstructions, setDeliveryInstructions] = useState(address?.deliveryInstructions || '');
  const [isDefault, setIsDefault] = useState(address?.isDefault || false);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!street1.trim()) newErrors.street1 = 'Street address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const data: AddressInput = {
      type,
      label: label.trim() || undefined,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      company: company.trim() || undefined,
      street1: street1.trim(),
      street2: street2.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
      phone: phone.trim() || undefined,
      deliveryInstructions: deliveryInstructions.trim() || undefined,
      isDefault,
    };

    startTransition(async () => {
      const result = isEditing
        ? await updateAddressAction(address.id, data)
        : await createAddressAction(data);

      if (result.success) {
        toast.success(isEditing ? 'Address updated' : 'Address added');
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(result.error || 'Something went wrong');
      }
    });
  };

  const resetForm = () => {
    setType(address?.type || 'BOTH');
    setLabel(address?.label || '');
    setFirstName(address?.firstName || '');
    setLastName(address?.lastName || '');
    setCompany(address?.company || '');
    setStreet1(address?.street1 || '');
    setStreet2(address?.street2 || '');
    setCity(address?.city || '');
    setState(address?.state || '');
    setPostalCode(address?.postalCode || '');
    setCountry(address?.country || 'United States');
    setPhone(address?.phone || '');
    setDeliveryInstructions(address?.deliveryInstructions || '');
    setIsDefault(address?.isDefault || false);
    setErrors({});
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(v) => {
        if (!v) resetForm();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update your address details below.'
              : 'Fill in the details for your new address.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Address Type Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Address Type</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {addressTypes.map((option) => {
                const Icon = option.icon;
                const isSelected = type === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setType(option.value)}
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-lg border text-left transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Label */}
          <div className="space-y-2">
            <Label htmlFor="label" className="text-sm font-medium">
              Label (optional)
            </Label>
            <Input
              id="label"
              placeholder='e.g., "Home", "Work", "Parents"'
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={cn(errors.firstName && 'border-destructive')}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={cn(errors.lastName && 'border-destructive')}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-medium">
              Company (optional)
            </Label>
            <Input
              id="company"
              placeholder="Acme Inc."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          {/* Street Address */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street1" className="text-sm font-medium">
                Street Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="street1"
                placeholder="123 Main Street"
                value={street1}
                onChange={(e) => setStreet1(e.target.value)}
                className={cn(errors.street1 && 'border-destructive')}
              />
              {errors.street1 && (
                <p className="text-xs text-destructive">{errors.street1}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="street2" className="text-sm font-medium">
                Apartment, suite, etc. (optional)
              </Label>
              <Input
                id="street2"
                placeholder="Apt 4B"
                value={street2}
                onChange={(e) => setStreet2(e.target.value)}
              />
            </div>
          </div>

          {/* City, State, Postal */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                placeholder="New York"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={cn(errors.city && 'border-destructive')}
              />
              {errors.city && (
                <p className="text-xs text-destructive">{errors.city}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium">
                State/Province <span className="text-destructive">*</span>
              </Label>
              <Input
                id="state"
                placeholder="NY"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={cn(errors.state && 'border-destructive')}
              />
              {errors.state && (
                <p className="text-xs text-destructive">{errors.state}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode" className="text-sm font-medium">
                Postal Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="postalCode"
                placeholder="10001"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className={cn(errors.postalCode && 'border-destructive')}
              />
              {errors.postalCode && (
                <p className="text-xs text-destructive">{errors.postalCode}</p>
              )}
            </div>
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-medium">
              Country <span className="text-destructive">*</span>
            </Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className={cn(errors.country && 'border-destructive')}>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-xs text-destructive">{errors.country}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number (optional)
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Delivery Instructions */}
          <div className="space-y-2">
            <Label htmlFor="deliveryInstructions" className="text-sm font-medium">
              Delivery Instructions (optional)
            </Label>
            <Textarea
              id="deliveryInstructions"
              placeholder="Ring doorbell, leave at front porch, etc."
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              rows={2}
            />
          </div>

          {/* Default Checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="isDefault"
              checked={isDefault}
              onCheckedChange={(checked) => setIsDefault(checked === true)}
            />
            <Label htmlFor="isDefault" className="text-sm cursor-pointer">
              Set as default address
            </Label>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditing ? 'Update Address' : 'Add Address'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
