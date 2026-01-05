import { getUserByIdAction } from '@/actions/auth-actions';
import { EditUserForm } from '@/components/admin/edit-user-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  // Await params in Next.js 15
  const { id } = await params;
  const { user, success, message } = await getUserByIdAction(id);

  if (!success || !user) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Link>
        </Button>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">
            Edit User
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Update user information for {user.name}
          </p>
        </div>

        {/* Edit Form */}
        <EditUserForm user={user} />
      </div>
    </div>
  );
}