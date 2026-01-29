import { getAllQuestionsAction } from '@/actions/qa-actions';
import { QuestionsClient } from '@/components/admin/questions-client';
import { MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Admin Questions | ElectroAdmin',
  description: 'Manage product Q&A',
};

interface AdminQuestionsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function AdminQuestionsPage(props: AdminQuestionsPageProps) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || '';

  const { questions, total, pages } = await getAllQuestionsAction(page, 10, search);

  return (
    <div className='space-y-6 sm:space-y-8 pb-20'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <h1 className='text-xl sm:text-2xl lg:text-4xl font-black tracking-tight text-foreground flex items-center gap-2 sm:gap-3 flex-wrap'>
            <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            Questions & Answers
            <span className='inline-flex items-center justify-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-inset ring-primary/20'>
              {total || 0}
            </span>
          </h1>
          <p className='text-xs sm:text-sm text-muted-foreground font-medium'>
            Manage customer questions and provide official answers.
          </p>
        </div>
      </div>

      <QuestionsClient 
        questions={questions || []} 
        total={total || 0} 
        pages={pages || 1} 
      />
    </div>
  );
}
