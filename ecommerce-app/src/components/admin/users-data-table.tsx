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
import { useAppDispatch } from '@/lib/hooks/useAppDispatch';
import { deleteUserFromAdmin } from '@/lib/store/thunks/authThunks';
import { User } from '@/lib/types';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';

import { toast } from 'sonner';

interface UsersDataTableProps {
  users: User[];
}

export const UsersDataTable = ({ users }: UsersDataTableProps) => {
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const dispatch = useAppDispatch();

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;

    startTransition(async () => {
      try {
        await dispatch(deleteUserFromAdmin(userToDelete.id));
        toast.success(`User "${userToDelete.name}" deleted.`);
        setShowDeleteDialog(false);
        setUserToDelete(null);
      } catch (error) {
        toast.error((error as Error).message || 'Failed to delete user');
      }
    });
  };

  const columns = [
    {
      header: 'Name',
      cell: (user: User) => <span className='font-medium'>{user.name}</span>,
    },
    {
      header: 'Email',
      cell: (user: User) => user.email,
    },
    {
      header: 'Role',
      cell: (user: User) => user.role || 'customer',
    },
    {
      header: <span className='sr-only'>Actions</span>,
      cell: (user: User) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup='true' size='icon' variant='ghost'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem asChild>
              <Link href={`/admin/users/${user.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/users/${user.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className='text-red-500'
              onSelect={() => handleDeleteClick(user)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user
              <span className='font-semibold text-red-300'>
                {' '}
                {userToDelete?.name.toUpperCase()}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

