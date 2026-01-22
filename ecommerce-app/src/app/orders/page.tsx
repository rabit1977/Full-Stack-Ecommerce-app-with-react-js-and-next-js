import { getMyOrdersAction } from '@/actions/order-actions';
import AuthGuard from '@/components/auth/auth-guard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
        <div className='container mx-auto px-4 py-8 sm:py-12'>
          {/* Header */}
          <div className='mb-8'>
            <Link href='/account'>
              <Button
                variant='ghost'
                className='mb-4 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800'
              >
                <ArrowLeft className='h-4 w-4 mr-2' />
                Back to Account
              </Button>
            </Link>
            
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div>
                <h1 className='text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent'>
                  Order History
                </h1>
                {sortedOrders.length > 0 && (
                  <p className='text-muted-foreground mt-2'>
                    Manage and track all your orders in one place
                  </p>
                )}
              </div>
              {sortedOrders.length > 0 && (
                <Button variant='outline' size='sm' className='w-full sm:w-auto'>
                  <Filter className='h-4 w-4 mr-2' />
                  Filter Orders
                </Button>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          {sortedOrders.length > 0 && (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Orders
                  </CardTitle>
                  <ShoppingBag className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{stats.totalOrders}</div>
                  <p className='text-xs text-muted-foreground'>
                    All time purchases
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Spent
                  </CardTitle>
                  <DollarSign className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {formatPrice(stats.totalSpent)}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Lifetime value
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Average Order
                  </CardTitle>
                  <TrendingUp className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {formatPrice(stats.averageOrder)}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Per order value
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Recent Orders
                  </CardTitle>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{stats.recentOrders}</div>
                  <p className='text-xs text-muted-foreground'>
                    Last 30 days
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Orders Content */}
          {sortedOrders.length === 0 ? (
            // Empty State
            <Card className='border-dashed'>
              <CardContent className='flex flex-col items-center justify-center py-16 sm:py-24'>
                <div className='rounded-full bg-slate-100 dark:bg-slate-800 p-6 mb-6'>
                  <Package className='h-12 w-12 text-slate-400 dark:text-slate-600' />
                </div>
                <h3 className='text-2xl font-semibold mb-2'>
                  No orders yet
                </h3>
                <p className='text-muted-foreground text-center max-w-md mb-8'>
                  When you place orders, they&apos;ll appear here. Start shopping
                  to see your order history.
                </p>
                <Link href='/products'>
                  <Button size='lg' className='gap-2'>
                    <ShoppingBag className='h-4 w-4' />
                    Start Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            // Orders Table
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>
                  View and manage your order history
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Desktop Table View */}
                <div className='hidden md:block'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-[140px]'>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className='text-center'>Items</TableHead>
                        <TableHead className='text-right'>Total</TableHead>
                        <TableHead className='w-[100px]'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedOrders.map((order) => (
                        <TableRow key={order.id} className='group'>
                          <TableCell className='font-mono text-xs'>
                            #{order.id.slice(0, 8)}
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center gap-2'>
                              <Calendar className='h-4 w-4 text-muted-foreground' />
                              <span className='text-sm'>
                                {formatOrderDate(order.createdAt.toISOString())}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(order.status)}
                          </TableCell>
                          <TableCell className='text-center'>
                            <Badge variant='secondary'>
                              {order.items.length}
                            </Badge>
                          </TableCell>
                          <TableCell className='text-right font-semibold'>
                            {formatPrice(order.total)}
                          </TableCell>
                          <TableCell>
                            <Link href={`/account/orders/${order.id}`}>
                              <Button 
                                variant='ghost' 
                                size='sm'
                                className='opacity-0 group-hover:opacity-100 transition-opacity'
                              >
                                <Eye className='h-4 w-4 mr-2' />
                                View
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className='md:hidden space-y-4'>
                  {sortedOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/account/orders/${order.id}`}
                      className='block'
                    >
                      <Card className='hover:shadow-md transition-shadow'>
                        <CardContent className='p-4'>
                          <div className='flex items-start justify-between mb-3'>
                            <div>
                              <p className='font-mono text-xs text-muted-foreground mb-1'>
                                #{order.id.slice(0, 8)}
                              </p>
                              <p className='text-sm flex items-center gap-2'>
                                <Calendar className='h-3 w-3' />
                                {formatOrderDate(order.createdAt.toISOString())}
                              </p>
                            </div>
                            {getStatusBadge(order.status)}
                          </div>
                          
                          <Separator className='my-3' />
                          
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-4'>
                              <div>
                                <p className='text-xs text-muted-foreground'>Items</p>
                                <p className='text-sm font-medium'>
                                  {order.items.length}
                                </p>
                              </div>
                              <div>
                                <p className='text-xs text-muted-foreground'>Total</p>
                                <p className='text-sm font-semibold'>
                                  {formatPrice(order.total)}
                                </p>
                              </div>
                            </div>
                            <Button variant='ghost' size='sm'>
                              <Eye className='h-4 w-4' />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}