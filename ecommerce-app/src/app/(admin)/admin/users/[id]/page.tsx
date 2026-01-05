import { getUserByIdAction } from '@/actions/auth-actions';
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
  Edit,
  Heart,
  Mail,
  ShoppingBag,
  User as UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface UserDetailsPageProps {
  params: Promise<{ id: string }>;
}

/**
 * User not found component
 */
function UserNotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh] space-y-4'>
      <UserIcon className='h-16 w-16 text-slate-300 dark:text-slate-600' />
      <h2 className='text-2xl font-bold dark:text-white'>User Not Found</h2>
      <p className='text-slate-600 dark:text-slate-400 text-center max-w-md'>
        The user you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Button asChild>
        <Link href='/admin/users'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back to Users
        </Link>
      </Button>
    </div>
  );
}

/**
 * User details page - Server Component
 */
export default async function UserDetailsPage({
  params,
}: UserDetailsPageProps) {
  // Await params in Next.js 15
  const { id } = await params;

  // Fetch user from database
  const result = await getUserByIdAction(id);

  // Handle user not found
  if (!result.success || !result.user) {
    notFound();
  }

  const user = result.user;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-3'>
            <Button variant='ghost' size='icon' asChild>
              <Link href='/admin/users'>
                <ArrowLeft className='h-5 w-5' />
              </Link>
            </Button>
            <h1 className='text-2xl font-bold dark:text-white'>User Details</h1>
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
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <CardTitle className='text-xl'>{user.name}</CardTitle>
                  <CardDescription className='flex items-center gap-2'>
                    <Mail className='h-4 w-4' />
                    {user.email}
                  </CardDescription>
                </div>
                <Badge
                  variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                >
                  {user.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                    User ID
                  </p>
                  <p className='text-sm font-mono mt-1 dark:text-white'>
                    {user.id}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                    Role
                  </p>
                  <p className='text-sm mt-1 dark:text-white capitalize'>
                    {user.role || 'customer'}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className='text-sm font-medium text-slate-600 dark:text-slate-400 mb-2'>
                  Account Details
                </p>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-sm'>
                    <Calendar className='h-4 w-4 text-slate-400' />
                    <span className='text-slate-600 dark:text-slate-400'>
                      Created:{' '}
                      {user.createdAt ? formatDateTime(user.createdAt) : 'N/A'}
                    </span>
                  </div>
                  {user.updatedAt && (
                    <div className='flex items-center gap-2 text-sm'>
                      <Calendar className='h-4 w-4 text-slate-400' />
                      <span className='text-slate-600 dark:text-slate-400'>
                        Updated: {formatDateTime(user.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {user.bio && (
                <>
                  <Separator />
                  <div>
                    <p className='text-sm font-medium text-slate-600 dark:text-slate-400 mb-2'>
                      Bio
                    </p>
                    <p className='text-sm text-slate-700 dark:text-slate-300'>
                      {user.bio}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Activity Stats */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Activity</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Heart className='h-4 w-4 text-slate-400' />
                  <span className='text-sm text-slate-600 dark:text-slate-400'>
                    Wishlist Items
                  </span>
                </div>
                <span className='font-semibold dark:text-white'>
                  {user.wishlistCount || 0}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <ShoppingBag className='h-4 w-4 text-slate-400' />
                  <span className='text-sm text-slate-600 dark:text-slate-400'>
                    Total Orders
                  </span>
                </div>
                <span className='font-semibold dark:text-white'>
                  {user.ordersCount || 0}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Mail className='h-4 w-4 text-slate-400' />
                  <span className='text-sm text-slate-600 dark:text-slate-400'>
                    Cart Items
                  </span>
                </div>
                <span className='font-semibold dark:text-white'>
                  {user.cartCount || 0}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Mail className='h-4 w-4 text-slate-400' />
                  <span className='text-sm text-slate-600 dark:text-slate-400'>
                    Reviews Written
                  </span>
                </div>
                <span className='font-semibold dark:text-white'>
                  {user.reviewsCount || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
