'use client';

import { getUserAddressesAction } from '@/actions/address-actions';
import { AddressCard } from '@/components/account/AddressCard';
import { AddressForm } from '@/components/account/AddressForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Address } from '@/generated/prisma/browser';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Loader2, MapPin, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AddressSelectorProps {
  selectedAddress?: Address | null;
  onSelect: (address: Address | null) => void;
  addressType?: 'SHIPPING' | 'BILLING';
  className?: string;
}

export function AddressSelector({
  selectedAddress,
  onSelect,
  addressType = 'SHIPPING',
  className,
}: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setIsLoading(true);
    const result = await getUserAddressesAction();
    if (result.success) {
      // Filter by address type
      const filtered = result.data.filter(
        (addr) => addr.type === addressType || addr.type === 'BOTH'
      );
      setAddresses(filtered);
      
      // Auto-select default if none selected
      if (!selectedAddress) {
        const defaultAddr = filtered.find((a) => a.isDefault);
        if (defaultAddr) {
          onSelect(defaultAddr);
        }
      }
    }
    setIsLoading(false);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    loadAddresses();
  };

  const handleSelectAddress = (address: Address) => {
    onSelect(address);
    setIsExpanded(false);
  };

  if (isLoading) {
    return (
      <Card className={cn('p-4', className)}>
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading addresses...</span>
        </div>
      </Card>
    );
  }

  if (addresses.length === 0) {
    return (
      <>
        <Card className={cn('p-6 text-center', className)}>
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-6 h-6 text-muted-foreground" />
          </div>
          <h4 className="font-medium mb-1">No {addressType.toLowerCase()} address</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Add an address to continue with checkout
          </p>
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        </Card>
        <AddressForm
          open={showForm}
          onOpenChange={setShowForm}
          onSuccess={handleFormSuccess}
        />
      </>
    );
  }

  return (
    <>
      <Card className={cn('overflow-hidden', className)}>
        {/* Selected Address Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-start justify-between text-left hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            {selectedAddress ? (
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">
                    {selectedAddress.firstName} {selectedAddress.lastName}
                  </span>
                  {selectedAddress.label && (
                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                      {selectedAddress.label}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                  {selectedAddress.street1}
                  {selectedAddress.street2 && `, ${selectedAddress.street2}`}
                  {`, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.postalCode}`}
                </p>
              </div>
            ) : (
              <div className="text-muted-foreground">
                <span className="font-medium text-foreground">Select an address</span>
                <p className="text-sm">Choose from your saved addresses</p>
              </div>
            )}
          </div>
          <div className="shrink-0 ml-2">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Expanded List */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border"
            >
              <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
                {addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    compact
                    selectable
                    selected={selectedAddress?.id === address.id}
                    onSelect={handleSelectAddress}
                  />
                ))}
                
                {/* Add new address button */}
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors text-sm text-muted-foreground hover:text-primary"
                >
                  <Plus className="w-4 h-4" />
                  Add new address
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <AddressForm
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleFormSuccess}
      />
    </>
  );
}
