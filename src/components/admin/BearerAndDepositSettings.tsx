/**
 * Fee bearers + deposit policy — live pricing controls.
 *
 * Writes directly to the ACTIVE commission_configurations row. The server
 * engine reloads within 60s (cache TTL), so a change here reprices new
 * quotes/charges with no deploy. RLS: admins only.
 */
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

type Bearer = 'owner' | 'student' | 'platform';

interface Settings {
  id: string;
  commission_bearer: Bearer;
  fixed_fee_bearer: Bearer;
  paystack_bearer: Bearer;
  deposit_enabled: boolean;
  deposit_type: 'percent' | 'fixed';
  deposit_value: number;
  deposit_balance_due_days: number;
  booking_hold_hours: number;
}

const BEARER_LABELS: Record<Bearer, string> = {
  student: 'Student (added to their total)',
  owner: 'Owner (deducted from payout)',
  platform: 'Platform (absorbed by ROOMi)',
};

const BearerSelect: React.FC<{
  label: string; hint: string; value: Bearer; onChange: (v: Bearer) => void;
}> = ({ label, hint, value, onChange }) => (
  <div className="space-y-1.5">
    <Label>{label}</Label>
    <Select value={value} onValueChange={(v) => onChange(v as Bearer)}>
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent>
        {(Object.keys(BEARER_LABELS) as Bearer[]).map(b => (
          <SelectItem key={b} value={b}>{BEARER_LABELS[b]}</SelectItem>
        ))}
      </SelectContent>
    </Select>
    <p className="text-xs text-muted-foreground">{hint}</p>
  </div>
);

const BearerAndDepositSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await (supabase as never as { from: CallableFunction })
        .from('commission_configurations')
        .select('id, commission_bearer, fixed_fee_bearer, paystack_bearer, deposit_enabled, deposit_type, deposit_value, deposit_balance_due_days, booking_hold_hours')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error || !data) {
        toast({ title: 'Load failed', description: 'Could not load the active pricing configuration.', variant: 'destructive' });
      } else {
        setSettings(data as unknown as Settings);
      }
      setLoading(false);
    })();
  }, [toast]);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings(prev => (prev ? { ...prev, [key]: value } : prev));

  const save = async () => {
    if (!settings) return;
    if (settings.deposit_enabled) {
      if (settings.deposit_type === 'percent' && !(settings.deposit_value > 0 && settings.deposit_value < 1)) {
        toast({ title: 'Invalid deposit', description: 'Percent deposits must be between 0 and 1 (e.g. 0.5 = 50%).', variant: 'destructive' });
        return;
      }
      if (settings.deposit_type === 'fixed' && !(settings.deposit_value > 0)) {
        toast({ title: 'Invalid deposit', description: 'Fixed deposits must be a positive GHS amount.', variant: 'destructive' });
        return;
      }
    }
    setSaving(true);
    const { error } = await (supabase as never as { from: CallableFunction })
      .from('commission_configurations')
      .update({
        commission_bearer: settings.commission_bearer,
        fixed_fee_bearer: settings.fixed_fee_bearer,
        paystack_bearer: settings.paystack_bearer,
        deposit_enabled: settings.deposit_enabled,
        deposit_type: settings.deposit_type,
        deposit_value: settings.deposit_value,
        deposit_balance_due_days: settings.deposit_balance_due_days,
        booking_hold_hours: settings.booking_hold_hours,
        updated_at: new Date().toISOString(),
      })
      .eq('id', settings.id);
    setSaving(false);
    if (error) {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Pricing updated', description: 'New bookings and quotes use these settings (live within ~1 minute).' });
    }
  };

  if (loading) return <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading pricing controls…</CardContent></Card>;
  if (!settings) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Bearers &amp; Deposits</CardTitle>
        <CardDescription>
          Decide who pays each fee and how students can reserve rooms. Changes are live — no deployment needed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <BearerSelect label="Platform commission" hint="The percentage commission on rent."
            value={settings.commission_bearer} onChange={v => update('commission_bearer', v)} />
          <BearerSelect label="Fixed booking fee" hint="The flat per-booking fee."
            value={settings.fixed_fee_bearer} onChange={v => update('fixed_fee_bearer', v)} />
          <BearerSelect label="Processing (Paystack) fee" hint="The payment gateway charge."
            value={settings.paystack_bearer} onChange={v => update('paystack_bearer', v)} />
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Allow deposit reservations</Label>
              <p className="text-xs text-muted-foreground">Students can hold a room by paying part of the total upfront.</p>
            </div>
            <Switch checked={settings.deposit_enabled} onCheckedChange={v => update('deposit_enabled', v)} />
          </div>

          {settings.deposit_enabled && (
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-1.5">
                <Label>Deposit type</Label>
                <Select value={settings.deposit_type} onValueChange={v => update('deposit_type', v as 'percent' | 'fixed')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Percent of total</SelectItem>
                    <SelectItem value="fixed">Fixed GHS amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>{settings.deposit_type === 'percent' ? 'Deposit fraction (0.5 = 50%)' : 'Deposit amount (GHS)'}</Label>
                <Input type="number" step={settings.deposit_type === 'percent' ? '0.05' : '50'}
                  value={settings.deposit_value}
                  onChange={e => update('deposit_value', Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label>Balance due (days)</Label>
                <Input type="number" min={1} value={settings.deposit_balance_due_days}
                  onChange={e => update('deposit_balance_due_days', Number(e.target.value))} />
                <p className="text-xs text-muted-foreground">Unpaid balances release the bed after this.</p>
              </div>
              <div className="space-y-1.5">
                <Label>Unpaid hold (hours)</Label>
                <Input type="number" min={1} value={settings.booking_hold_hours}
                  onChange={e => update('booking_hold_hours', Number(e.target.value))} />
                <p className="text-xs text-muted-foreground">How long an unpaid booking keeps its bed.</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save pricing settings'}</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BearerAndDepositSettings;
