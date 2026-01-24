'use client';

import { motion } from 'framer-motion';
import {
    Package,
    PencilLine,
    Plus,
    Settings,
    ShoppingCart,
    Tag,
    Trash2,
    User,
    XCircle
} from 'lucide-react';

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface ActivityLogsProps {
  logs: ActivityLog[];
}

const getActivityIcon = (action: string) => {
  if (action.includes('PRODUCT_CREATED')) return { icon: Plus, color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-950' };
  if (action.includes('PRODUCT_UPDATED')) return { icon: PencilLine, color: 'text-blue-500 bg-blue-100 dark:bg-blue-950' };
  if (action.includes('PRODUCT_DELETED')) return { icon: Trash2, color: 'text-red-500 bg-red-100 dark:bg-red-950' };
  if (action.includes('ORDER')) return { icon: ShoppingCart, color: 'text-purple-500 bg-purple-100 dark:bg-purple-950' };
  if (action.includes('ORDER_CANCELLED')) return { icon: XCircle, color: 'text-red-500 bg-red-100 dark:bg-red-950' };
  if (action.includes('USER')) return { icon: User, color: 'text-amber-500 bg-amber-100 dark:bg-amber-950' };
  if (action.includes('COUPON')) return { icon: Tag, color: 'text-pink-500 bg-pink-100 dark:bg-pink-950' };
  if (action.includes('SETTINGS')) return { icon: Settings, color: 'text-slate-500 bg-slate-100 dark:bg-slate-800' };
  return { icon: Package, color: 'text-slate-500 bg-slate-100 dark:bg-slate-800' };
};

// Simple relative time formatter
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return new Date(date).toLocaleDateString();
}

export function ActivityLogs({ logs }: ActivityLogsProps) {
  if (logs.length === 0) {
    return (
      <div className='text-center py-12 text-muted-foreground'>
        <Package className='h-12 w-12 mx-auto mb-4 opacity-50' />
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className='space-y-1'>
      {logs.map((log, index) => {
        const { icon: Icon, color } = getActivityIcon(log.action);
        
        return (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className='flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group'
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Icon className='h-4 w-4' />
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-foreground line-clamp-2'>
                {log.description}
              </p>
              <div className='flex items-center gap-2 mt-1'>
                <span className='text-xs text-muted-foreground'>
                  {log.user.name || 'System'}
                </span>
                <span className='text-xs text-muted-foreground'>•</span>
                <span className='text-xs text-muted-foreground'>
                  {getRelativeTime(log.createdAt)}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
