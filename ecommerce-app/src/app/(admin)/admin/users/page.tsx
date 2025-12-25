'use client';

import { Suspense, useMemo } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { UsersDataTable } from '@/components/admin/users-data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Users } from 'lucide-react';
import Link from 'next/link';

/**
 * Users list skeleton loader
 */
function UsersListSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Users list content component
 */
function UsersListContent() {
  const { users } = useAppSelector((state) => state.user);

  // Calculate user statistics
  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter((u) => u.role === 'admin').length,
    customers: users.filter((u) => u.role === 'customer').length,
  }), [users]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            <h1 className="text-3xl font-bold tracking-tight dark:text-white">
              Customers
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your customers and team members ({stats.total} total)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add User
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Users
              </p>
              <p className="text-3xl font-bold dark:text-white mt-2">
                {stats.total}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Admins
              </p>
              <p className="text-3xl font-bold dark:text-white mt-2">
                {stats.admins}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Customers
              </p>
              <p className="text-3xl font-bold dark:text-white mt-2">
                {stats.customers}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <UsersDataTable users={users} />
    </div>
  );
}

/**
 * Admin users page with Suspense boundary
 */
export default function AdminUsersPage() {
  return (
    <Suspense fallback={<UsersListSkeleton />}>
      <UsersListContent />
    </Suspense>
  );
}