import { getUserAddressesAction } from '@/actions/address-actions';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AddressesClient } from './addresses-client';

export const metadata = {
  title: 'My Addresses | Account',
  description: 'Manage your shipping and billing addresses',
};

export default async function AddressesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/account/addresses');
  }

  const result = await getUserAddressesAction();
  const addresses = result.success ? result.data : [];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <AddressesClient initialAddresses={addresses} />
    </div>
  );
}
