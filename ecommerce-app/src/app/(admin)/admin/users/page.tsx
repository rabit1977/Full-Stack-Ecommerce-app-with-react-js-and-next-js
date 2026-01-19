// app/admin/users/page.tsx

import { getAllUsersAction } from '@/actions/user-actions';
import { auth } from '@/auth';
import { UsersDataTable } from '@/components/admin/users-data-table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Shield, User as UserIcon, UserPlus, Users } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

/**
 * Admin Users Page
 *
 * Displays all users with management capabilities
 * Only accessible by admins
 */
export default async function AdminUsersPage() {
  // Check authentication and authorization
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  // Fetch all users
  const result = await getAllUsersAction();

  if (!result.success) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='rounded-lg border border-destructive bg-destructive/10 p-4'>
          <p className='text-destructive'>{result.error}</p>
        </div>
      </div>
    );
  }

  const users = result.data;

  // Calculate stats
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const userCount = users.filter((u) => u.role === 'USER').length;

  return (
    <div className='container mx-auto px-4 py-8 space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>User Management</h1>
          <p className='text-muted-foreground mt-2'>
            Manage user accounts and permissions
          </p>
        </div>
        <Button asChild>
          <Link href='/admin/users/create'>
            <UserPlus className='h-4 w-4 mr-2' />
            Add User
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{users.length}</div>
            <p className='text-xs text-muted-foreground'>
              All registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Administrators
            </CardTitle>
            <Shield className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{adminCount}</div>
            <p className='text-xs text-muted-foreground'>Admin accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Regular Users</CardTitle>
            <UserIcon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{userCount}</div>
            <p className='text-xs text-muted-foreground'>Standard accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage all user accounts in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <UsersDataTable users={users} />
          ) : (
            <div className='text-center py-12 text-muted-foreground'>
              <Users className='h-12 w-12 mx-auto mb-4 opacity-50' />
              <p>No users found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
