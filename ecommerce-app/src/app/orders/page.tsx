import { getMyOrdersAction } from '@/actions/order-actions';
import AuthGuard from '@/components/auth/auth-guard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
    Eye,
    Filter,
    Package,
    ShoppingBag,
    TrendingUp,
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
      <div className='min-h-screen bg-slate-50 dark:bg-slate-950/50'>
        <div className='container-wide py-10 sm:py-16'>
          {/* Header */}
          <div className='mb-10'>
            <Link href='/account' className='inline-block mb-6'>
              <Button
                variant='ghost'
                className='rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 -ml-2'
              >
                <ArrowLeft className='h-4 w-4 mr-2' />
                Back to Account
              </Button>
            </Link>
            
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6'>
              <div>
                <h1 className='text-3xl sm:text-5xl font-black tracking-tight text-foreground mb-2'>
                  Order History
                </h1>
                {sortedOrders.length > 0 && (
                  <p className='text-lg text-muted-foreground'>
                    Manage and track all your orders in one place
                  </p>
                )}
              </div>
              {sortedOrders.length > 0 && (
                <Button variant='outline' size='default' className='rounded-full px-6 border-border hover:bg-secondary/50'>
                  <Filter className='h-4 w-4 mr-2' />
                  Filter Orders
                </Button>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          {sortedOrders.length > 0 && (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10'>
              {[
                  { title: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, desc: 'All time purchases', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { title: 'Total Spent', value: formatPrice(stats.totalSpent), icon: DollarSign, desc: 'Lifetime value', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                  { title: 'Average Order', value: formatPrice(stats.averageOrder), icon: TrendingUp, desc: 'Per order value', color: 'text-violet-500', bg: 'bg-violet-500/10' },
                  { title: 'Recent Orders', value: stats.recentOrders.toString(), icon: Calendar, desc: 'Last 30 days', color: 'text-amber-500', bg: 'bg-amber-500/10' },
              ].map((stat, i) => (
                  <div key={i} className='glass-card p-6 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/50'>
                    <div className='flex justify-between items-start mb-4'>
                        <div>
                           <p className='text-sm font-medium text-muted-foreground'>{stat.title}</p>
                           <h3 className='text-2xl font-bold mt-1 tracking-tight'>{stat.value}</h3>
                        </div>
                        <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                           <stat.icon className='h-5 w-5' />
                        </div>
                    </div>
                    <p className='text-xs text-muted-foreground font-medium bg-secondary/50 self-start px-2 py-1 rounded-md'>{stat.desc}</p>
                  </div>
              ))}
            </div>
          )}

          {/* Orders Content */}
          {sortedOrders.length === 0 ? (
            // Empty State
            <div className='glass-card rounded-[2rem] p-12 sm:p-20 text-center border-dashed border-2 border-border/50'>
                <div className='w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-8 animate-pulse'>
                  <Package className='h-10 w-10 text-muted-foreground' />
                </div>
                <h3 className='text-3xl font-bold mb-4 text-foreground'>
                  No orders yet
                </h3>
                <p className='text-xl text-muted-foreground max-w-md mx-auto mb-10'>
                  When you place orders, they&apos;ll appear here. Start shopping
                  to see your order history.
                </p>
                <Link href='/products'>
                  <Button size='lg' className='h-12 px-8 rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all'>
                    <ShoppingBag className='h-5 w-5 mr-2' />
                    Start Shopping
                  </Button>
                </Link>
            </div>
          ) : (
            // Orders Table
            <div className='glass-card rounded-3xl overflow-hidden shadow-xl border border-border/50'>
              <div className='p-6 border-b border-border/50 bg-secondary/10'>
                <h2 className='text-xl font-bold'>All Orders</h2>
              </div>
              <div className='p-0'>
                {/* Desktop Table View */}
                <div className='hidden md:block overflow-x-auto'>
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="bg-secondary/20 hover:bg-secondary/20 border-b border-border/50">
                        <TableHead className='w-[140px] font-bold text-muted-foreground'>Order ID</TableHead>
                        <TableHead className='font-bold text-muted-foreground'>Date</TableHead>
                        <TableHead className='font-bold text-muted-foreground'>Status</TableHead>
                        <TableHead className='text-center font-bold text-muted-foreground'>Items</TableHead>
                        <TableHead className='text-right font-bold text-muted-foreground'>Total</TableHead>
                        <TableHead className='w-[100px] font-bold text-muted-foreground text-center'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedOrders.map((order) => (
                        <TableRow key={order.id} className='group hover:bg-secondary/10 transition-colors border-b border-border/50'>
                          <TableCell className='font-mono text-xs font-medium'>
                            #{order.id.slice(0, 8)}
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center gap-2 text-sm text-foreground/80'>
                              <Calendar className='h-3.5 w-3.5 text-muted-foreground' />
                              <span>
                                {formatOrderDate(order.createdAt.toISOString())}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(order.status)}
                          </TableCell>
                          <TableCell className='text-center'>
                            <Badge variant='outline' className="font-mono bg-background/50">
                              {order.items.length}
                            </Badge>
                          </TableCell>
                          <TableCell className='text-right font-bold text-foreground'>
                            {formatPrice(order.total)}
                          </TableCell>
                          <TableCell className='text-center'>
                            <Link href={`/account/orders/${order.id}`}>
                              <Button 
                                variant='ghost' 
                                size='icon'
                                className='h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary'
                              >
                                <Eye className='h-4 w-4' />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className='md:hidden space-y-4 p-4'>
                  {sortedOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/account/orders/${order.id}`}
                      className='block'
                    >
                      <div className='rounded-2xl border border-border/50 bg-card p-5 hover:border-primary/30 transition-all duration-300 shadow-sm'>
                          <div className='flex items-start justify-between mb-4'>
                            <div>
                              <p className='font-mono text-xs text-muted-foreground mb-1 bg-secondary px-2 py-0.5 rounded'>
                                #{order.id.slice(0, 8)}
                              </p>
                              <p className='text-xs flex items-center gap-1.5 mt-2 font-medium text-foreground/80'>
                                <Calendar className='h-3 w-3 text-muted-foreground' />
                                {formatOrderDate(order.createdAt.toISOString())}
                              </p>
                            </div>
                            {getStatusBadge(order.status)}
                          </div>
                          
                          <Separator className='my-3 bg-border/50' />
                          
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-8'>
                              <div>
                                <p className='text-[10px] uppercase tracking-wider text-muted-foreground font-bold'>Items</p>
                                <p className='text-sm font-semibold mt-0.5'>
                                  {order.items.length}
                                </p>
                              </div>
                              <div>
                                <p className='text-[10px] uppercase tracking-wider text-muted-foreground font-bold'>Total</p>
                                <p className='text-sm font-bold mt-0.5 text-primary'>
                                  {formatPrice(order.total)}
                                </p>
                              </div>
                            </div>
                            <Button variant='ghost' size='icon' className='rounded-full hover:bg-primary/10 hover:text-primary'>
                              <Eye className='h-4 w-4' />
                            </Button>
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