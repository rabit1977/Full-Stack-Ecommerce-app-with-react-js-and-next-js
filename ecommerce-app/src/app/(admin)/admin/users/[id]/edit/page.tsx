// app/admin/users/[id]/edit/page.tsx

import { getUserByIdAction } from '@/actions/user-actions';
import { auth } from '@/auth';
import { EditUserForm } from '@/components/admin/edit-user-form';
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
import { ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Edit User Page - Server Component
 * 
 * Admin interface for editing user details
 */
export default async function EditUserPage({ params }: EditUserPageProps) {
  // Check admin authorization
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  // Await params in Next.js 15
  const { id } = await params;

  // Fetch user data
  const result = await getUserByIdAction(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const user = result.data;
  const isEditingSelf = session.user.id === user.id;

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-3xl mx-auto space-y-6'>
        {/* Header */}
        <div className='space-y-4'>
          <Button variant='ghost' asChild>
            <Link href='/admin/users'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Users
            </Link>
          </Button>

          <div className='flex items-start gap-4'>
            <Avatar className='h-16 w-16'>
              <AvatarImage 
                src={user.image ? (user.image.startsWith('http') || user.image.startsWith('/') ? user.image : `/${user.image}`) : undefined} 
                alt={user.name || 'User'} 
                className="object-cover"
              />
              <AvatarFallback className='text-xl'>
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <div className='flex items-center gap-3'>
                <h1 className='text-3xl font-bold tracking-tight'>Edit User</h1>
                <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'}>
                  <Shield className='h-3 w-3 mr-1' />
                  {user.role}
                </Badge>
              </div>
              <p className='text-muted-foreground mt-1'>
                Update account information for {user.name || user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Warning for editing own account */}
        {isEditingSelf && (
          <Card className='border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20'>
            <CardHeader>
              <CardTitle className='text-base flex items-center gap-2'>
                <Shield className='h-4 w-4' />
                Editing Your Own Account
              </CardTitle>
            </CardHeader>
            <CardContent className='text-sm text-muted-foreground'>
              You are editing your own account. Be careful when changing your role or email,
              as this may affect your access to admin features.
            </CardContent>
          </Card>
        )}

        {/* Edit Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Update the user&apos;s account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EditUserForm user={user} isEditingSelf={isEditingSelf} />
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className='border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20'>
          <CardHeader>
            <CardTitle className='text-base'>Important Notes</CardTitle>
          </CardHeader>
          <CardContent className='text-sm text-muted-foreground space-y-2'>
            <ul className='list-disc list-inside space-y-1'>
              <li>Email changes will require the user to verify their new email address</li>
              <li>Role changes take effect immediately</li>
              <li>You cannot change your own role to prevent accidental lockout</li>
              <li>Password can only be changed by the user for security reasons</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}