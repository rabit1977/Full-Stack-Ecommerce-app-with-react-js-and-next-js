'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Crown, Sparkles, Star, Trophy, Zap } from 'lucide-react';

interface LoyaltyCardProps {
  loyaltyPoints: number;
  loyaltyTier: string | null;
}

const tiers = {
  BRONZE: {
    name: 'Bronze',
    color: 'text-amber-700 dark:text-amber-500',
    bgColor: 'bg-amber-100 dark:bg-amber-950/50',
    borderColor: 'border-amber-300 dark:border-amber-700',
    icon: Star,
    minPoints: 0,
    maxPoints: 499,
    benefits: ['Free shipping on orders over $50', '1 point per $1 spent'],
  },
  SILVER: {
    name: 'Silver',
    color: 'text-slate-600 dark:text-slate-300',
    bgColor: 'bg-slate-100 dark:bg-slate-800',
    borderColor: 'border-slate-300 dark:border-slate-600',
    icon: Sparkles,
    minPoints: 500,
    maxPoints: 1499,
    benefits: ['Free shipping on all orders', '1.25 points per $1 spent', 'Early access to sales'],
  },
  GOLD: {
    name: 'Gold',
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-950/50',
    borderColor: 'border-yellow-400 dark:border-yellow-600',
    icon: Crown,
    minPoints: 1500,
    maxPoints: 4999,
    benefits: ['Free express shipping', '1.5 points per $1 spent', 'Exclusive member discounts', 'Birthday gift'],
  },
  PLATINUM: {
    name: 'Platinum',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-950/50',
    borderColor: 'border-purple-400 dark:border-purple-600',
    icon: Trophy,
    minPoints: 5000,
    maxPoints: 999999,
    benefits: ['Priority customer support', '2 points per $1 spent', 'VIP early access', 'Exclusive products', 'Annual gift'],
  },
};

type TierKey = keyof typeof tiers;

export function LoyaltyCard({ loyaltyPoints, loyaltyTier }: LoyaltyCardProps) {
  const currentTierKey = (loyaltyTier?.toUpperCase() || 'BRONZE') as TierKey;
  const currentTier = tiers[currentTierKey] || tiers.BRONZE;
  const TierIcon = currentTier.icon;

  // Calculate progress to next tier
  const tierKeys = Object.keys(tiers) as TierKey[];
  const currentTierIndex = tierKeys.indexOf(currentTierKey);
  const nextTierKey = tierKeys[currentTierIndex + 1];
  const nextTier = nextTierKey ? tiers[nextTierKey] : null;

  let progressValue = 100;
  let pointsToNext = 0;

  if (nextTier) {
    const rangeStart = currentTier.minPoints;
    const rangeEnd = nextTier.minPoints;
    const progress = ((loyaltyPoints - rangeStart) / (rangeEnd - rangeStart)) * 100;
    progressValue = Math.min(Math.max(progress, 0), 100);
    pointsToNext = rangeEnd - loyaltyPoints;
  }

  return (
    <Card className={cn('overflow-hidden border-2', currentTier.borderColor)}>
      <div className={cn('p-1', currentTier.bgColor)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-3 rounded-xl',
                currentTier.bgColor,
                'ring-2 ring-white/50'
              )}>
                <TierIcon className={cn('w-6 h-6', currentTier.color)} />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Loyalty Program
                  <Badge className={cn(currentTier.bgColor, currentTier.color, 'border-0')}>
                    {currentTier.name}
                  </Badge>
                </CardTitle>
                <CardDescription>Earn points on every purchase</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
      </div>
      
      <CardContent className="pt-4 space-y-4">
        {/* Points Display */}
        <div className="text-center py-4 bg-muted/30 rounded-xl">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-3xl font-bold">{loyaltyPoints.toLocaleString()}</span>
          </div>
          <p className="text-sm text-muted-foreground">Available Points</p>
        </div>

        {/* Progress to Next Tier */}
        {nextTier && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className={cn('font-medium', currentTier.color)}>
                {currentTier.name}
              </span>
              <span className={cn('font-medium', tiers[nextTierKey].color)}>
                {nextTier.name}
              </span>
            </div>
            <Progress value={progressValue} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              {pointsToNext.toLocaleString()} points until {nextTier.name}
            </p>
          </div>
        )}

        {/* Tier Benefits */}
        <div className="pt-2">
          <p className="text-sm font-medium mb-2">Your {currentTier.name} Benefits:</p>
          <ul className="space-y-1.5">
            {currentTier.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className={cn('w-1.5 h-1.5 rounded-full', currentTier.bgColor.replace('bg-', 'bg-'))} 
                  style={{ backgroundColor: 'currentColor' }}
                />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
