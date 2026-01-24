'use client';

import { cn } from '@/lib/utils';
import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { memo } from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'violet' | 'emerald' | 'blue' | 'amber' | 'rose';
  className?: string;
}

const colorVariants = {
  violet: {
    iconBg: 'bg-violet-100 dark:bg-violet-950/50',
    iconColor: 'text-violet-600 dark:text-violet-400',
    gradient: 'from-violet-500/10 to-transparent',
    trendUp: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30',
  },
  emerald: {
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    gradient: 'from-emerald-500/10 to-transparent',
    trendUp: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30',
  },
  blue: {
    iconBg: 'bg-blue-100 dark:bg-blue-950/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-500/10 to-transparent',
    trendUp: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
  },
  amber: {
    iconBg: 'bg-amber-100 dark:bg-amber-950/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    gradient: 'from-amber-500/10 to-transparent',
    trendUp: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30',
  },
  rose: {
    iconBg: 'bg-rose-100 dark:bg-rose-950/50',
    iconColor: 'text-rose-600 dark:text-rose-400',
    gradient: 'from-rose-500/10 to-transparent',
    trendUp: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30',
  },
};

/**
 * Premium Dashboard stat card component
 * Features gradient decorations, smooth hover effects, and trend indicators
 */
export const DashboardCard = memo(({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = 'violet',
  className,
}: DashboardCardProps) => {
  const colors = colorVariants[color];

  return (
    <div 
      className={cn(
        'stat-card group relative overflow-hidden',
        className
      )}
    >
      {/* Gradient Decoration */}
      <div 
        className={cn(
          'absolute top-0 right-0 w-32 h-32 bg-gradient-radial rounded-full blur-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-100',
          colors.gradient
        )} 
      />

      {/* Content */}
      <div className='relative z-10'>
        {/* Header */}
        <div className='flex items-start justify-between'>
          <p className='text-sm font-medium text-muted-foreground'>
            {title}
          </p>
          {Icon && (
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110',
              colors.iconBg
            )}>
              <Icon className={cn('h-5 w-5', colors.iconColor)} />
            </div>
          )}
        </div>

        {/* Value */}
        <div className='mt-4 space-y-1'>
          <p className='text-2xl sm:text-3xl font-bold tracking-tight'>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          
          {/* Description */}
          {description && (
            <p className='text-xs text-muted-foreground'>
              {description}
            </p>
          )}

          {/* Trend Indicator */}
          {trend && trend.value > 0 && (
            <div className='flex items-center gap-2 pt-2'>
              <span
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                  trend.isPositive
                    ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/50'
                    : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-950/50'
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className='h-3 w-3' />
                ) : (
                  <TrendingDown className='h-3 w-3' />
                )}
                {Math.abs(trend.value)}%
              </span>
              <span className='text-xs text-muted-foreground'>
                vs last month
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Border Glow */}
      <div className='absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-primary/20' />
    </div>
  );
});

DashboardCard.displayName = 'DashboardCard';