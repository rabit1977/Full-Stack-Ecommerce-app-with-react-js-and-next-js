'use client';

import { deleteUserFromAdminAction } from '@/actions/user-actions';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Edit, Eye, MoreHorizontal, Shield, Trash2, UserCog, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { toast } from 'sonner';

interface UsersDataTableProps {
  users: User[];
}

/**
 * Mobile-optimized Users Data Table
 * Displays users as cards on mobile for better touch interaction
 */
export function UsersDataTable({ users }: UsersDataTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleDeleteClick = useCallback((user: User) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!userToDelete) return;

    startTransition(async () => {
      try {
        const result = await deleteUserFromAdminAction(userToDelete.id);

        if (result.success) {
          toast.success(result.message || `User "${userToDelete.name}" deleted successfully`);
          setShowDeleteDialog(false);
          setUserToDelete(null);
          router.refresh();
        } else {
          toast.error(result.error || 'Failed to delete user');
        }
      } catch (error) {
        console.error('Delete user error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to delete user');
      }
    });
  }, [userToDelete, router]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteDialog(false);
    setUserToDelete(null);
  }, []);

  if (users.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <UserIcon className='h-12 w-12 text-muted-foreground/30 mb-3' />
        <p className='text-muted-foreground font-medium'>No users found</p>
        <p className='text-sm text-muted-foreground/70'>Users will appear here when they register</p>
      </div>
    );
  }

  return (
    <>
      <div className='space-y-2 sm:space-y-3'>
        {users.map((user) => (
          <div
            key={user.id}
            className={cn(
              'group relative bg-card border border-border/50 rounded-xl',
              'p-3 sm:p-4',
              'hover:bg-muted/30 hover:border-primary/20 transition-all duration-200'
            )}
          >
            <div className='flex items-start gap-3'>
              {/* Avatar */}
              <div className='shrink-0'>
                {user.image ? (
                  <div className='relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden ring-2 ring-border'>
                    <Image 
                      src={user.image.startsWith('http') || user.image.startsWith('/') ? user.image : `/${user.image}`} 
                      alt={user.name || 'User'} 
                      fill
                      className='object-cover'
                    />
                  </div>
                ) : (
                  <div className='h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center ring-2 ring-border'>
                    <span className='text-sm sm:text-base font-bold text-primary'>
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className='flex-1 min-w-0 space-y-1'>
                {/* Name + Role */}
                <div className='flex items-center gap-2 flex-wrap'>
                  <Link 
                    href={`/admin/users/${user.id}`}
                    className='font-semibold text-sm sm:text-base text-foreground hover:text-primary transition-colors truncate'
                  >
                    {user.name || 'No name'}
                  </Link>
                  <Badge 
                    variant={user.role?.toLowerCase() === 'admin' ? 'destructive' : 'secondary'}
                    className='text-[9px] sm:text-[10px] px-1.5 py-0 h-5'
                  >
                    {user.role?.toLowerCase() === 'admin' ? (
                      <Shield className='h-2.5 w-2.5 mr-0.5' />
                    ) : (
                      <UserCog className='h-2.5 w-2.5 mr-0.5' />
                    )}
                    {(user.role || 'user').toUpperCase()}
                  </Badge>
                </div>

                {/* Email */}
                <p className='text-xs sm:text-sm text-muted-foreground truncate'>
                  {user.email}
                </p>

                {/* Date + Actions Row */}
                <div className='flex items-center justify-between gap-2 mt-2'>
                  <span className='text-[10px] sm:text-xs text-muted-foreground'>
                    Joined {user.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'N/A'
                    }
                  </span>

                  {/* Actions */}
                  <div className='flex items-center gap-1'>
                    <Button
                      variant='ghost'
                      size='sm'
                      asChild
                      className='h-8 w-8 p-0 rounded-lg'
                    >
                      <Link href={`/admin/users/${user.id}`}>
                        <Eye className='h-4 w-4' />
                        <span className='sr-only'>View user</span>
                      </Link>
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          aria-haspopup='true' 
                          size='sm' 
                          variant='ghost'
                          className='h-8 w-8 p-0 rounded-lg'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                          <span className='sr-only'>Open menu for {user.name}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='w-48'>
                        <DropdownMenuItem asChild>
                          <Link 
                            href={`/admin/users/${user.id}`}
                            className='cursor-pointer'
                          >
                            <Eye className='h-4 w-4 mr-2' />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link 
                            href={`/admin/users/${user.id}/edit`}
                            className='cursor-pointer'
                          >
                            <Edit className='h-4 w-4 mr-2' />
                            Edit User
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className='text-destructive focus:text-destructive cursor-pointer'
                          onSelect={() => handleDeleteClick(user)}
                        >
                          <Trash2 className='h-4 w-4 mr-2' />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className='max-w-[90vw] sm:max-w-lg rounded-2xl'>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account for
              {' '}
              <span className='font-semibold text-foreground'>
                {userToDelete?.name || 'this user'}
              </span>
              {' '}
              ({userToDelete?.email}) and remove all their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex-col sm:flex-row gap-2'>
            <AlertDialogCancel 
              onClick={handleCancelDelete}
              disabled={isPending}
              className='w-full sm:w-auto'
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isPending}
              className='w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {isPending ? (
                <>
                  <span className='animate-spin mr-2'>⏳</span>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className='h-4 w-4 mr-2' />
                  Delete User
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}