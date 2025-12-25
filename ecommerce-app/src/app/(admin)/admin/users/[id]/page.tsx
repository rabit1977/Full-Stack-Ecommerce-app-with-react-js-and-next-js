'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppSelector } from '@/lib/store/hooks';
import { formatDateTime } from '@/lib/utils/formatters';
import {
    ArrowLeft,
    Calendar,
    Edit,
    Heart,
    Mail,
    ShoppingBag,
    User as UserIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, use } from 'react';

interface UserDetailsPageProps {
  params: Promise<{ id: string }>;
}

/**
 * User details skeleton
 */
function UserDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/**
 * User not found component
 */
function UserNotFound() {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <UserIcon className="h-16 w-16 text-slate-300 dark:text-slate-600" />
      <h2 className="text-2xl font-bold dark:text-white">User Not Found</h2>
      <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
        The user you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Button onClick={() => router.push('/admin/users')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Users
      </Button>
    </div>
  );
}

/**
 * User details content
 */
function UserDetailsContent({ userId }: { userId: string }) {
  const router = useRouter();
  const user = useAppSelector((state) => 
    state.user.users.find((u) => u.id === userId)
  );

  if (!user) {
    return <UserNotFound />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/admin/users')}
              className="hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold dark:text-white">
              User Details
            </h1>
          </div>
        </div>
        <Button onClick={() => router.push(`/admin/users/${user.id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit User
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{user.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </CardDescription>
                </div>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    User ID
                  </p>
                  <p className="text-sm font-mono mt-1 dark:text-white">
                    {user.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Role
                  </p>
                  <p className="text-sm mt-1 dark:text-white capitalize">
                    {user.role || 'customer'}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Account Details
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">
                      Created: {user.createdAt ? formatDateTime(user.createdAt) : 'N/A'}
                    </span>
                  </div>
                  {user.updatedAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-400">
                        Updated: {formatDateTime(user.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Activity Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Cart Items
                  </span>
                </div>
                <span className="font-semibold dark:text-white">
                  {user.cart?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Wishlist
                  </span>
                </div>
                <span className="font-semibold dark:text-white">
                  {user.wishlist?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Saved Items
                  </span>
                </div>
                <span className="font-semibold dark:text-white">
                  {user.savedForLater?.length || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push(`/admin/users/${user.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit User
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/**
 * User details page with Suspense
 */
export default function UserDetailsPage({ params }: UserDetailsPageProps) {
  const { id } = use(params);

  return (
    <Suspense fallback={<UserDetailsSkeleton />}>
      <UserDetailsContent userId={id} />
    </Suspense>
  );
}
