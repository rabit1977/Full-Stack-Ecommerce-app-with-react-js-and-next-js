// app/admin/users/page.tsx

import { getAllUsersAction } from '@/actions/user-actions';
import { auth } from '@/auth';
import { UsersDataTable } from '@/components/admin/users-data-table';
import { Button } from '@/components/ui/button';
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
        <div className='rounded-lg border border-destructive bg-destructive/10 p-4 animate-in fade-in slide-in-from-top-2'>
          <p className='text-destructive font-medium'>{result.error}</p>
        </div>
      </div>
    );
  }

  const users = result.data;

  // Calculate stats
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const userCount = users.filter((u) => u.role === 'USER').length;

  return (
    <div className='space-y-8 pb-20'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500'>
        <div className='space-y-1'>
          <h1 className='text-3xl sm:text-4xl font-black tracking-tight text-foreground flex items-center gap-3'>
            Customers
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-inset ring-primary/20">
               {users.length}
            </span>
          </h1>
          <p className='text-lg text-muted-foreground font-medium'>
            Manage your store users and their roles
          </p>
        </div>
        <Button asChild size="lg" className="rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all btn-premium">
          <Link href='/admin/users/create'>
            <UserPlus className='h-5 w-5 mr-2' />
            Add New User
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-3 sm:gap-5 grid-cols-2 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100'>
        {[
            { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
            { label: 'Administrators', value: adminCount, icon: Shield, color: 'text-violet-500', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
            { label: 'Regular Customers', value: userCount, icon: UserIcon, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        ].map((stat, i) => (
             <div key={i} className={`glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex items-center justify-between hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group border gap-2 flex-row-reverse ${stat.border}`}>
                <div className='flex justify-between items-start mb-2'>
                    <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${stat.bg} ${stat.color} ring-1 ring-inset ring-white/10 group-hover:scale-110 transition-transform`}>
                       <stat.icon className='h-4 w-4 sm:h-6 sm:w-6' />
                    </div>
                </div>
                <div className='flex flex-col items-start min-w-24'>
                   <h3 className='text-xl sm:text-3xl font-black tracking-tight text-foreground'>{stat.value}</h3>
                   <p className='text-[10px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wider mt-0.5 sm:mt-1'>{stat.label}</p>
                </div>
             </div>
        ))}
      </div>

      {/* Users Table */}
      <div className='glass-card rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5 border border-border/60 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200'>
         <div className="p-8 border-b border-border/50 bg-secondary/5 backdrop-blur-sm flex items-center justify-between">
            <h2 className='text-xl font-bold flex items-center gap-3'>
              <Users className="h-5 w-5 text-primary" />
              All Registered Users
            </h2>
         </div>
         <div className='p-8 pt-0'>
          {users.length > 0 ? (
            <div className="mt-6">
                <UsersDataTable users={users} />
            </div>
          ) : (
            <div className='text-center py-20 text-muted-foreground'>
              <div className='w-20 h-20 mx-auto rounded-full bg-secondary flex items-center justify-center mb-6'>
                 <Users className='h-10 w-10 text-muted-foreground/50' />
              </div>
              <h3 className="text-xl font-bold text-foreground">No users found</h3>
              <p className="mt-2">Start by adding a new user to the system.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
