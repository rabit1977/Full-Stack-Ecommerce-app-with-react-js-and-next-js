'use client';

import { updateEmailPreferencesAction } from '@/actions/auth-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Bell, Mail, MessageSquare, ShoppingBag } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface EmailPreferencesCardProps {
  initialPreferences: {
    marketingEmails: boolean;
    orderEmails: boolean;
    reviewEmails: boolean;
  };
}

interface PreferenceOption {
  key: 'marketingEmails' | 'orderEmails' | 'reviewEmails';
  label: string;
  description: string;
  icon: typeof Mail;
}

const preferences: PreferenceOption[] = [
  {
    key: 'marketingEmails',
    label: 'Marketing Emails',
    description: 'Receive promotional offers, new arrivals, and sales updates',
    icon: Mail,
  },
  {
    key: 'orderEmails',
    label: 'Order Updates',
    description: 'Get notifications about your orders, shipping, and delivery',
    icon: ShoppingBag,
  },
  {
    key: 'reviewEmails',
    label: 'Review Reminders',
    description: 'Receive reminders to review products you\'ve purchased',
    icon: MessageSquare,
  },
];

export function EmailPreferencesCard({ initialPreferences }: EmailPreferencesCardProps) {
  const [prefs, setPrefs] = useState(initialPreferences);
  const [isPending, startTransition] = useTransition();
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const handleToggle = (key: PreferenceOption['key']) => {
    const newValue = !prefs[key];
    setPendingKey(key);

    startTransition(async () => {
      const result = await updateEmailPreferencesAction({ [key]: newValue });
      
      if (result.success) {
        setPrefs((prev) => ({ ...prev, [key]: newValue }));
        toast.success('Preference updated');
      } else {
        toast.error(result.message || 'Failed to update preference');
      }
      setPendingKey(null);
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Email Preferences</CardTitle>
            <CardDescription>Manage your email notification settings</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {preferences.map((pref) => {
          const Icon = pref.icon;
          const isLoading = pendingKey === pref.key;
          
          return (
            <div
              key={pref.key}
              className={cn(
                'flex items-start justify-between gap-4 p-4 rounded-lg border transition-colors',
                prefs[pref.key] ? 'bg-primary/5 border-primary/20' : 'bg-muted/30 border-border'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'p-2 rounded-lg',
                  prefs[pref.key] ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <Label htmlFor={pref.key} className="text-sm font-medium cursor-pointer">
                    {pref.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {pref.description}
                  </p>
                </div>
              </div>
              <Switch
                id={pref.key}
                checked={prefs[pref.key]}
                onCheckedChange={() => handleToggle(pref.key)}
                disabled={isPending}
                className={cn(isLoading && 'opacity-50')}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
