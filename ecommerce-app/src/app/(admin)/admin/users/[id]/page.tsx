// app/admin/users/[id]/page.tsx

import { getUserByIdAction } from '@/actions/user-actions';
import { auth } from '@/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { formatDateTime } from '@/lib/utils/formatters';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Edit,
    Mail,
    Shield,
    ShoppingBag,
    Star,
    XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

interface UserDetailsPageProps {
  params: Promise<{ id: string }>;
}

/**
 * User Details Page - Server Component
 *
 * Displays comprehensive user information for admin review
 */
export default async function UserDetailsPage({
  params,
}: UserDetailsPageProps) {
  // Check admin authorization
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  // Await params in Next.js 15
  const { id } = await params;

  // Fetch user with all related data
  const result = await getUserByIdAction(id);

  // Handle errors and not found
  if (!result.success || !result.data) {
    notFound();
  }

  const user = result.data;

  // Calculate user statistics
  const totalOrders = user.orders?.length || 0;
  const totalReviews = user.reviews?.length || 0;
  const totalSpent =
    user.orders?.reduce((sum, order) => sum + order.total, 0) || 0;
  const averageRating =
    totalReviews > 0
      ? (user.reviews?.reduce((sum, review) => sum + review.rating, 0) || 0) /
        totalReviews
      : 0;

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button variant='ghost' size='icon' asChild>
              <Link href='/admin/users'>
                <ArrowLeft className='h-5 w-5' />
              </Link>
            </Button>
            <div>
              <h1 className='text-3xl font-bold tracking-tight'>
                User Details
              </h1>
              <p className='text-muted-foreground mt-1'>
                Comprehensive user account information
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href={`/admin/users/${user.id}/edit`}>
              <Edit className='h-4 w-4 mr-2' />
              Edit User
            </Link>
          </Button>
        </div>

        <div className='grid lg:grid-cols-3 gap-6'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* User Profile Card */}
            <Card>
              <CardHeader>
                <div className='flex items-start gap-4'>
                  <Avatar className='h-20 w-20'>
                    <AvatarImage
                      src={user.image ? (user.image.startsWith('http') || user.image.startsWith('/') ? user.image : `/${user.image}`) : undefined}
                      alt={user.name || 'User'}
                      className="object-cover"
                    />
                    <AvatarFallback className='text-2xl'>
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1 space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <CardTitle className='text-2xl'>
                          {user.name || 'No name'}
                        </CardTitle>
                        <CardDescription className='flex items-center gap-2 mt-1'>
                          <Mail className='h-4 w-4' />
                          {user.email}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          user.role === 'ADMIN' ? 'destructive' : 'secondary'
                        }
                        className='text-sm'
                      >
                        <Shield className='h-3 w-3 mr-1' />
                        {user.role}
                      </Badge>
                    </div>
                    <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                      <div className='flex items-center gap-1'>
                        <Calendar className='h-4 w-4' />
                        <span>Joined {formatDateTime(user.createdAt)}</span>
                      </div>
                      {user.emailVerified ? (
                        <div className='flex items-center gap-1 text-green-600 dark:text-green-400'>
                          <CheckCircle2 className='h-4 w-4' />
                          <span>Verified</span>
                        </div>
                      ) : (
                        <div className='flex items-center gap-1 text-amber-600 dark:text-amber-400'>
                          <XCircle className='h-4 w-4' />
                          <span>Not Verified</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <Separator />

                {/* Account Details */}
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      User ID
                    </p>
                    <p className='text-sm font-mono mt-1 break-all'>
                      {user.id}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Account Type
                    </p>
                    <p className='text-sm mt-1 capitalize'>
                      {user.role?.toLowerCase() || 'User'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Created At
                    </p>
                    <p className='text-sm mt-1'>
                      {formatDateTime(user.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Last Updated
                    </p>
                    <p className='text-sm mt-1'>
                      {formatDateTime(user.updatedAt)}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                {user.bio && (
                  <>
                    <Separator />
                    <div>
                      <p className='text-sm font-medium text-muted-foreground mb-2'>
                        Biography
                      </p>
                      <p className='text-sm leading-relaxed'>{user.bio}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Recent Orders */}
            {user.orders && user.orders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    Latest {user.orders.length} orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {user.orders.map((order) => (
                      <div
                        key={order.id}
                        className='flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors'
                      >
                        <div className='space-y-1'>
                          <p className='text-sm font-medium'>
                            Order #{order.id.slice(0, 8)}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {formatDateTime(order.createdAt)}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='text-sm font-semibold'>
                            ${order.total.toFixed(2)}
                          </p>
                          <Badge variant='outline' className='text-xs'>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Reviews */}
            {user.reviews && user.reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                  <CardDescription>
                    Latest {user.reviews.length} product reviews
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {user.reviews.map((review) => (
                      <div
                        key={review.id}
                        className='p-3 border rounded-lg space-y-2'
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-1'>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          <p className='text-xs text-muted-foreground'>
                            {formatDateTime(review.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Statistics Card */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
                <CardDescription>User activity overview</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between p-3 bg-accent/50 rounded-lg'>
                    <div className='flex items-center gap-2'>
                      <ShoppingBag className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                      <span className='text-sm font-medium'>Total Orders</span>
                    </div>
                    <span className='text-lg font-bold'>{totalOrders}</span>
                  </div>

                  <div className='flex items-center justify-between p-3 bg-accent/50 rounded-lg'>
                    <div className='flex items-center gap-2'>
                      <Star className='h-4 w-4 text-yellow-600 dark:text-yellow-400' />
                      <span className='text-sm font-medium'>Reviews</span>
                    </div>
                    <span className='text-lg font-bold'>{totalReviews}</span>
                  </div>

                  {totalOrders > 0 && (
                    <div className='flex items-center justify-between p-3 bg-accent/50 rounded-lg'>
                      <div className='flex items-center gap-2'>
                        <ShoppingBag className='h-4 w-4 text-green-600 dark:text-green-400' />
                        <span className='text-sm font-medium'>Total Spent</span>
                      </div>
                      <span className='text-lg font-bold'>
                        ${totalSpent.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {totalReviews > 0 && (
                    <div className='flex items-center justify-between p-3 bg-accent/50 rounded-lg'>
                      <div className='flex items-center gap-2'>
                        <Star className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                        <span className='text-sm font-medium'>Avg. Rating</span>
                      </div>
                      <span className='text-lg font-bold'>
                        {averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <Button
                  asChild
                  variant='outline'
                  className='w-full justify-start'
                >
                  <Link href={`/admin/users/${user.id}/edit`}>
                    <Edit className='h-4 w-4 mr-2' />
                    Edit User
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  className='w-full justify-start'
                >
                  <Link href={`/admin/orders?userId=${user.id}`}>
                    <ShoppingBag className='h-4 w-4 mr-2' />
                    View Orders
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
