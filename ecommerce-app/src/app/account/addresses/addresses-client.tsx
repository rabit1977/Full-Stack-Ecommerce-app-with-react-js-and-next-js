'use client';

import { AddressList } from '@/components/account/AddressList';
import { Address } from '@/generated/prisma/browser';
import { useRouter } from 'next/navigation';

interface AddressesClientProps {
  initialAddresses: Address[];
}

export function AddressesClient({ initialAddresses }: AddressesClientProps) {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  return <AddressList addresses={initialAddresses} onRefresh={handleRefresh} />;
}
