'use client';

import { deleteAddressAction, setDefaultAddressAction } from '@/actions/address-actions';
import { Button } from '@/components/ui/button';
import { Address } from '@/generated/prisma/browser';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, MapPin, Plus } from 'lucide-react';
import { useState, useTransition } from 'react';
import { AddressCard } from './AddressCard';
import { AddressForm } from './AddressForm';

interface AddressListProps {
  addresses: Address[];
  onRefresh?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

export function AddressList({ addresses, onRefresh }: AddressListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleDelete = async (addressId: string) => {
    return deleteAddressAction(addressId);
  };

  const handleSetDefault = async (addressId: string) => {
    return setDefaultAddressAction(addressId);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingAddress(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    startTransition(() => {
      onRefresh?.();
    });
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">My Addresses</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your shipping and billing addresses
          </p>
        </div>
        <Button onClick={handleAddNew} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add New Address
        </Button>
      </div>

      {/* Address Grid */}
      {addresses.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {addresses.map((address) => (
              <motion.div
                key={address.id}
                variants={itemVariants}
                layout
              >
                <AddressCard
                  address={address}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onSetDefault={handleSetDefault}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 px-4 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No addresses yet</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            Add your first address to speed up checkout and manage deliveries easily.
          </p>
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Address
          </Button>
        </motion.div>
      )}

      {/* Address Form Modal */}
      <AddressForm
        address={editingAddress}
        open={isFormOpen}
        onOpenChange={handleFormClose}
        onSuccess={handleFormSuccess}
      />

      {/* Loading overlay */}
      {isPending && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-4 shadow-lg flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm">Refreshing...</span>
          </div>
        </div>
      )}
    </div>
  );
}
