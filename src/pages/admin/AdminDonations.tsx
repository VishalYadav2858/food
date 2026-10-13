import { useEffect, useState, useMemo } from 'react';
import { Search, Package, XCircle } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { DonationCard } from '@/components/DonationCard';
import { CardSkeleton } from '@/components/ui/Loading';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { getAllDonations, cancelDonation } from '@/services/api';
import type { Donation } from '@/types';
import { FOOD_CATEGORIES } from '@/types';
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

export function AdminDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');

  useEffect(() => { fetchDonations(); }, []);

  const fetchDonations = async () => {
    try {
      const data = await getAllDonations({});
      setDonations(data); setLoading(false);
    } catch (err: any) { setError(err.message); setLoading(false); }
  };

  const cities = useMemo(() => [...new Set(donations.map((d) => d.city))], [donations]);

  const filtered = donations
    .filter((d) => !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.donor?.name?.toLowerCase().includes(search.toLowerCase()))
    .filter((d) => statusFilter === 'all' || d.status === statusFilter)
    .filter((d) => categoryFilter === 'all' || d.category === categoryFilter)
    .filter((d) => cityFilter === 'all' || d.city === cityFilter);

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this donation? This will mark it as cancelled.')) return;
    try {
      await cancelDonation(id);
      setDonations(donations.map((d) => d.id === id ? { ...d, status: 'CANCELLED' } : d));
    } catch (err: any) { setError(err.message); }
  };

  return (
    <DashboardLayout navItems={navItems} role="admin" roleLabel="Admin">
      <h1 className="text-2xl font-bold text-gray-900">Donation Management</h1>
      <p className="mt-1 text-sm text-gray-500">View and moderate all platform donations</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm outline-none focus:border-green-500">
          <option value="all">All Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="CLAIMED">Claimed</option>
          <option value="PICKED_UP">Picked Up</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm outline-none focus:border-green-500">
          <option value="all">All Categories</option>
          {FOOD_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm outline-none focus:border-green-500">
          <option value="all">All Cities</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <p className="mt-4 text-sm text-gray-500">{filtered.length} donations</p>

      {loading ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">{[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : error ? (
        <div className="mt-4"><ErrorState message={error} onRetry={fetchDonations} /></div>
      ) : filtered.length === 0 ? (
        <div className="mt-4"><EmptyState icon={Package} title="No donations found" message="No donations match your filters." /></div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {filtered.map((d) => (
            <DonationCard
              key={d.id}
              donation={d}
              linkTo={`/admin/donations`}
              action={(d.status === 'AVAILABLE' || d.status === 'CLAIMED') ? (
                <button onClick={() => handleCancel(d.id)} className="flex items-center gap-1.5 text-xs font-medium text-red-600 transition hover:text-red-700">
                  <XCircle className="h-3.5 w-3.5" /> Cancel Donation (Moderate)
                </button>
              ) : undefined}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
