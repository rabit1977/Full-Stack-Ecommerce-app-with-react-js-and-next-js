'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Address } from '@/generated/prisma/browser';
import { cn } from '@/lib/utils';
import {
    Building2,
    Check,
    Edit2,
    Home,
    MapPin,
    MoreVertical,
    Phone,
    Star,
    Trash2,
    Truck
} from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface AddressCardProps {
  address: Address;
  onEdit?: (address: Address) => void;
  onDelete?: (addressId: string) => Promise<{ success: boolean; error?: string }>;
  onSetDefault?: (addressId: string) => Promise<{ success: boolean; error?: string }>;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (address: Address) => void;
  compact?: boolean;
}

const typeIcons = {
  SHIPPING: Truck,
  BILLING: Building2,
  BOTH: Home,
};

const typeLabels = {
  SHIPPING: 'Shipping',
  BILLING: 'Billing',
  BOTH: 'Shipping & Billing',
};

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  selectable = false,
  selected = false,
  onSelect,
  compact = false,
}: AddressCardProps) {
  const [isPending, startTransition] = useTransition();

  const TypeIcon = typeIcons[address.type];

  const handleDelete = () => {
    if (!onDelete) return;
    
    startTransition(async () => {
      const result = await onDelete(address.id);
      if (result.success) {
        toast.success('Address deleted');
      } else {
        toast.error(result.error || 'Failed to delete address');
      }
    });
  };

  const handleSetDefault = () => {
    if (!onSetDefault || address.isDefault) return;
    
    startTransition(async () => {
      const result = await onSetDefault(address.id);
      if (result.success) {
        toast.success('Default address updated');
      } else {
        toast.error(result.error || 'Failed to set default');
      }
    });
  };

  const formattedAddress = [
    address.street1,
    address.street2,
    `${address.city}, ${address.state} ${address.postalCode}`,
    address.country,
  ].filter(Boolean).join(', ');

  if (compact) {
    return (
      <div
        onClick={() => onSelect?.(address)}
        className={cn(
          'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all',
          selected
            ? 'border-primary bg-primary/5 ring-1 ring-primary'
            : 'border-border hover:border-primary/50 hover:bg-muted/50',
          isPending && 'opacity-50 pointer-events-none'
        )}
      >
        {selectable && (
          <div className={cn(
            'mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
            selected ? 'border-primary bg-primary' : 'border-muted-foreground'
          )}>
            {selected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">
              {address.firstName} {address.lastName}
            </span>
            {address.label && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {address.label}
              </Badge>
            )}
            {address.isDefault && (
              <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary">
                Default
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {formattedAddress}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn(
      'relative overflow-hidden transition-all hover:shadow-md',
      selected && 'ring-2 ring-primary',
      isPending && 'opacity-50 pointer-events-none'
    )}>
      {/* Header with type and actions */}
      <div className="flex items-center justify-between p-4 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            'bg-primary/10 text-primary'
          )}>
            <TypeIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              {address.label ? (
                <span className="font-medium text-sm">{address.label}</span>
              ) : (
                <span className="font-medium text-sm">{typeLabels[address.type]}</span>
              )}
              {address.isDefault && (
                <Badge className="text-[10px] px-1.5 py-0 bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400">
                  <Star className="w-2.5 h-2.5 mr-0.5 fill-current" />
                  Default
                </Badge>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground">
              {typeLabels[address.type]}
            </span>
          </div>
        </div>

        {(onEdit || onDelete || onSetDefault) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(address)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {onSetDefault && !address.isDefault && (
                <DropdownMenuItem onClick={handleSetDefault}>
                  <Star className="w-4 h-4 mr-2" />
                  Set as Default
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Address content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-medium">
              {address.firstName} {address.lastName}
            </p>
            {address.company && (
              <p className="text-muted-foreground">{address.company}</p>
            )}
            <p className="text-muted-foreground">{address.street1}</p>
            {address.street2 && (
              <p className="text-muted-foreground">{address.street2}</p>
            )}
            <p className="text-muted-foreground">
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p className="text-muted-foreground">{address.country}</p>
          </div>
        </div>

        {address.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>{address.phone}</span>
          </div>
        )}

        {address.deliveryInstructions && (
          <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2 mt-2">
            <span className="font-medium">Delivery instructions:</span>{' '}
            {address.deliveryInstructions}
          </div>
        )}
      </div>

      {/* Selectable overlay */}
      {selectable && (
        <button
          onClick={() => onSelect?.(address)}
          className={cn(
            'absolute inset-0 z-10 transition-colors',
            selected ? 'bg-primary/5' : 'hover:bg-muted/30'
          )}
          aria-label={`Select address: ${address.label || formattedAddress}`}
        />
      )}
    </Card>
  );
}
