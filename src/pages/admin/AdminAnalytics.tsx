import { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Spinner } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/EmptyState';
import { supabase } from '@/lib/supabase';
import type { Donation } from '@/types';
import { format } from 'date-fns';
import { LayoutDashboard, Building2, Users, Package as PackageIcon, BarChart3, FileText, Settings } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'NGO Verification', path: '/admin/ngos', icon: Building2 },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Donations', path: '/admin/donations', icon: PackageIcon },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { label: 'Reports', path: '/admin/reports', icon: FileText },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#ef4444', '#14b8a6', '#8b5cf6', '#ec4899', '#6366f1'];

export function AdminAnalytics() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.from('donations').select('*')
      .then(({ data, error }) => {
        if (error) { setError(error.message); setLoading(false); return; }
        setDonations(data as Donation[]); setLoading(false);
      });
  }, []);

  const chartData = useMemo(() => {
    const last14Days = [...Array(14)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (13 - i));
      const dayStr = format(date, 'MMM d');
      const dayDonations = donations.filter((d) => {
        const dDate = new Date(d.created_at);
        return dDate.toDateString() === date.toDateString();
      });
      return {
        date: dayStr,
        donations: dayDonations.length,
        meals: dayDonations.reduce((sum, d) => sum + d.servings, 0),
      };
    });

    const categoryData = Object.entries(
      donations.reduce((acc, d) => { acc[d.category] = (acc[d.category] || 0) + 1; return acc; }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));

    const cityData = Object.entries(
      donations.reduce((acc, d) => { acc[d.city] = (acc[d.city] || 0) + 1; return acc; }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));

    const statusData = [
      { name: 'Available', value: donations.filter((d) => d.status === 'AVAILABLE').length },
      { name: 'Claimed', value: donations.filter((d) => d.status === 'CLAIMED').length },
      { name: 'Picked Up', value: donations.filter((d) => d.status === 'PICKED_UP').length },
      { name: 'Cancelled', value: donations.filter((d) => d.status === 'CANCELLED').length },
    ];

    return { last14Days, categoryData, cityData, statusData };
  }, [donations]);

  if (loading) {
    return (<DashboardLayout navItems={navItems} role="admin" roleLabel="Admin"><div className="flex justify-center py-20"><Spinner size="lg" /></div></DashboardLayout>);
  }
  if (error) {
    return (<DashboardLayout navItems={navItems} role="admin" roleLabel="Admin"><ErrorState message={error} /></DashboardLayout>);
  }

  return (
    <DashboardLayout navItems={navItems} role="admin" roleLabel="Admin">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      <p className="mt-1 text-sm text-gray-500">Platform-wide insights and trends</p>

      <div className="mt-6 space-y-6">
        {/* Donations over time */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Donations Over Time (Last 14 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.last14Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Legend />
              <Line type="monotone" dataKey="donations" stroke="#059669" strokeWidth={2} name="Donations" />
              <Line type="monotone" dataKey="meals" stroke="#3b82f6" strokeWidth={2} name="Meals" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Donations by Category */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Donations by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={chartData.categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                  {chartData.categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Donation Status Distribution */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Donation Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={chartData.statusData.filter((s) => s.value > 0)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                  {chartData.statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donations by City */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Donations by City</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData.cityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Bar dataKey="value" fill="#059669" radius={[8, 8, 0, 0]} name="Donations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
