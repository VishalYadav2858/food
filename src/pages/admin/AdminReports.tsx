import { useEffect, useState } from 'react';
import { FileText, Download, TrendingUp, Users, Package, CheckCircle2 } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { StatCard } from '@/components/StatCard';
import { Spinner } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/EmptyState';
import { supabase } from '@/lib/supabase';
import type { Profile, Donation } from '@/types';
import { formatDate, formatDateTime } from '@/utils/format';
import { LayoutDashboard, Building2, Users as UsersIcon, Package as PackageIcon, BarChart3, FileText as FileTextIcon, Settings } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'NGO Verification', path: '/admin/ngos', icon: Building2 },
  { label: 'Users', path: '/admin/users', icon: UsersIcon },
  { label: 'Donations', path: '/admin/donations', icon: PackageIcon },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { label: 'Reports', path: '/admin/reports', icon: FileTextIcon },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export function AdminReports() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      supabase.from('donations').select('*, donor:profiles!donations_donor_id_fkey(*), claimer:profiles!donations_claimed_by_fkey(*)'),
      supabase.from('profiles').select('*'),
    ]).then(([dRes, pRes]) => {
      if (dRes.error) { setError(dRes.error.message); setLoading(false); return; }
      if (pRes.error) { setError(pRes.error.message); setLoading(false); return; }
      setDonations(dRes.data as Donation[]);
      setProfiles(pRes.data as Profile[]);
      setLoading(false);
    });
  }, []);

  const completed = donations.filter((d) => d.status === 'PICKED_UP');
  const totalMeals = completed.reduce((sum, d) => sum + d.servings, 0);
  const totalFood = completed.reduce((sum, d) => sum + d.quantity, 0);
  const donors = profiles.filter((p) => p.role === 'donor');
  const ngos = profiles.filter((p) => p.role === 'ngo');

  const exportCSV = () => {
    const headers = ['Title', 'Category', 'Quantity', 'Unit', 'Servings', 'Status', 'City', 'Donor', 'Claimer', 'Created At', 'Picked Up At'];
    const rows = donations.map((d) => [
      `"${d.title}"`, d.category, d.quantity, d.unit, d.servings, d.status, d.city,
      `"${d.donor?.name || ''}"`, `"${d.claimer?.organization_name || d.claimer?.name || ''}"`,
      formatDate(d.created_at), d.picked_up_at ? formatDateTime(d.picked_up_at) : '',
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `foodlink-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (<DashboardLayout navItems={navItems} role="admin" roleLabel="Admin"><div className="flex justify-center py-20"><Spinner size="lg" /></div></DashboardLayout>);
  }
  if (error) {
    return (<DashboardLayout navItems={navItems} role="admin" roleLabel="Admin"><ErrorState message={error} /></DashboardLayout>);
  }

  return (
    <DashboardLayout navItems={navItems} role="admin" roleLabel="Admin">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="mt-1 text-sm text-gray-500">Platform activity reports and data export</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Donors" value={donors.length} color="green" />
        <StatCard icon={Building2} label="Verified NGOs" value={ngos.filter((n) => n.is_verified).length} color="blue" />
        <StatCard icon={Package} label="Total Donations" value={donations.length} color="teal" />
        <StatCard icon={CheckCircle2} label="Completed Pickups" value={completed.length} color="emerald" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50/50 p-6">
          <TrendingUp className="h-8 w-8 text-green-600" />
          <p className="mt-3 text-3xl font-bold text-gray-900">{totalMeals}</p>
          <p className="text-sm text-gray-600">Total Meals Redistributed</p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-6">
          <Package className="h-8 w-8 text-blue-600" />
          <p className="mt-3 text-3xl font-bold text-gray-900">{totalFood}</p>
          <p className="text-sm text-gray-600">Total Food Rescued (units)</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">All Donations Log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Qty</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Servings</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">City</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Donor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {donations.map((d) => (
                <tr key={d.id} className="transition hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{d.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{d.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{d.quantity} {d.unit}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{d.servings}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${d.status === 'PICKED_UP' ? 'bg-emerald-100 text-emerald-700' : d.status === 'CLAIMED' ? 'bg-blue-100 text-blue-700' : d.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : d.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{d.status}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{d.city}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{d.donor?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(d.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
