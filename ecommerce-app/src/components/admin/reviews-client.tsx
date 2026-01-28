'use client';

import {
    adminDeleteReviewAction,
    adminReplyReviewAction,
    toggleReviewVisibilityAction
} from '@/actions/review-actions';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import {
    CheckCircle2,
    Eye,
    EyeOff,
    MessageSquare,
    MoreHorizontal,
    Search,
    Star,
    Trash2
} from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

// Define Review Type based on what we fetch
interface Review {
    id: string;
    rating: number;
    title: string;
    comment: string;
    isApproved: boolean;
    createdAt: Date;
    adminResponse?: string | null;
    user: {
        name: string | null;
        email: string | null;
        image: string | null;
    };
    product: {
        id: string;
        title: string;
        thumbnail: string | null;
        slug: string | null;
    };
}

interface ReviewsClientProps {
    reviews: Review[];
    total: number;
    pages: number;
}

export function ReviewsClient({ reviews, total, pages }: ReviewsClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    
    // Reply State
    const [replyingId, setReplyingId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/admin/reviews?search=${search}&page=1`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`/admin/reviews?${params.toString()}`);
    };

    const toggleVisibility = async (id: string) => {
        if (!confirm('Toggle visibility for this review?')) return;
        startTransition(async () => {
            const res = await toggleReviewVisibilityAction(id);
            if (res.success) toast.success('Visibility updated');
            else toast.error(res.error);
        });
    };

    const deleteReview = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        startTransition(async () => {
            const res = await adminDeleteReviewAction(id);
            if (res.success) toast.success('Review deleted');
            else toast.error(res.error);
        });
    };

    const submitReply = async () => {
        if (!replyingId || !replyText.trim()) return;
        startTransition(async () => {
            const res = await adminReplyReviewAction(replyingId, replyText);
            if (res.success) {
                toast.success('Reply submitted');
                setReplyingId(null);
                setReplyText('');
            } else {
                toast.error(res.error);
            }
        });
    };

    const currentPage = Number(searchParams.get('page')) || 1;

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className='flex gap-4'>
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search reviews, users, or products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-11 rounded-xl bg-card"
                    />
                </div>
                <Button type="submit" size="lg" className="rounded-xl h-11">Search</Button>
            </form>

            <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Review</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                    No reviews found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            reviews.map((review) => (
                                <TableRow key={review.id} className="group hover:bg-muted/30 transition-colors">
                                    {/* Review Content */}
                                    <TableCell className="max-w-[300px]">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-3 w-3 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`}
                                                    />
                                                ))}
                                                <span className="text-xs font-bold ml-1">{review.rating}.0</span>
                                            </div>
                                            <p className="font-bold text-sm truncate">{review.title}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                                            
                                            {review.adminResponse && (
                                                <div className="mt-2 text-xs bg-primary/5 p-2 rounded-lg border border-primary/10">
                                                    <span className="font-bold text-primary mr-1">Reply:</span>
                                                    {review.adminResponse}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>

                                    {/* User */}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-secondary overflow-hidden relative">
                                                {review.user.image ? (
                                                    <Image src={review.user.image} alt={review.user.name || ''} fill className="object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-xs font-bold text-muted-foreground">
                                                        {review.user.name?.[0] || 'U'}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{review.user.name || 'Anonymous'}</p>
                                                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(review.createdAt))} ago</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Product */}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-10 w-10 rounded-lg bg-secondary overflow-hidden relative border border-border/50">
                                                {review.product.thumbnail ? (
                                                    <Image src={review.product.thumbnail} alt={review.product.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-xs">IMG</div>
                                                )}
                                            </div>
                                            <div className="max-w-[150px]">
                                                <p className="text-sm font-medium truncate">{review.product.title}</p>
                                                <span className="text-[10px] text-muted-foreground">ID: {review.product.id.slice(0, 8)}</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        {review.isApproved ? (
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold border border-emerald-500/20">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                Visible
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold border border-amber-500/20">
                                                <EyeOff className="h-3.5 w-3.5" />
                                                Hidden
                                            </div>
                                        )}
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[160px] rounded-xl">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => {
                                                    setReplyingId(review.id);
                                                    setReplyText(review.adminResponse || '');
                                                }}>
                                                    <MessageSquare className="mr-2 h-4 w-4" />
                                                    Reply
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => toggleVisibility(review.id)}>
                                                    {review.isApproved ? (
                                                        <>
                                                            <EyeOff className="mr-2 h-4 w-4" />
                                                            Hide
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Show
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteReview(review.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center px-4 text-sm font-medium">
                        Page {currentPage} of {pages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === pages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Reply Dialog */}
            <Dialog open={!!replyingId} onOpenChange={(open) => !open && setReplyingId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reply to Review</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Textarea
                            placeholder="Type your official response..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReplyingId(null)}>Cancel</Button>
                        <Button onClick={submitReply} disabled={isPending}>Submit Reply</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
