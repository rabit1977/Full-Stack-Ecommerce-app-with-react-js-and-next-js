import { getUsersAction } from '@/actions/auth-actions';
import { UsersDataTable } from '@/components/admin/users-data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default async function AdminUsersPage() {
  const { users, message } = await getUsersAction();

  if (!users) {
    return <p>{message}</p>;
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Users</h1>
        <Button asChild>
          <Link href='/admin/users/new'>
            <PlusCircle className='mr-2 h-4 w-4' />
            Create User
          </Link>
        </Button>
      </div>
      <UsersDataTable users={users} />
    </div>
  );
}