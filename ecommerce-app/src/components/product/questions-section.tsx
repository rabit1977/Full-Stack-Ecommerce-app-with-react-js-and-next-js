'use client';

import { answerQuestionAction, askQuestionAction, getProductQuestionsAction, QuestionWithAnswers } from '@/actions/qa-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, MessageSquare } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Textarea } from '../ui/textarea';

interface QuestionsSectionProps {
  productId: string;
}

export function QuestionsSection({ productId }: QuestionsSectionProps) {
  const [questions, setQuestions] = useState<QuestionWithAnswers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAsking, startAskTransition] = useTransition();
  const [newQuestion, setNewQuestion] = useState('');
  const [showAskDialog, setShowAskDialog] = useState(false);
  
  // State for answering (keyed by questionId)
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [isAnswering, startAnswerTransition] = useTransition();

  const fetchQuestions = async () => {
    setIsLoading(true);
    const res = await getProductQuestionsAction(productId);
    if (res.success && res.questions) {
        // Cast the dates from strings (if serialised) to Date objects if needed, 
        // usually Server Actions return Dates as Dates in recent Next.js, but sometimes not.
        setQuestions(res.questions as any); 
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, [productId]);

  const handleAskQuestion = () => {
    if (!newQuestion.trim()) return;

    startAskTransition(async () => {
      const res = await askQuestionAction(productId, newQuestion);
      if (res.success) {
        toast.success(res.message);
        setNewQuestion('');
        setShowAskDialog(false);
        fetchQuestions(); // Refresh list
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleAnswerQuestion = (questionId: string) => {
    if (!answerText.trim()) return;

    startAnswerTransition(async () => {
        const res = await answerQuestionAction(questionId, answerText);
        if (res.success) {
            toast.success(res.message);
            setAnswerText('');
            setAnsweringId(null);
            fetchQuestions();
        } else {
            toast.error(res.message);
        }
    });
  };

  return (
    <div className='w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300'>
      <div className="flex items-center justify-between">
        <h2 className='text-2xl sm:text-3xl font-bold flex items-center gap-3'>
          <MessageCircle className='h-6 w-6 sm:h-8 sm:w-8 text-primary' />
          Questions & Answers
        </h2>
        
        <Dialog open={showAskDialog} onOpenChange={setShowAskDialog}>
            <DialogTrigger asChild>
                <Button className='gap-2 rounded-xl'>
                    <MessageSquare className='h-4 w-4' />
                    Ask a Question
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ask a Question</DialogTitle>
                    <DialogDescription>
                        Have a question about this product? Ask the community or our support team.
                    </DialogDescription>
                </DialogHeader>
                <div className='space-y-4 pt-4'>
                    <Textarea 
                        placeholder="What would you like to know?" 
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        className='min-h-[100px]'
                    />
                    <div className='flex justify-end gap-2'>
                        <Button variant='outline' onClick={() => setShowAskDialog(false)}>Cancel</Button>
                        <Button onClick={handleAskQuestion} disabled={isAsking || !newQuestion.trim()}>
                            {isAsking ? 'Submitting...' : 'Post Question'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-12'>
            <div className='animate-pulse text-muted-foreground'>Loading questions...</div>
        </div>
      ) : questions.length === 0 ? (
        <Card className='bg-muted/30 border-dashed border-border/60'>
            <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
                <MessageCircle className='h-12 w-12 text-muted-foreground/50 mb-4' />
                <h3 className='text-lg font-semibold'>No questions yet</h3>
                <p className='text-muted-foreground max-w-sm mt-1'>
                    Be the first to ask a question about this product!
                </p>
                <Button variant='link' onClick={() => setShowAskDialog(true)} className='mt-2'>
                    Ask a Question
                </Button>
            </CardContent>
        </Card>
      ) : (
        <div className='space-y-6'>
            {questions.map((q) => (
                <Card key={q.id} className='border-border/40 shadow-sm'>
                    <CardHeader className='pb-3'>
                        <div className='flex gap-4 items-start'>
                            <div className='bg-primary/10 p-2.5 rounded-xl shrink-0'>
                                <span className='font-bold text-primary'>Q</span>
                            </div>
                            <div className='flex-1'>
                                <CardTitle className='text-lg leading-snug'>{q.question}</CardTitle>
                                <div className='flex items-center gap-2 text-xs text-muted-foreground mt-2'>
                                    <span>{q.user.name || 'Anonymous'}</span>
                                    <span>•</span>
                                    <span>{formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}</span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        {/* Answers */}
                        {q.answers.length > 0 && (
                            <div className='space-y-4 pl-4 sm:pl-16 border-l-2 border-border/40 ml-4 sm:ml-5'>
                                {q.answers.map((a) => (
                                    <div key={a.id} className='space-y-2'>
                                        <div className='flex items-start gap-3'>
                                            <div className='bg-secondary p-1.5 rounded-lg shrink-0 mt-0.5'>
                                                <span className='text-xs font-bold text-muted-foreground'>A</span>
                                            </div>
                                            <div className='space-y-1.5 flex-1'>
                                                <p className='text-sm leading-relaxed text-foreground/90'>{a.answer}</p>
                                                <div className='flex items-center gap-2 text-xs'>
                                                    {a.isOfficial && (
                                                        <span className='bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium text-[10px]'>
                                                            Official Answer
                                                        </span>
                                                    )}
                                                    <span className='text-muted-foreground'>
                                                        {a.user.name || 'Store User'} • {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Reply Button / Form */}
                        <div className='pl-4 sm:pl-16 ml-4 sm:ml-5 pt-2'>
                             {answeringId === q.id ? (
                                 <div className='bg-muted/30 p-4 rounded-xl space-y-3 animate-in fade-in zoom-in-95 duration-200'>
                                    <Textarea 
                                        placeholder="Write your answer..." 
                                        className='min-h-[80px] bg-background'
                                        value={answerText}
                                        onChange={(e) => setAnswerText(e.target.value)}
                                        autoFocus
                                    />
                                    <div className='flex justify-end gap-2'>
                                        <Button size='sm' variant='ghost' onClick={() => setAnsweringId(null)}>Cancel</Button>
                                        <Button size='sm' onClick={() => handleAnswerQuestion(q.id)} disabled={isAnswering}>
                                            {isAnswering ? 'Posting...' : 'Post Answer'}
                                        </Button>
                                    </div>
                                 </div>
                             ) : (
                                <Button 
                                    variant='ghost' 
                                    size='sm' 
                                    className='text-muted-foreground hover:text-primary gap-1.5 h-8'
                                    onClick={() => setAnsweringId(q.id)}
                                >
                                    <MessageSquare className='h-3.5 w-3.5' />
                                    Answer this question
                                </Button>
                             )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
}
