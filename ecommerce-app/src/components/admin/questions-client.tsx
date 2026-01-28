'use client';

import { answerQuestionAction, deleteQuestionAction, toggleQuestionVisibilityAction } from '@/actions/qa-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
    CheckCircle2,
    Eye,
    EyeOff,
    MessageCircle,
    Search,
    Trash2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface QuestionsClientProps {
  questions: any[]; // Type should ideally be QuestionWithAnswers but serialized
  total: number;
  pages: number;
}

export function QuestionsClient({
  questions,
  total,
  pages,
}: QuestionsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) params.set('search', search);
    else params.delete('search');
    params.set('page', '1');
    router.push(`/admin/questions?${params.toString()}`);
  };

  const handleToggleVisibility = async (id: string) => {
    startTransition(async () => {
      const res = await toggleQuestionVisibilityAction(id);
      if (res.success) toast.success('Visibility updated');
      else toast.error(res.error || 'Failed to update');
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    startTransition(async () => {
      const res = await deleteQuestionAction(id);
      if (res.success) toast.success('Question deleted');
      else toast.error(res.error || 'Failed to delete');
    });
  };

  const handleAnswer = async () => {
    if (!answeringId || !answerText.trim()) return;
    startTransition(async () => {
      const res = await answerQuestionAction(answeringId, answerText);
      if (res.success) {
        toast.success('Answer submitted');
        setAnsweringId(null);
        setAnswerText('');
      } else {
        toast.error(res.message || 'Failed to answer');
      }
    });
  };

  return (
    <div className='bg-background rounded-xl border border-border/50 shadow-sm overflow-hidden'>
      {/* Toolbar */}
      <div className='p-4 border-b border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/20'>
        <form onSubmit={handleSearch} className='relative w-full sm:w-80'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search questions or products...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-9 bg-background'
          />
        </form>
        <div className='flex items-center gap-2'>
            <Badge variant="outline" className="px-3 py-1 h-9 flex items-center gap-1 bg-background">
                <MessageCircle className="w-3 h-3" />
                {total} Questions
            </Badge>
        </div>
      </div>

      {/* List */}
      <div className='divide-y divide-border/50'>
        {questions.length === 0 ? (
          <div className='p-12 text-center text-muted-foreground'>
            No questions found.
          </div>
        ) : (
          questions.map((q) => (
            <div
              key={q.id}
              className='p-4 sm:p-6 hover:bg-muted/30 transition-colors group'
            >
              <div className='flex items-start gap-4'>
                <div className='shrink-0 mt-1'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            q.answers.length > 0 ? 'bg-green-500' : 'bg-orange-500'
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        {q.answers.length > 0 ? 'Answered' : 'Unanswered'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className='flex-1 min-w-0 space-y-3'>
                  {/* Header: User & Product */}
                  <div className='flex items-center justify-between gap-4'>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                       <span className='font-medium text-foreground flex items-center gap-2'>
                          {q.user.image && (
                              <Image src={q.user.image} alt={q.user.name || 'User'} width={20} height={20} className="rounded-full" />
                          )}
                          {q.user.name || 'Anonymous'}
                       </span>
                       <span>asked on</span>
                       <Link href={`/products/${q.product.slug}`} className='font-medium text-primary hover:underline truncate max-w-[200px]'>
                          {q.product.title}
                       </Link>
                       <span>• {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}</span>
                    </div>

                    <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => handleToggleVisibility(q.id)}>
                            {q.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(q.id)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                  </div>

                  {/* Question */}
                  <p className='text-base font-medium'>{q.question}</p>

                  {/* Answers Preview */}
                  <div className='space-y-2 pl-4 border-l-2 border-border/50'>
                    {q.answers.map((a: any) => (
                        <div key={a.id} className='text-sm bg-muted/30 p-2 rounded-lg'>
                            <div className='flex items-center gap-2 mb-1'>
                                <span className='font-semibold flex items-center gap-1'>
                                    {a.user.role === 'ADMIN' && <CheckCircle2 className="w-3 h-3 text-primary" />}
                                    {a.user.name}
                                </span>
                                <span className='text-muted-foreground text-xs'>{formatDistanceToNow(new Date(a.createdAt))} ago</span>
                            </div>
                            <p className='text-muted-foreground'>{a.answer}</p>
                        </div>
                    ))}
                    
                    {/* Answer Button */}
                    <Dialog open={answeringId === q.id} onOpenChange={(open) => setAnsweringId(open ? q.id : null)}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className='h-7 text-xs gap-1'>
                                <MessageCircle className="w-3 h-3" />
                                Reply
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Reply to Question</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="bg-muted/30 p-4 rounded-lg">
                                    <p className="font-medium text-sm text-foreground">{q.question}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Your Answer (as Admin)</label>
                                    <textarea 
                                        className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Type your answer here..."
                                        value={answerText}
                                        onChange={(e) => setAnswerText(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setAnsweringId(null)}>Cancel</Button>
                                    <Button onClick={handleAnswer} disabled={isPending || !answerText.trim()}>
                                        {isPending ? 'Submitting...' : 'Submit Answer'}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className='p-4 border-t border-border/50 flex items-center justify-center gap-2'>
        <Button
            variant="outline"
            size="sm"
            onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('page', String(Math.max(1, Number(searchParams.get('page') || 1) - 1)));
                router.push(`/admin/questions?${params.toString()}`);
            }}
            disabled={Number(searchParams.get('page') || 1) === 1}
        >Previous</Button>
        <span className="text-sm text-muted-foreground">
            Page {searchParams.get('page') || 1} of {pages || 1}
        </span>
        <Button
             variant="outline"
             size="sm"
             onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('page', String(Math.min(pages, (Number(searchParams.get('page') || 1) + 1))));
                router.push(`/admin/questions?${params.toString()}`);
            }}
            disabled={Number(searchParams.get('page') || 1) >= pages}
        >Next</Button>
      </div>
    </div>
  );
}
