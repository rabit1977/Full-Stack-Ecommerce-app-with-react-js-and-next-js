'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check, Copy, Gift, Mail, Share2, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ReferralCardProps {
  referralCode: string | null;
  referralCount: number;
}

export function ReferralCard({ referralCode, referralCount }: ReferralCardProps) {
  const [copied, setCopied] = useState(false);

  const referralLink = referralCode 
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/signup?ref=${referralCode}`
    : null;

  const handleCopy = async () => {
    if (!referralLink) return;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    if (!referralLink) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on our store!',
          text: 'Use my referral link to get started and we both earn rewards!',
          url: referralLink,
        });
      } catch {
        // User cancelled or share failed silently
      }
    } else {
      handleCopy();
    }
  };

  const handleEmailShare = () => {
    if (!referralLink) return;
    
    const subject = encodeURIComponent('Join me and get rewards!');
    const body = encodeURIComponent(
      `Hey!\n\nI've been shopping at this amazing store and thought you'd love it too.\n\nUse my referral link to sign up and we'll both earn rewards:\n${referralLink}\n\nSee you there!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  if (!referralCode) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Referral Program</CardTitle>
              <CardDescription>Your referral code is being generated...</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Referral Program</CardTitle>
              <CardDescription>Share and earn rewards together</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {referralCount} referral{referralCount !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* How it works */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4 space-y-3">
          <p className="text-sm font-medium">How it works:</p>
          <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold">1</span>
              Share your unique referral link
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold">2</span>
              Your friend signs up and makes a purchase
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold">3</span>
              You both earn loyalty points!
            </div>
          </div>
        </div>

        {/* Referral Code */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Referral Code</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={referralCode}
                readOnly
                className="font-mono text-center pr-10 bg-muted/50"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className={cn(
                'shrink-0 transition-colors',
                copied && 'bg-green-100 text-green-700 border-green-300'
              )}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Referral Link */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Referral Link</label>
          <div className="flex gap-2">
            <Input
              value={referralLink || ''}
              readOnly
              className="text-sm bg-muted/50 truncate"
            />
          </div>
        </div>

        {/* Share Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button onClick={handleShare} className="flex-1">
            <Share2 className="w-4 h-4 mr-2" />
            Share Link
          </Button>
          <Button variant="outline" onClick={handleEmailShare} className="flex-1">
            <Mail className="w-4 h-4 mr-2" />
            Email Invite
          </Button>
        </div>

        {/* Stats */}
        {referralCount > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Successful Referrals</span>
              <span className="text-lg font-bold text-primary">{referralCount}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
