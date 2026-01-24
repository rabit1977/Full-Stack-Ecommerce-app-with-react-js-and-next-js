import { getMyOrdersAction } from '@/actions/order-actions';
import AuthGuard from '@/components/auth/auth-guard';
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
    Filter,
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

/**
 * Orders Page Component
 * 
 * Professional order history page with:
 * - Statistics cards
 * - Responsive table layout
 * - Status badges
 * - Empty state
 */
export default async function OrdersPage() {
  const { data: orders = [] } = await getMyOrdersAction();

  // Sort orders by date (most recent first)
  const sortedOrders = [...orders].sort(
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
      <div className='min-h-screen bg-slate-50 dark:bg-slate-950/50 pb-20'>
        <div className='container-wide py-10 sm:py-16'>
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
                <h1 className='text-4xl sm:text-5xl font-black tracking-tight text-foreground'>
                  Order History
                </h1>
                {sortedOrders.length > 0 && (
                  <p className='text-lg text-muted-foreground font-medium'>
                    Manage and track all your recent purchases
                  </p>
                )}
              </div>
              {sortedOrders.length > 0 && (
                <Button variant='outline' size='default' className='rounded-full px-6 border-border hover:bg-white/50 dark:hover:bg-slate-800 backdrop-blur-sm'>
                  <Filter className='h-4 w-4 mr-2' />
                  Filter Orders
                </Button>
              )}
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
                  <div key={i} className={`glass-card p-6 rounded-3xl flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group border ${stat.border}`}>
                    <div className={`absolute top-0 right-0 p-32 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 group-hover:opacity-30 transition-opacity ${stat.bg.replace('/10', '/30')}`} />
                    
                    <div className='flex justify-between items-start mb-4 relative z-10'>
                        <div>
                           <p className='text-sm font-bold text-muted-foreground uppercase tracking-wider'>{stat.title}</p>
                           <h3 className='text-3xl font-black mt-2 tracking-tight text-foreground'>{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} ring-1 ring-inset ring-white/10`}>
                           <stat.icon className='h-6 w-6' />
                        </div>
                    </div>
                    <div className="relative z-10">
                       <span className='inline-flex items-center text-xs font-bold text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-lg border border-border/50'>
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
            <div className='glass-card rounded-3xl overflow-hidden shadow-xl shadow-black/5 border border-border/60 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200'>
              <div className='p-8 border-b border-border/50 bg-secondary/5 backdrop-blur-sm flex items-center justify-between'>
                <h2 className='text-xl font-bold flex items-center gap-3'>
                  <Package className="h-5 w-5 text-primary" />
                  Recent Orders
                </h2>
                <span className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border/50">
                   {sortedOrders.length} total
                </span>
              </div>
              
              <div className='p-0'>
                {/* Desktop Table View */}
                <div className='hidden md:block overflow-x-auto'>
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="bg-secondary/30 hover:bg-secondary/30 border-b border-border/50">
                        <TableHead className='w-[140px] pl-8 py-5 font-bold text-muted-foreground text-xs uppercase tracking-wider'>Order ID</TableHead>
                        <TableHead className='py-5 font-bold text-muted-foreground text-xs uppercase tracking-wider'>Date</TableHead>
                        <TableHead className='py-5 font-bold text-muted-foreground text-xs uppercase tracking-wider'>Status</TableHead>
                        <TableHead className='text-center py-5 font-bold text-muted-foreground text-xs uppercase tracking-wider'>Items</TableHead>
                        <TableHead className='text-right py-5 font-bold text-muted-foreground text-xs uppercase tracking-wider'>Total</TableHead>
                        <TableHead className='w-[120px] pr-8 py-5 font-bold text-muted-foreground text-xs uppercase tracking-wider text-center'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedOrders.map((order) => (
                        <TableRow key={order.id} className='group hover:bg-primary/[0.02] transition-colors border-b border-border/50'>
                          <TableCell className='pl-8 py-6 font-mono text-sm font-semibold text-primary'>
                            #{order.id.slice(0, 8)}
                          </TableCell>
                          <TableCell className="py-6">
                            <div className='flex items-center gap-2.5 text-sm font-medium'>
                              <div className="p-1.5 rounded-md bg-secondary text-muted-foreground">
                                 <Calendar className='h-3.5 w-3.5' />
                              </div>
                              <span className="text-foreground/90">
                                {formatOrderDate(order.createdAt.toISOString())}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-6">
                            {getStatusBadge(order.status)}
                          </TableCell>
                          <TableCell className='text-center py-6'>
                            <div className="inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-lg bg-secondary/50 border border-border/50 text-sm font-medium">
                              {order.items.length}
                            </div>
                          </TableCell>
                          <TableCell className='text-right py-6 font-bold text-base text-foreground'>
                            {formatPrice(order.total)}
                          </TableCell>
                          <TableCell className='text-center pr-8 py-6'>
                            <Link href={`/account/orders/${order.id}`}>
                              <Button 
                                variant='ghost' 
                                size='sm'
                                className='rounded-xl hover:bg-primary text-primary hover:text-white font-medium transition-all duration-300'
                              >
                                View Order
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className='md:hidden space-y-4 p-4 bg-secondary/5'>
                  {sortedOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/account/orders/${order.id}`}
                      className='block group'
                    >
                      <div className='rounded-2xl border border-border/60 bg-card p-5 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden'>
                          <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          <div className='flex items-center justify-between mb-4'>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                 <Package className="h-5 w-5" />
                              </div>
                              <div>
                                 <p className='font-mono text-xs font-bold text-primary'>
                                   #{order.id.slice(0, 8)}
                                 </p>
                                 <p className='text-xs text-muted-foreground mt-0.5'>
                                   {formatOrderDate(order.createdAt.toISOString())}
                                 </p>
                              </div>
                            </div>
                            {getStatusBadge(order.status)}
                          </div>
                          
                          <div className='flex items-center justify-between mt-4 pl-1'>
                            <div className='flex items-center gap-6'>
                              <div>
                                <p className='text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5'>Items</p>
                                <p className='text-sm font-semibold'>
                                  {order.items.length}
                                </p>
                              </div>
                              <div>
                                <p className='text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5'>Total</p>
                                <p className='text-lg font-black text-foreground'>
                                  {formatPrice(order.total)}
                                </p>
                              </div>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                               <ArrowLeft className="h-4 w-4 rotate-180" />
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