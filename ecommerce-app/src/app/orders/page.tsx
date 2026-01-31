import { getMyOrdersAction } from '@/actions/order-actions';
import AuthGuard from '@/components/auth/auth-guard';
import { OrderFilters } from '@/components/orders/order-filters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatOrderDate, formatPrice } from '@/lib/utils/formatters';
import {
    ArrowLeft,
    Calendar,
    DollarSign,
    Package,
    ShoppingBag,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';

/**
 * Get status badge variant based on order status
 */
function getStatusBadge(status: string) {
  const variants = {
    Delivered: { variant: 'default' as const, className: 'bg-green-500 hover:bg-green-600' },
    Shipped: { variant: 'default' as const, className: 'bg-blue-500 hover:bg-blue-600' },
    Processing: { variant: 'secondary' as const, className: '' },
    Pending: { variant: 'outline' as const, className: '' },
    Cancelled: { variant: 'destructive' as const, className: '' },
  };

  const config = variants[status as keyof typeof variants] || variants.Pending;
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {status}
    </Badge>
  );
}

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string;
    date?: string;
    q?: string;
  }>;
}

export default async function OrdersPage(props: OrdersPageProps) {
  const searchParams = await props.searchParams;
  const { status, date, q } = searchParams;

  const { data: orders = [] } = await getMyOrdersAction();

  // Apply Filtering Logic
  let filteredOrders = [...orders];

  if (status && status !== 'all') {
    filteredOrders = filteredOrders.filter(
      (o) => o.status.toLowerCase() === status.toLowerCase()
    );
  }

  if (q) {
    const searchStr = q.toLowerCase();
    filteredOrders = filteredOrders.filter(
      (o) => o.id.toLowerCase().includes(searchStr)
    );
  }

  if (date && date !== 'all') {
    const now = new Date();
    if (date === '30days') {
      const thirtyDaysAgo = new Date(new Date().setDate(now.getDate() - 30));
      filteredOrders = filteredOrders.filter(
        (o) => new Date(o.createdAt) >= thirtyDaysAgo
      );
    } else if (date === '3months') {
      const threeMonthsAgo = new Date(new Date().setMonth(now.getMonth() - 3));
      filteredOrders = filteredOrders.filter(
        (o) => new Date(o.createdAt) >= threeMonthsAgo
      );
    } else if (date === '6months') {
      const sixMonthsAgo = new Date(new Date().setMonth(now.getMonth() - 6));
      filteredOrders = filteredOrders.filter(
        (o) => new Date(o.createdAt) >= sixMonthsAgo
      );
    } else if (date === '2024') {
      filteredOrders = filteredOrders.filter(
        (o) => new Date(o.createdAt).getFullYear() === 2024
      );
    }
  }

  // Sort filtered orders by date (most recent first)
  const sortedOrders = filteredOrders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // Calculate statistics
  const stats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum: number, order) => sum + order.total, 0),
    averageOrder: orders.length > 0 
      ? orders.reduce((sum: number, order) => sum + order.total, 0) / orders.length 
      : 0,
    recentOrders: orders.filter(
      order => new Date(order.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
  };

  return (
    <AuthGuard>
      <div className='min-h-screen relative overflow-hidden pb-20'>
        {/* Background Pattern - Matching Admin/Account Layout */}
        <div className='fixed inset-0 -z-10 bg-gradient-to-br from-muted/30 via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10' />
        <div className='fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.05),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.1),transparent)]' />

        <div className='container-wide py-10 sm:py-16 relative z-10'>
          {/* Header */}
          <div className='mb-12'>
            <Link href='/account' className='inline-block mb-8'>
              <Button
                variant='ghost'
                className='rounded-full hover:bg-white/50 dark:hover:bg-slate-800 -ml-2 text-muted-foreground hover:text-foreground transition-colors'
              >
                <ArrowLeft className='h-4 w-4 mr-2' />
                Back to Account
              </Button>
            </Link>
            
            <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6'>
              <div className="space-y-2">
                <h1 className='text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground'>
                  Order History
                </h1>
                {sortedOrders.length > 0 && (
                  <p className='text-lg sm:text-xl text-muted-foreground font-medium'>
                    Manage and track all your recent purchases
                  </p>
                )}
              </div>
              <OrderFilters />
            </div>
          </div>

          {/* Statistics Cards */}
          {sortedOrders.length > 0 && (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700'>
              {[
                  { title: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, desc: 'All time purchases', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                  { title: 'Total Spent', value: formatPrice(stats.totalSpent), icon: DollarSign, desc: 'Lifetime value', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                  { title: 'Average Order', value: formatPrice(stats.averageOrder), icon: TrendingUp, desc: 'Per order value', color: 'text-violet-500', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
                  { title: 'Recent Orders', value: stats.recentOrders.toString(), icon: Calendar, desc: 'Last 30 days', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
              ].map((stat, i) => (
                  <div key={i} className={`glass-card p-6 rounded-[2rem] flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group border-border/60 shadow-xl shadow-black/5 ${stat.border}`}>
                    <div className={`absolute top-0 right-0 p-32 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 group-hover:opacity-30 transition-opacity ${stat.bg.replace('/10', '/30')}`} />
                    
                    <div className='flex justify-between items-start mb-4 relative z-10'>
                        <div>
                           <p className='text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1'>{stat.title}</p>
                           <h3 className='text-2xl sm:text-3xl font-black tracking-tight text-foreground'>{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} ring-1 ring-inset ring-white/10 group-hover:scale-110 transition-transform`}>
                           <stat.icon className='h-6 w-6' />
                        </div>
                    </div>
                    <div className="relative z-10 flex items-center justify-between">
                       <span className='inline-flex items-center text-[10px] sm:text-xs font-bold text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-lg border border-border/50'>
                          {stat.desc}
                       </span>
                    </div>
                  </div>
              ))}
            </div>
          )}

          {/* Orders Content */}
          {sortedOrders.length === 0 ? (
            // Empty State
            <div className='glass-card rounded-[2.5rem] p-12 sm:p-24 text-center border-dashed border-2 border-border/50 animate-in fade-in zoom-in duration-500 max-w-4xl mx-auto'>
                <div className='relative w-32 h-32 mx-auto mb-10'>
                   <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
                   <div className='relative z-10 w-32 h-32 rounded-full bg-gradient-to-br from-secondary to-background border border-border flex items-center justify-center shadow-xl'>
                     <ShoppingBag className='h-12 w-12 text-primary' />
                   </div>
                   {/* Decorative elements */}
                   <div className='absolute -top-2 -right-2 w-8 h-8 bg-blue-400/20 rounded-full animate-bounce delay-100 backdrop-blur-sm' />
                   <div className='absolute -bottom-2 -left-2 w-6 h-6 bg-purple-400/20 rounded-full animate-bounce delay-300 backdrop-blur-sm' />
                </div>
                
                <h3 className='text-3xl sm:text-4xl font-black mb-4 text-foreground'>
                  No orders yet
                </h3>
                <p className='text-xl text-muted-foreground max-w-md mx-auto mb-12 leading-relaxed'>
                  When you place orders, they&apos;ll appear here. Start shopping to create your first order!
                </p>
                
                <Link href='/products'>
                  <Button size='lg' className='btn-premium h-14 px-10 rounded-full text-lg font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40'>
                    <ShoppingBag className='h-5 w-5 mr-2' />
                    Start Shopping
                  </Button>
                </Link>
            </div>
          ) : (
            // Orders Table
            <div className='glass-card rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5 border border-border/60 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200'>
              <div className='p-8 border-b border-border/50 bg-muted/20 backdrop-blur-sm flex items-center justify-between'>
                <h2 className='text-2xl font-black flex items-center gap-3 tracking-tight'>
                  <Package className="h-6 w-6 text-primary" />
                  Recent Orders
                </h2>
                <span className="text-xs font-bold text-muted-foreground bg-secondary/80 px-4 py-1.5 rounded-full border border-border/50 uppercase tracking-widest">
                   {sortedOrders.length} total
                </span>
              </div>
              
              <div className='p-0'>
                {/* Desktop Table View */}
                <div className='hidden md:block overflow-x-auto'>
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                        <TableHead className='w-[140px] pl-10 py-6 font-bold text-muted-foreground text-[10px] uppercase tracking-[0.2em]'>Order ID</TableHead>
                        <TableHead className='py-6 font-bold text-muted-foreground text-[10px] uppercase tracking-[0.2em]'>Date</TableHead>
                        <TableHead className='py-6 font-bold text-muted-foreground text-[10px] uppercase tracking-[0.2em]'>Status</TableHead>
                        <TableHead className='text-center py-6 font-bold text-muted-foreground text-[10px] uppercase tracking-[0.2em]'>Items</TableHead>
                        <TableHead className='text-right py-6 font-bold text-muted-foreground text-[10px] uppercase tracking-[0.2em]'>Total</TableHead>
                        <TableHead className='w-[160px] pr-10 py-6 font-bold text-muted-foreground text-[10px] uppercase tracking-[0.2em] text-center'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedOrders.map((order) => (
                        <TableRow key={order.id} className='group hover:bg-primary/[0.03] transition-colors border-b border-border/50 last:border-0'>
                          <TableCell className='pl-10 py-7 font-mono text-sm font-black text-primary'>
                            #{order.id.slice(0, 8)}
                          </TableCell>
                          <TableCell className="py-7">
                            <div className='flex items-center gap-3 text-sm font-semibold'>
                              <div className="p-2 rounded-xl bg-secondary/50 text-primary ring-1 ring-border/50">
                                 <Calendar className='h-4 w-4' />
                              </div>
                              <span className="text-foreground/90 whitespace-nowrap">
                                {formatOrderDate(order.createdAt.toISOString())}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-7">
                            {getStatusBadge(order.status)}
                          </TableCell>
                          <TableCell className='text-center py-7'>
                            <div className="inline-flex items-center justify-center min-w-[2.5rem] h-9 px-3 rounded-xl bg-secondary/50 border border-border/50 text-sm font-bold">
                              {order.items.length}
                            </div>
                          </TableCell>
                          <TableCell className='text-right py-7 font-black text-lg text-foreground'>
                            {formatPrice(order.total)}
                          </TableCell>
                          <TableCell className='text-center pr-10 py-7'>
                            <Link href={`/account/orders/${order.id}`}>
                              <Button 
                                variant='outline' 
                                size='sm'
                                className='rounded-xl border-border/60 hover:bg-primary hover:border-primary hover:text-white font-bold transition-all duration-300 h-11 px-5'
                              >
                                View Details
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className='md:hidden space-y-4 p-6 bg-muted/10'>
                  {sortedOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/account/orders/${order.id}`}
                      className='block group'
                    >
                      <div className='rounded-[2rem] border border-border/60 bg-card/80 backdrop-blur-sm p-6 group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden'>
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          <div className='flex items-center justify-between mb-5'>
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20">
                                 <Package className="h-6 w-6" />
                              </div>
                              <div>
                                 <p className='font-mono text-sm font-black text-primary'>
                                   #{order.id.slice(0, 8)}
                                 </p>
                                 <p className='text-xs font-bold text-muted-foreground mt-0.5 uppercase tracking-wider'>
                                   {formatOrderDate(order.createdAt.toISOString())}
                                 </p>
                              </div>
                            </div>
                            {getStatusBadge(order.status)}
                          </div>
                          
                          <div className='flex items-center justify-between mt-6 pt-6 border-t border-border/50'>
                            <div className='flex items-center gap-8'>
                              <div>
                                <p className='text-[10px] uppercase tracking-widest text-muted-foreground font-black mb-1'>Items</p>
                                <p className='text-base font-bold'>
                                  {order.items.length}
                                </p>
                              </div>
                              <div>
                                <p className='text-[10px] uppercase tracking-widest text-muted-foreground font-black mb-1'>Total</p>
                                <p className='text-xl font-black text-foreground tracking-tight'>
                                  {formatPrice(order.total)}
                                </p>
                              </div>
                            </div>
                            <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                               <ArrowLeft className="h-5 w-5 rotate-180" />
                            </div>
                          </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}