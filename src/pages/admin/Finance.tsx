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
    // ✅ NEW BUSINESS MODEL: Uses centralized commission engine (v2.0.0)
    // - Students pay: Property rent + 100 GHS (80 platform + 20 processing)
    // - Owners pay: 10% commission on property rent
    // - Platform absorbs Paystack fees (1.95%)
    const rates = centralizedCommissionEngine.getCommissionRates();
    const fees = centralizedCommissionEngine.getPlatformFees();
    const toNum = (v: unknown) => (typeof v === 'number' ? v : parseFloat(String(v || 0)) || 0);

    let totalProcessed = 0; // Sum of total_amount for paid/completed (students paid)
    let platformRevenue = 0; // 10% owner commission + 100 GHS student fee
    let platformFeeFromStudents = 0; // 100 GHS per booking from students
    let platformCommissionFromOwners = 0; // 10% of property rent from owners
    let agentCommissions = 0; // Should be 0 in new model
    let processorCosts = 0; // Paystack fees (platform absorbs)
    let ownerBase = 0; // Sum of property_rent (gross before commission)
    let ownerPayouts = 0; // Sum of owner_receives (net after 10% commission)

    const paidStatuses = new Set(['paid', 'completed', 'success']);

    for (const b of filteredData) {
      const total = toNum(b.total_amount);
      const fixedPlatform = toNum(b.platform_fee) || fees.fixed; // 100 GHS
      const platformCommission = toNum(b.platform_commission); // 10% of property rent
      const agentFee = toNum(b.agent_commission) || 0; // Should be 0
      const base = toNum(b.property_rent) || 0;
      const ownerReceives = toNum(b.owner_receives) || 0;

      // Calculate processor cost (platform absorbs this)
      const bookingProcessorCost = total * rates.paystack; // No VAT in new model

      if (paidStatuses.has((b.payment_status || '').toLowerCase())) {
        totalProcessed += total;
        platformFeeFromStudents += fixedPlatform;
        platformCommissionFromOwners += platformCommission;
        platformRevenue += (fixedPlatform + platformCommission);
        agentCommissions += agentFee;
        processorCosts += bookingProcessorCost;
        ownerBase += base;
        ownerPayouts += ownerReceives;
      }
    }

    const netPlatform = platformRevenue - processorCosts; // Net after absorbing Paystack fees

    return {
      totalProcessed,
      platformRevenue,
      platformFeeFromStudents,
      platformCommissionFromOwners,
      agentCommissions,
      processorCosts,
      netPlatform,
      ownerBase,
      ownerPayouts,
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
      <div className="container mx-auto p-10 space-y-6">
        {/* Header - CommeLab Style */}
        <div className="flex flex-wrap justify-between gap-4 items-start">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-gray-900">
              Finance Dashboard
            </h1>
            <p className="text-base font-normal leading-normal text-gray-600">
              Real-time revenue and payouts. Intelligence-ready for B2B insights.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Date Range Filter */}
            <div className="rounded-lg border border-gray-200 p-1 bg-white shadow-sm">
              <div className="flex">
                {(['7d','30d','90d'] as const).map((r) => (
                  <Button
                    key={r}
                    size="sm"
                    variant={range === r ? 'default' : 'ghost'}
                    onClick={() => setRange(r)}
                    className={range === r ? 'bg-[#3B82F6] hover:bg-[#2563EB]' : ''}
                  >
                    {r.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Campus filter */}
            <Select value={selectedCampus} onValueChange={setSelectedCampus}>
              <SelectTrigger className="w-40 h-10 border-gray-200 shadow-sm">
                <SelectValue placeholder="All Campuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campuses</SelectItem>
                {Array.from(new Set((props || []).map((p: PropertyLite) => p.city).filter(Boolean))).map((c) => (
                  <SelectItem key={String(c)} value={String((c as string).toLowerCase())}>{String(c)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Property filter */}
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-56 h-10 border-gray-200 shadow-sm">
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {(props || []).map((p: PropertyLite) => (
                  <SelectItem key={p.id} value={p.id}>{p.title || p.id}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => refetch()}
              className="h-10 border-gray-200 shadow-sm hover:bg-gray-50"
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={exportCSV}
              className="h-10 border-gray-200 shadow-sm hover:bg-gray-50"
            >
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

        {/* Metrics - CommeLab Style Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium leading-normal text-gray-700">
                Total Processed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                {formatCurrency(metrics.totalProcessed || 0)}
              </p>
              <p className="text-sm font-medium leading-normal text-green-600">
                {metrics.count} bookings
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium leading-normal text-gray-700">
                Platform Revenue (Gross)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                {formatCurrency(metrics.platformRevenue || 0)}
              </p>
              <p className="text-xs font-medium leading-normal text-blue-600">
                {formatCurrency(metrics.platformFeeFromStudents || 0)} from students (100 GHS/booking)
              </p>
              <p className="text-xs font-medium leading-normal text-purple-600">
                {formatCurrency(metrics.platformCommissionFromOwners || 0)} from owners (10%)
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium leading-normal text-gray-700">
                Net Platform Revenue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                {formatCurrency(metrics.netPlatform || 0)}
              </p>
              <p className="text-sm font-medium leading-normal text-gray-600">
                After processor costs
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium leading-normal text-gray-700">
                Owner Payouts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                {formatCurrency(metrics.ownerPayouts || 0)}
              </p>
              <p className="text-xs font-medium leading-normal text-gray-600">
                Net after 10% commission
              </p>
              <p className="text-xs font-medium leading-normal text-gray-500">
                Gross: {formatCurrency(metrics.ownerBase || 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium leading-normal text-gray-700">
                Agent Commissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                {formatCurrency(metrics.agentCommissions || 0)}
              </p>
              <p className="text-sm font-medium leading-normal text-orange-600">
                ⚠️ Disabled in Phase 1 (should be 0)
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium leading-normal text-gray-700">
                Processor Costs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                {formatCurrency(metrics.processorCosts || 0)}
              </p>
              <p className="text-sm font-medium leading-normal text-red-600">
                Paystack + VAT estimate
              </p>
            </CardContent>
          </Card>
        </div>


        {/* Charts Section - CommeLab Style Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Breakdown - Stacked Bar Chart */}
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium leading-normal text-gray-900">
                Revenue Breakdown
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Daily platform, owner, and agent distribution
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RBarChart data={stackedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <RTooltip
                      formatter={(value: any) => formatCurrency(Number(value || 0))}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                      iconType="circle"
                    />
                    <RBar dataKey="platform" stackId="a" fill="#3B82F6" name="Platform" radius={[4,4,0,0]} />
                    <RBar dataKey="owner" stackId="a" fill="#10B981" name="Owner" radius={[4,4,0,0]} />
                    <RBar dataKey="agent" stackId="a" fill="#F59E0B" name="Agent" radius={[4,4,0,0]} />
                  </RBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Campus Revenue - Bar Chart */}
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium leading-normal text-gray-900">
                Revenue by Campus
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Total revenue distribution across campuses
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RBarChart data={campusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <RTooltip
                      formatter={(value: any) => formatCurrency(Number(value || 0))}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                    />
                    <RBar dataKey="total" fill="#3B82F6" radius={[4,4,0,0]} name="Total Revenue" />
                  </RBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Processed Volume - Full Width Line Chart */}
        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium leading-normal text-gray-900">
                  Daily Processed Volume
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Total transaction volume over time
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">Last {range === '7d' ? '7 days' : range === '30d' ? '30 days' : '90 days'}</p>
                <p className="text-sm font-medium text-green-600">
                  {metrics.count > 0 ? `+${((metrics.totalProcessed / metrics.count)).toFixed(0)} avg` : 'No data'}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <RoomiLineChart data={chartData} lineColor="#3B82F6" />
            </div>
          </CardContent>
        </Card>

        {/* Data note for B2B intelligence - CommeLab Style */}
        <Alert className="border-blue-200 bg-blue-50 rounded-xl">
          <AlertDescription className="text-sm text-gray-700">
            <span className="font-semibold text-[#3B82F6]">Intelligence-ready:</span> Metrics are derived from bookings_enhanced with the centralized commission engine.
            Snapshots will be stored per-transaction in the upcoming Audit Ledger so you can sell accurate insights to B2B customers.
          </AlertDescription>
        </Alert>
      </div>
    </AdminLayout>
  );
};

export default Finance;

