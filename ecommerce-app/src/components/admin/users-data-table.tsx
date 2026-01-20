'use client';

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
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { User } from '@/lib/types';
import { deleteUserFromAdminAction } from '@/actions/user-actions';
import { MoreHorizontal, Trash2, Eye, Edit, UserCog } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition, useCallback } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface UsersDataTableProps {
  users: User[];
}

/**
 * Users Data Table Component
 * 
 * Admin interface for managing users
 * Features:
 * - View user details
 * - Edit user information
 * - Delete users (with confirmation)
 * - Role badges
 * - Optimistic updates
 */
export function UsersDataTable({ users }: UsersDataTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  /**
   * Handle delete button click
   */
  const handleDeleteClick = useCallback((user: User) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  }, []);

  /**
   * Handle delete confirmation
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!userToDelete) return;

    startTransition(async () => {
      try {
        const result = await deleteUserFromAdminAction(userToDelete.id);

        if (result.success) {
          toast.success(result.message || `User "${userToDelete.name}" deleted successfully`);
          setShowDeleteDialog(false);
          setUserToDelete(null);
          
          // Refresh the page data
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

  /**
   * Handle cancel delete
   */
  const handleCancelDelete = useCallback(() => {
    setShowDeleteDialog(false);
    setUserToDelete(null);
  }, []);

  /**
   * Get role badge variant based on role
   */
  const getRoleBadgeVariant = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'destructive';
      case 'user':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  /**
   * Table columns configuration
   */
  const columns = [
    {
      header: 'Name',
      cell: (user: User) => (
        <div className='flex items-center gap-2'>
          {user.image ? (
            <img 
              src={user.image} 
              alt={user.name || 'User'} 
              className='h-8 w-8 rounded-full object-cover'
            />
          ) : (
            <div className='h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center'>
              <span className='text-sm font-semibold text-primary'>
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <span className='font-medium'>{user.name || 'No name'}</span>
        </div>
      ),
    },
    {
      header: 'Email',
      cell: (user: User) => (
        <span className='text-muted-foreground'>{user.email}</span>
      ),
    },
    {
      header: 'Role',
      cell: (user: User) => (
        <Badge variant={getRoleBadgeVariant(user.role || 'user')}>
          <UserCog className='h-3 w-3 mr-1' />
          {(user.role || 'user').toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Created',
      cell: (user: User) => (
        <span className='text-sm text-muted-foreground'>
          {user.createdAt 
            ? new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : 'N/A'
          }
        </span>
      ),
    },
    {
      header: <span className='sr-only'>Actions</span>,
      cell: (user: User) => (
        <div className='flex justify-end'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                aria-haspopup='true' 
                size='icon' 
                variant='ghost'
                className='h-8 w-8'
              >
                <MoreHorizontal className='h-4 w-4' />
                <span className='sr-only'>Open menu for {user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
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
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={users}
        columns={columns}
        keyExtractor={(user) => user.id}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
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
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={handleCancelDelete}
              disabled={isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isPending}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
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