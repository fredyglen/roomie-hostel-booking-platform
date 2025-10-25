import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

import { LineChart as RoomiLineChart } from '@/components/ui/chart';
import { Bar as RBar, BarChart as RBarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, Legend } from 'recharts';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, TrendingUp, DollarSign, Wallet, Activity } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { TABLE_NAMES } from '@/services/database/standardizedQueries';
import { centralizedCommissionEngine } from '@/config/centralized-commission.config';

// Simple date helpers
const subtractDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

// Types (minimal to keep the page self-contained)
interface BookingRow {
  id: string;
  total_amount: number | null;
  property_rent: number | null;
  platform_fee: number | null;
  agent_fee: number | null;
  payment_status: string | null;
  status: string | null;
  created_at: string | null;
  property_id?: string | null;
}


interface PropertyLite {
  id: string;
  title: string | null;
  city: string | null;
}

const Finance: React.FC = () => {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');

  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<string>('all');

  const startISO = useMemo(() => {
    if (range === '7d') return subtractDays(7);
    if (range === '90d') return subtractDays(90);
    return subtractDays(30);
  }, [range]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-finance', range],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLE_NAMES.BOOKINGS)
        .select('id,total_amount,property_rent,platform_fee,agent_fee,payment_status,status,created_at,property_id')
        .gte('created_at', startISO)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as BookingRow[]) || [];
    },
    refetchInterval: 60_000, // 1 min
  });

  const { data: props } = useQuery({
    queryKey: ['admin-finance-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLE_NAMES.PROPERTIES)
        .select('id,title,city')
        .order('title');
      if (error) throw error;
      return (data as PropertyLite[]) || [];
    },
    staleTime: 300_000,
  });

  const filteredData = useMemo(() => {
    let rows = (data || []) as BookingRow[];
    if (selectedProperty !== 'all') {
      rows = rows.filter(b => (b.property_id || '') === selectedProperty);
    }
    if (selectedCampus !== 'all' && props) {
      const ids = new Set((props as PropertyLite[])
        .map(p => ({ id: p.id, city: (p.city || '').toLowerCase() }))
        .filter(p => p.city === selectedCampus.toLowerCase())
        .map(p => p.id));
      rows = rows.filter(b => ids.has(String(b.property_id || '')));
    }
    return rows;
  }, [data, props, selectedCampus, selectedProperty]);

  const metrics = useMemo(() => {
    const rates = centralizedCommissionEngine.getCommissionRates();
    const toNum = (v: unknown) => (typeof v === 'number' ? v : parseFloat(String(v || 0)) || 0);

    let totalProcessed = 0; // Sum of total_amount for paid/completed
    let platformRevenue = 0; // Variable% of base + fixed platform fees
    let agentCommissions = 0;
    let processorCosts = 0; // Paystack + VAT estimate
    let ownerBase = 0; // Sum of property_rent

    const paidStatuses = new Set(['paid', 'completed', 'success']);

    for (const b of filteredData) {
      const total = toNum(b.total_amount);
      const fixedPlatform = toNum(b.platform_fee);
      const agentFee = toNum(b.agent_fee);
      const base = Number.isFinite(toNum(b.property_rent)) && toNum(b.property_rent) > 0
        ? toNum(b.property_rent)
        : Math.max(0, total - fixedPlatform - agentFee - (total * rates.paystack * (1 + rates.vat)));

      const variablePlatform = base * rates.platform;
      const bookingPlatformRevenue = variablePlatform + fixedPlatform;
      const bookingProcessorCost = total * rates.paystack * (1 + rates.vat);

      if (paidStatuses.has((b.payment_status || '').toLowerCase())) {
        totalProcessed += total;
        platformRevenue += bookingPlatformRevenue;
        agentCommissions += agentFee;
        processorCosts += bookingProcessorCost;
        ownerBase += base;
      }
    }

    const netPlatform = platformRevenue - processorCosts; // Net of gateway costs

    return {
      totalProcessed,
      platformRevenue,
      agentCommissions,
      processorCosts,
      netPlatform,
      ownerBase,
      count: filteredData.length,
    };
  }, [filteredData]);

  // Stacked breakdown data by day: platform vs owner vs agent
  const stackedData = useMemo(() => {
    const rates = centralizedCommissionEngine.getCommissionRates();
    const paid = new Set(['paid', 'completed', 'success']);
    const byDay = new Map<string, { platform: number; owner: number; agent: number }>();

    const toNum = (v: unknown) => (typeof v === 'number' ? v : parseFloat(String(v || 0)) || 0);

    for (const b of filteredData) {
      if (!paid.has((b.payment_status || '').toLowerCase())) continue;
      const day = (b.created_at || '').slice(0, 10);

      const total = toNum(b.total_amount);
      const fixedPlatform = toNum(b.platform_fee);
      const agentFee = toNum(b.agent_fee);
      const base = Number.isFinite(toNum(b.property_rent)) && toNum(b.property_rent) > 0
        ? toNum(b.property_rent)
        : Math.max(0, total - fixedPlatform - agentFee - (total * rates.paystack * (1 + rates.vat)));

      const variablePlatform = base * rates.platform;
      const platform = variablePlatform + fixedPlatform;
      const owner = base;
      const agent = agentFee > 0 ? agentFee : base * rates.agent;

      const current = byDay.get(day) || { platform: 0, owner: 0, agent: 0 };
      current.platform += platform;
      current.owner += owner;
      current.agent += agent;
      byDay.set(day, current);
    }

    return Array.from(byDay.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, v]) => ({ name, ...v }));
  }, [filteredData]);

  // Campus totals by property city (drill‑down)
  const campusData = useMemo(() => {
    const paid = new Set(['paid', 'completed', 'success']);
    const byCampus = new Map<string, number>();

    const propIndex = new Map((props || []).map((p) => [p.id, (p.city || 'Unknown')]));

    for (const b of filteredData) {
      if (!paid.has((b.payment_status || '').toLowerCase())) continue;
      const campus = propIndex.get(String(b.property_id || '')) || 'Unknown';
      const amt = typeof b.total_amount === 'number' ? b.total_amount : parseFloat(String(b.total_amount || 0)) || 0;
      byCampus.set(campus, (byCampus.get(campus) || 0) + amt);
    }

    return Array.from(byCampus.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, total]) => ({ name, total }));
  }, [filteredData, props]);

  const chartData = useMemo(() => {
    const paid = new Set(['paid', 'completed', 'success']);
    const byDay = new Map<string, number>();
    for (const b of filteredData) {
      if (!paid.has((b.payment_status || '').toLowerCase())) continue;
      const day = (b.created_at || '').slice(0, 10);
      const amt = typeof b.total_amount === 'number' ? b.total_amount : parseFloat(String(b.total_amount || 0)) || 0;
      byDay.set(day, (byDay.get(day) || 0) + amt);
    }
    return Array.from(byDay.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, total]) => ({ name, total }));
  }, [filteredData]);


  const exportCSV = () => {
    const header = [
      'id','created_at','payment_status','status','total_amount','property_rent','platform_fee','agent_fee','property_id'
    ];
    const rows = (filteredData || []).map(b => [
      b.id,
      b.created_at || '',
      b.payment_status || '',
      b.status || '',
      String(b.total_amount ?? 0),
      String(b.property_rent ?? 0),
      String(b.platform_fee ?? 0),
      String(b.agent_fee ?? 0),
      String(b.property_id || ''),
    ]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roomi_finance_${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout pageTitle="Finance" allowedRoles={['supreme_admin', 'campus_admin']}>
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Finance Dashboard</h1>
            <p className="text-sm text-gray-500">
              Real-time revenue and payouts. Intelligence-ready for B2B insights.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded border p-1 bg-white">
              <div className="flex">
                {(['7d','30d','90d'] as const).map((r) => (
                  <Button key={r} size="sm" variant={range === r ? 'default' : 'ghost'} onClick={() => setRange(r)}>
                    {r.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Campus filter */}
            <Select value={selectedCampus} onValueChange={setSelectedCampus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Campus" />

              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All campuses</SelectItem>
                {Array.from(new Set((props || []).map((p: PropertyLite) => p.city).filter(Boolean))).map((c) => (
                  <SelectItem key={String(c)} value={String((c as string).toLowerCase())}>{String(c)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Property filter */}
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All properties</SelectItem>
                {(props || []).map((p: PropertyLite) => (
                  <SelectItem key={p.id} value={p.id}>{p.title || p.id}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => refetch()}>
              Refresh
            </Button>
            <Button variant="outline" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          </div>
        </div>

        {/* RLS warning */}
        {isError && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertDescription>
              Permission denied reading bookings. Add admin RLS policy:
              <br />
              create policy "Admins can read all bookings (finance)" on bookings_enhanced for select
              using (exists (select 1 from profiles where id = auth.uid() and role in ('supreme_admin','campus_admin')));
            </AlertDescription>
          </Alert>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Total Processed</CardTitle></CardHeader>
            <CardContent className="text-2xl font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" /> {formatCurrency(metrics.totalProcessed || 0)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Platform Revenue (Gross)</CardTitle></CardHeader>
            <CardContent className="text-2xl font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" /> {formatCurrency(metrics.platformRevenue || 0)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Processor Costs (Paystack + VAT est.)</CardTitle></CardHeader>
            <CardContent className="text-2xl font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-rose-600" /> {formatCurrency(metrics.processorCosts || 0)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Net Platform Revenue</CardTitle></CardHeader>
            <CardContent className="text-2xl font-semibold flex items-center gap-2">
              <Wallet className="h-5 w-5 text-teal-600" /> {formatCurrency(metrics.netPlatform || 0)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Owner Payouts (Base Rent)</CardTitle></CardHeader>
            <CardContent className="text-2xl font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-amber-600" /> {formatCurrency(metrics.ownerBase || 0)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Agent Commissions</CardTitle></CardHeader>
            <CardContent className="text-2xl font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-sky-600" /> {formatCurrency(metrics.agentCommissions || 0)}
            </CardContent>
          </Card>


        {/* Revenue over time */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Daily Processed Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <RoomiLineChart data={chartData} lineColor="#3b82f6" />
            </div>
          </CardContent>
        </Card>

        {/* Stacked breakdown over time */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Daily Platform vs Owner vs Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RBarChart data={stackedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RTooltip formatter={(value: any) => formatCurrency(Number(value || 0))} />
                  <Legend />
                  <RBar dataKey="platform" stackId="a" fill="#6366F1" name="Platform" radius={[4,4,0,0]} />
                  <RBar dataKey="owner" stackId="a" fill="#34D399" name="Owner" radius={[4,4,0,0]} />
                  <RBar dataKey="agent" stackId="a" fill="#60A5FA" name="Agent" radius={[4,4,0,0]} />
                </RBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by campus */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Revenue by Campus (City)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RBarChart data={campusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RTooltip formatter={(value: any) => formatCurrency(Number(value || 0))} />
                  <RBar dataKey="total" fill="#10B981" radius={[4,4,0,0]} />
                </RBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        </div>

        {/* Data note for B2B intelligence */}
        <Alert className="border-indigo-200 bg-indigo-50">
          <AlertDescription>
            Intelligence-ready: metrics are derived from bookings_enhanced with the centralized commission engine.
            Snapshots will be stored per-transaction in the upcoming Audit Ledger so you can sell accurate insights to B2B customers.
          </AlertDescription>
        </Alert>
      </div>
    </AdminLayout>
  );
};

export default Finance;

